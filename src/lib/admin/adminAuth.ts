import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AdminUser, AdminSession } from '../../types/admin';

export class AdminAuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export const adminAuth = {
  async signIn(email: string, password: string): Promise<AdminSession> {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is an admin
      const adminUser = await this.getAdminUser(user.uid);
      if (!adminUser) {
        await signOut(auth);
        throw new AdminAuthError('User is not authorized as an admin', 'UNAUTHORIZED');
      }
      
      if (!adminUser.isActive) {
        await signOut(auth);
        throw new AdminAuthError('Admin account is deactivated', 'ACCOUNT_DISABLED');
      }
      
      // Update last login
      await this.updateLastLogin(adminUser.uid);
      
      // Create session
      const session: AdminSession = {
        adminUserId: adminUser.uid,
        email: adminUser.email,
        displayName: adminUser.displayName,
        role: adminUser.role,
        permissions: adminUser.permissions,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      return session;
    } catch (error: any) {
      if (error instanceof AdminAuthError) {
        throw error;
      }
      
      // Handle Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          throw new AdminAuthError('Invalid email or password', 'INVALID_CREDENTIALS');
        case 'auth/too-many-requests':
          throw new AdminAuthError('Too many failed attempts. Please try again later.', 'TOO_MANY_REQUESTS');
        default:
          throw new AdminAuthError('Authentication failed', 'AUTH_ERROR');
      }
    }
  },

  async signOut(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
  },

  async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', uid));
      if (!adminDoc.exists()) {
        return null;
      }
      return adminDoc.data() as AdminUser;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }
  },

  async updateLastLogin(uid: string): Promise<void> {
    try {
      const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
      await updateDoc(doc(db, 'admin_users', uid), {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  },

  getCurrentUser(): User | null {
    const auth = getAuth();
    return auth.currentUser;
  },

  async validateSession(session: AdminSession): Promise<boolean> {
    if (!session || Date.now() > session.expiresAt) {
      return false;
    }
    
    // Verify user still exists and is active
    const adminUser = await this.getAdminUser(session.adminUserId);
    return adminUser?.isActive === true;
  }
};