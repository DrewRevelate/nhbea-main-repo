import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore();

// 2025 Conference Data
const conference2025 = {
  // Basic Information
  title: '102nd Annual NHBEA Conference',
  description: 'Join us for the 102nd Annual New Hampshire Business Education Association Conference featuring workshops on Marketing & AI, Financial Literacy, Work-Study Programs, and Early College High School programs. Network with fellow educators and gain valuable insights to ignite your future in business education!',
  year: 2025,

  // Event Details
  schedule: {
    date: Timestamp.fromDate(new Date('2025-10-24T08:00:00')),
    startTime: '08:00',
    endTime: '14:00',
    timezone: 'America/New_York'
  },

  // Location
  location: {
    venue: 'Manchester Community College',
    address: {
      street: '1066 Front Street',
      city: 'Manchester',
      state: 'NH',
      zipCode: '03102'
    },
    virtualOption: false
  },

  // Registration Management
  registration: {
    isOpen: true,
    openDate: Timestamp.fromDate(new Date('2025-08-01')),
    closeDate: Timestamp.fromDate(new Date('2025-10-20')),
    capacity: 150,
    currentCount: 0,
    waitlistEnabled: true,

    fees: {
      member: 75,
      nonMember: 100,
      student: 25,
      earlyBird: {
        amount: 60,
        deadline: Timestamp.fromDate(new Date('2025-09-15'))
      }
    },

    requiredFields: ['fullName', 'email', 'institution', 'membershipStatus'],
    waitingList: []
  },

  // Content & Media
  media: {
    imageURL: '/images/conference-2025.jpg',
    programURL: '/conference-program.html'
  },

  // Speakers Array
  speakers: [
    {
      id: 'rony-camille',
      name: 'Rony Camille',
      title: 'Media Manager',
      organization: 'Town of Tyngsboro, MA',
      bio: 'A communications and public affairs executive with 20+ years of experience. My career bridges journalism, digital media, and municipal leadership. At ABC News, I produced and edited stories that reached millions across broadcast and digital platforms. At WBZ NewsRadio/iHeartMedia, I drove more than 1.2 million unique digital views. In municipal leadership for Tyngsborough, Massachusetts, I increased website traffic by 1,800% and secured $250K+ in federal funding to expand civic engagement infrastructure. Today, as Media Program Director in Massachusetts, I oversee $1.2M in reserves, guide staff teams, and modernize platforms that make government more transparent and accessible.',
      websiteURL: 'https://www.ronycamille.com/',
      expertise: ['Communication', 'Digital Media', 'Public Affairs', 'Civic Engagement'],
      sessionIds: ['keynote-1'],
      isKeynote: true,
      featured: true
    },
    {
      id: 'stephen-lynn',
      name: 'Stephen Lynn',
      title: 'Vice President, Branch Leader',
      organization: 'Fidelity Investments',
      bio: 'Steve Lynn is a seasoned financial services executive currently serving as the VP and Branch Leader at Fidelity Investments in Nashua, New Hampshire. With a robust career spanning over 17 years at Fidelity, he has held various leadership positions, demonstrating a strong commitment to client service and operational excellence. His extensive experience in the financial investment sector has equipped him with a deep understanding of market dynamics and customer needs. Steve has a passion for mentoring emerging leaders and fostering a culture of continuous improvement.',
      expertise: ['Financial Literacy', 'Financial Services', 'Leadership', 'Education'],
      sessionIds: ['workshop-1'],
      isKeynote: false,
      featured: true
    },
    {
      id: 'major-wheelock',
      name: 'Major Wheelock',
      title: 'ECHS Coordinator',
      organization: 'MCC ECHS',
      bio: '20 years\' experience as a successful Leader/Operations Manager. Actively engages with students and successfully manages enrollment and retention. Excels at communication with small groups and with large audiences. Developed and provided continuous training for academic advisors, staff members, and faculty. Taught First Year Experience course as well as undergraduate and graduate business courses. Exceptional decision-making and problem-solving skills in student-focused environments.',
      expertise: ['Early College Programs', 'Student Services', 'Operations Management', 'Higher Education'],
      sessionIds: ['workshop-2'],
      isKeynote: false,
      featured: true
    },
    {
      id: 'drew-lambert',
      name: 'Drew Lambert',
      title: 'Founder, Senior Salesforce Engineer',
      organization: 'Revelate Operations LLC / Bevi',
      bio: 'Drew Lambert is a Senior Salesforce Engineer at Bevi and founder of Revelate Operations LLC. With deep expertise in Salesforce architecture, process optimization, and AI-driven automation, Drew has transformed how teams operate by designing scalable solutions. His consulting practice focuses on helping organizations unlock growth through RevOps strategy, intelligent automation, and deploying AI agents to accelerate sales enablement.',
      expertise: ['Marketing', 'AI', 'Automation', 'Salesforce', 'Revenue Operations'],
      sessionIds: ['workshop-3'],
      isKeynote: false,
      featured: true
    },
    {
      id: 'dean-graziano',
      name: 'Dean Graziano, J.D.',
      title: 'Vice President of Corporate Work-Study',
      organization: 'Rochester Career & Technical Center',
      bio: 'A multi-state award-winning educator with over 29 years in education. Selected as the State of New Hampshire\'s Extended Learning Opportunity Coordinator-of-the-Year in 2017. Work-force pilot program in Rochester, NH was singled out by Governor Sununu as the model for the State of NH Career Academies. Developed and implemented innovative mobile classroom solutions to bring CTE/WBL programming to all NH students.',
      expertise: ['Work-Study Programs', 'CTE', 'Career Education', 'Program Development'],
      sessionIds: ['workshop-4'],
      isKeynote: false,
      featured: true
    },
    {
      id: 'maria-matarazzo',
      name: 'Maria Matarazzo',
      title: 'Professor and Chair',
      organization: 'UMass Lowell, Manning School of Business',
      bio: 'Maria Matarazzo is an experienced professor and Chair with a demonstrated history of successfully achieving organizational goals in higher education. She is skilled in teaching business and marketing curriculum, writing courses, student advising, supervision of faculty, program design and development, community outreach, career advisement, and accreditation strategies. Maria was awarded Teacher of the Year for the state of New Hampshire in Business Education.',
      expertise: ['Marketing', 'Entrepreneurship', 'Innovation', 'Higher Education'],
      sessionIds: ['roundtable-1'],
      isKeynote: false,
      featured: false
    },
    {
      id: 'james-dowding',
      name: 'James Dowding',
      title: 'Business Educator',
      organization: 'Nashua High School North',
      bio: 'A versatile educator with significant and varied academic and business experience; a demonstrated track record of developing effective training situations for individuals and groups; responsible for budget development and implementation and able to build highly functioning teams. Currently serving as an Accounting/Finance teacher at the Academy of Finance with the Nashua Technology Center.',
      expertise: ['Accounting', 'Finance', 'Business Education', 'Global Business'],
      sessionIds: ['roundtable-2'],
      isKeynote: false,
      featured: false
    },
    {
      id: 'catherine-lambert',
      name: 'Catherine Lambert, MS MEd CAGS',
      title: 'Licensed Mental Health Counselor',
      organization: 'Therosa Counseling',
      bio: 'As a Licensed Mental Health Counselor in New Hampshire and Massachusetts, and the founder of Therosa Counseling, LLC, Catherine has worked with individuals, couples, and families who have endured deep loss, shame, and hardship. She developed The Scenic Path — a therapeutic framework that blends clinical models with a visual, metaphorical journey toward authenticity. Her mission is to help people rediscover that their life has meaning and that peace is possible.',
      expertise: ['Mental Health', 'Trauma-Informed Education', 'Counseling', 'Student Wellbeing'],
      sessionIds: ['roundtable-3'],
      isKeynote: false,
      featured: false
    }
  ],

  // Agenda with Sessions
  agenda: {
    sessions: [
      {
        id: 'registration',
        title: 'Registration',
        description: 'Check-in and registration for conference attendees',
        startTime: Timestamp.fromDate(new Date('2025-10-24T08:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T08:30:00')),
        track: 'General',
        type: 'break',
        level: 'all'
      },
      {
        id: 'welcome',
        title: 'Welcome',
        description: 'Welcome remarks from MCC VPAA',
        startTime: Timestamp.fromDate(new Date('2025-10-24T08:45:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T08:50:00')),
        track: 'General',
        type: 'keynote',
        speaker: 'Colleen Jennings, MCC VPAA',
        level: 'all'
      },
      {
        id: 'prayer-pledge',
        title: 'Prayer & Pledge',
        description: 'Opening prayer and pledge of allegiance',
        startTime: Timestamp.fromDate(new Date('2025-10-24T08:50:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T08:55:00')),
        track: 'General',
        type: 'keynote',
        level: 'all'
      },
      {
        id: 'keynote-intro',
        title: 'Introduction of Keynote',
        description: 'Introduction of keynote speaker',
        startTime: Timestamp.fromDate(new Date('2025-10-24T08:55:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T09:00:00')),
        track: 'General',
        type: 'keynote',
        speaker: 'Dorothy O\'Gara, NHBEA President',
        level: 'all'
      },
      {
        id: 'keynote-1',
        title: 'Keynote Address: The Future of Communication in Education',
        description: 'Communications and public affairs executive Rony Camille shares insights from 20+ years bridging journalism, digital media, and municipal leadership.',
        startTime: Timestamp.fromDate(new Date('2025-10-24T09:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T09:45:00')),
        track: 'General',
        type: 'keynote',
        speaker: 'rony-camille',
        level: 'all',
        learningObjectives: [
          'Understand modern communication strategies for educational settings',
          'Learn how to leverage digital media for civic engagement',
          'Discover approaches to build trust and transparency through communication'
        ]
      },
      {
        id: 'workshop-1',
        title: 'NH Graduation Requirements – Financial Literacy',
        description: 'Explore New Hampshire\'s financial literacy graduation requirements and strategies for improving outcomes in your classroom.',
        startTime: Timestamp.fromDate(new Date('2025-10-24T10:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T11:00:00')),
        track: 'Workshop Track A',
        type: 'workshop',
        speaker: 'stephen-lynn',
        room: 'Room Main 272',
        level: 'all',
        learningObjectives: [
          'Understand NH financial literacy requirements',
          'Implement effective financial literacy curriculum',
          'Improve student outcomes in financial education'
        ]
      },
      {
        id: 'workshop-2',
        title: 'Early College High School',
        description: 'Learn about Early College High School programs and how to successfully manage enrollment and retention.',
        startTime: Timestamp.fromDate(new Date('2025-10-24T10:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T11:00:00')),
        track: 'Workshop Track B',
        type: 'workshop',
        speaker: 'major-wheelock',
        room: 'Room Main 274',
        level: 'all',
        learningObjectives: [
          'Understand ECHS program structures',
          'Learn enrollment and retention strategies',
          'Explore student support services in ECHS'
        ]
      },
      {
        id: 'workshop-3',
        title: 'Marketing and AI',
        description: 'Discover how AI is transforming marketing education and explore practical applications for the classroom.',
        startTime: Timestamp.fromDate(new Date('2025-10-24T11:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T12:00:00')),
        track: 'Workshop Track A',
        type: 'workshop',
        speaker: 'drew-lambert',
        room: 'Room Main 272',
        level: 'intermediate',
        learningObjectives: [
          'Understand AI applications in modern marketing',
          'Explore AI tools for classroom use',
          'Learn automation strategies for business processes'
        ]
      },
      {
        id: 'workshop-4',
        title: 'Work-Study Programs',
        description: 'Explore innovative work-study program models and learn how to implement CTE/WBL programming in your school.',
        startTime: Timestamp.fromDate(new Date('2025-10-24T11:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T12:00:00')),
        track: 'Workshop Track B',
        type: 'workshop',
        speaker: 'dean-graziano',
        room: 'Room Main 274',
        level: 'all',
        learningObjectives: [
          'Understand work-study program structures',
          'Learn about NH Career Academy models',
          'Explore innovative CTE/WBL delivery methods'
        ]
      },
      {
        id: 'roundtable-1',
        title: 'Marketing, Entrepreneurship & Innovation',
        description: 'Cellphone and Technology Policies in the Classroom that Address New NH State Law',
        startTime: Timestamp.fromDate(new Date('2025-10-24T12:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:00:00')),
        track: 'Roundtable',
        type: 'panel',
        speaker: 'maria-matarazzo',
        room: 'MCC Meeting Room',
        level: 'all'
      },
      {
        id: 'roundtable-2',
        title: 'The Global Spin',
        description: 'Interactive roundtable discussion on global business perspectives',
        startTime: Timestamp.fromDate(new Date('2025-10-24T12:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:00:00')),
        track: 'Roundtable',
        type: 'panel',
        speaker: 'james-dowding',
        room: 'MCC Meeting Room',
        level: 'all'
      },
      {
        id: 'roundtable-3',
        title: 'Trauma in the Classroom',
        description: 'Understanding and addressing trauma in educational settings',
        startTime: Timestamp.fromDate(new Date('2025-10-24T12:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:00:00')),
        track: 'Roundtable',
        type: 'panel',
        speaker: 'catherine-lambert',
        room: 'MCC Meeting Room',
        level: 'all'
      },
      {
        id: 'lunch',
        title: 'Lunch Break',
        description: 'Networking lunch',
        startTime: Timestamp.fromDate(new Date('2025-10-24T13:00:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:30:00')),
        track: 'General',
        type: 'break',
        level: 'all'
      },
      {
        id: 'annual-meeting',
        title: 'Annual Meeting',
        description: 'NHBEA Annual Business Meeting',
        startTime: Timestamp.fromDate(new Date('2025-10-24T13:30:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:35:00')),
        track: 'General',
        type: 'networking',
        level: 'all'
      },
      {
        id: 'elections',
        title: 'Election of 2026 Officers',
        description: 'Vote for the 2026 NHBEA Officer slate',
        startTime: Timestamp.fromDate(new Date('2025-10-24T13:35:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:45:00')),
        track: 'General',
        type: 'networking',
        level: 'all'
      },
      {
        id: 'awards',
        title: 'Presentation of Awards',
        description: 'Recognition of outstanding business educators',
        startTime: Timestamp.fromDate(new Date('2025-10-24T13:45:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T13:55:00')),
        track: 'General',
        type: 'networking',
        level: 'all'
      },
      {
        id: 'closing',
        title: 'Closing Remarks',
        description: 'Conference closing',
        startTime: Timestamp.fromDate(new Date('2025-10-24T13:55:00')),
        endTime: Timestamp.fromDate(new Date('2025-10-24T14:00:00')),
        track: 'General',
        type: 'networking',
        level: 'all'
      }
    ],
    tracks: ['General', 'Workshop Track A', 'Workshop Track B', 'Roundtable'],
    timeSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
  },

  // Theme
  theme: {
    primaryColor: '#1a365d',
    secondaryColor: '#d69e2e',
    accentColor: '#fbbf24',
    backgroundGradient: {
      from: '#1a365d',
      to: '#2563eb'
    },
    brandingElements: {
      shapingTheFuture: true,
      animatedElements: false
    }
  },

  // Status Management
  status: 'registration_open',

  // Metadata
  metadata: {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'admin',
    featured: true
  }
};

async function addConference() {
  try {
    console.log('Adding 2025 NHBEA Conference to Firestore...');

    const conferenceRef = await db.collection('conference').add(conference2025);

    console.log('✅ Conference added successfully!');
    console.log('Conference ID:', conferenceRef.id);
    console.log('\nNext steps:');
    console.log('1. Verify the conference data in Firebase Console');
    console.log('2. Check the /conference page on your website');
    console.log('3. Test registration flow');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding conference:', error);
    process.exit(1);
  }
}

addConference();
