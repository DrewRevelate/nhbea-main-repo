import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { AdminUser, CreateAdminUserRequest, UpdateAdminUserRequest } from '../../types/admin';
import { permissions } from './permissions';
import { validation } from './validation';

export class AdminUserServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AdminUserServiceError';
  }
}

export const adminUserService = {
  // Collection reference
  get collection() {
    return collection(db, 'admin_users');
  },

  // Get all admin users
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const q = query(
        this.collection,
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
      } as AdminUser));
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw new AdminUserServiceError('Failed to fetch admin users', 'FETCH_ERROR');
    }
  },

  // Get admin user by UID
  async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const docRef = doc(this.collection, uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        ...docSnap.data(),
        uid: docSnap.id,
      } as AdminUser;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      throw new AdminUserServiceError('Failed to fetch admin user', 'FETCH_ERROR');
    }
  },

  // Get admin user by email
  async getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    try {
      const q = query(
        this.collection,
        where('email', '==', email),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        ...doc.data(),
        uid: doc.id,
      } as AdminUser;
    } catch (error) {
      console.error('Error fetching admin user by email:', error);
      throw new AdminUserServiceError('Failed to fetch admin user', 'FETCH_ERROR');
    }
  },

  // Create admin user
  async createAdminUser(
    userData: CreateAdminUserRequest,
    createdBy: string
  ): Promise<AdminUser> {
    try {
      // Validate input data
      const validatedData = validation.validateCreateAdminUser(userData);
      
      // Check if user already exists
      const existingUser = await this.getAdminUserByEmail(validatedData.email);
      if (existingUser) {
        throw new AdminUserServiceError('User with this email already exists', 'USER_EXISTS');
      }

      // For now, we'll create the user document without Firebase Auth
      // In a real implementation, you'd use Firebase Auth Admin SDK
      const adminUserData: Omit<AdminUser, 'uid'> = {
        email: validatedData.email,
        displayName: validation.sanitizeDisplayName(validatedData.displayName),
        role: validatedData.role,
        permissions: permissions.validatePermissions(validatedData.permissions),
        isActive: true,
        createdAt: serverTimestamp() as Timestamp,
        createdBy,
        lastModified: serverTimestamp() as Timestamp,
      };

      const docRef = await addDoc(this.collection, adminUserData);
      
      return {
        ...adminUserData,
        uid: docRef.id,
        createdAt: new Date() as any, // Firestore will set the actual timestamp
        lastModified: new Date() as any,
      };
    } catch (error) {
      if (error instanceof AdminUserServiceError) {
        throw error;
      }
      
      console.error('Error creating admin user:', error);
      throw new AdminUserServiceError('Failed to create admin user', 'CREATE_ERROR');
    }
  },

  // Update admin user
  async updateAdminUser(
    uid: string,
    updates: UpdateAdminUserRequest,
    updatedBy: string
  ): Promise<AdminUser> {
    try {
      // Validate input data
      const validatedUpdates = validation.validateUpdateAdminUser(updates);
      
      // Check if user exists
      const existingUser = await this.getAdminUser(uid);
      if (!existingUser) {
        throw new AdminUserServiceError('Admin user not found', 'USER_NOT_FOUND');
      }

      const updateData: Partial<AdminUser> = {
        ...validatedUpdates,
        lastModified: serverTimestamp() as Timestamp,
      };

      // Sanitize display name if provided
      if (updateData.displayName) {
        updateData.displayName = validation.sanitizeDisplayName(updateData.displayName);
      }

      // Validate permissions if provided
      if (updateData.permissions) {
        updateData.permissions = permissions.validatePermissions(updateData.permissions);
      }

      const docRef = doc(this.collection, uid);
      await updateDoc(docRef, updateData as any);
      
      // Return updated user
      return {
        ...existingUser,
        ...updateData,
        lastModified: new Date() as any,
      };
    } catch (error) {
      if (error instanceof AdminUserServiceError) {
        throw error;
      }
      
      console.error('Error updating admin user:', error);
      throw new AdminUserServiceError('Failed to update admin user', 'UPDATE_ERROR');
    }
  },

  // Deactivate admin user
  async deactivateAdminUser(uid: string, deactivatedBy: string): Promise<AdminUser> {
    return this.updateAdminUser(uid, { isActive: false }, deactivatedBy);
  },

  // Activate admin user
  async activateAdminUser(uid: string, activatedBy: string): Promise<AdminUser> {
    return this.updateAdminUser(uid, { isActive: true }, activatedBy);
  },

  // Delete admin user (soft delete by deactivating)
  async deleteAdminUser(uid: string, deletedBy: string): Promise<void> {
    try {
      // For safety, we'll deactivate instead of hard delete
      await this.deactivateAdminUser(uid, deletedBy);
      
      // In a real implementation, you might also:
      // 1. Delete the Firebase Auth user
      // 2. Create an audit log entry
      // 3. Handle cleanup of user sessions
    } catch (error) {
      if (error instanceof AdminUserServiceError) {
        throw error;
      }
      
      console.error('Error deleting admin user:', error);
      throw new AdminUserServiceError('Failed to delete admin user', 'DELETE_ERROR');
    }
  },

  // Check if user can perform action on target user
  canManageUser(currentUser: AdminUser, targetUser: AdminUser): boolean {
    return permissions.canManageUser(currentUser, targetUser);
  },

  // Get users by role
  async getUsersByRole(role: AdminUser['role']): Promise<AdminUser[]> {
    try {
      const q = query(
        this.collection,
        where('role', '==', role),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
      } as AdminUser));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new AdminUserServiceError('Failed to fetch users by role', 'FETCH_ERROR');
    }
  },

  // Get active admin users count
  async getActiveUsersCount(): Promise<number> {
    try {
      const q = query(
        this.collection,
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting active users:', error);
      return 0;
    }
  }
};