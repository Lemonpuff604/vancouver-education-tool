// Comprehensive Vancouver Area Schools Database
// Updated with Private Schools, IB Schools, and Independent Schools
// Includes application deadlines, preparation timelines, and detailed requirements

export interface School {
  id: string;
  name: string;
  type: 'Public' | 'Private' | 'Independent' | 'IB' | 'Religious' | 'Montessori' | 'Alternative';
  level: 'preschool' | 'elementary' | 'middle' | 'high' | 'k12';
  grades: string;
  location: string;
  tuition: number | 'Free' | string;
  applicationDeadline: string;
  tourDates: string;
  preparationStart: string;
  specialty: string[];
  features: string[];
  description: string;
  competitiveness: 'Low' | 'Moderate' | 'High' | 'Very High';
  acceptanceRate?: string;
  averageClassSize?: number;
  studentToTeacherRatio?: string;
  uniformRequired?: boolean;
  boardingAvailable?: boolean;
  languagePrograms?: string[];
  entranceRequirements?: string[];
  preparationTips?: string[];
  keyDates?: {
    applicationOpen: string;
    applicationDeadline: string;
    assessmentDates: string;
    interviewDates: string;
    decisionDate: string;
    tourDates: string;
  };
}

export const comprehensiveSchools: School[] = [
  // === IB WORLD SCHOOLS ===
  {
    id: 'mulgrave-school',
    name: 'Mulgrave School',
    type: 'IB',
    level: 'k12',
    grades: 'PK3-Grade 12',
    location: 'West Vancouver',
    tuition: 32970,
    applicationDeadline: 'November 1, 2024 (Late applications accepted for Grades 10-11)',
    tourDates: 'September-June (Book online)',
    preparationStart: '18 months before entry',
    specialty: ['International Baccalaureate', 'Full IB Continuum', 'Academic Excellence', 'Global Perspective'],
    features: ['Small class sizes', 'University preparation', 'Multilingual', 'Technology integration'],
    description: 'IB World School offering full continuum from PYP through Diploma Programme with focus on developing globally-minded citizens.',
    competitiveness: 'Very High',
    acceptanceRate: '20-30%',
    averageClassSize: 18,
    studentToTeacherRatio: '8:1',
    uniformRequired: false,
    languagePrograms: ['French', 'Mandarin', 'Spanish'],
    entranceRequirements: ['Application form', 'School reports', 'Assessment', 'Interview', 'Character reference'],
    preparationTips: [
      'Start application process 18 months early',
      'Demonstrate curiosity and love of learning',
      'Show evidence of well-roundedness',
      'Prepare for assessment day activities'
    ],
    keyDates: {
      applicationOpen: 'September 1',
      applicationDeadline: 'November 1',
      assessmentDates: 'November-February',
      interviewDates: 'December-March',
      decisionDate: 'March 15',
      tourDates: 'September-June'
    }
  },

  {
    id: 'stratford-hall',
    name: 'Stratford Hall',
    type: 'IB',
    level: 'k12',
    grades: 'Kindergarten-Grade 12',
    location: 'Vancouver',
    tuition: 29500,
    applicationDeadline: 'Application deadlines vary by grade',
    tourDates: 'October-May',
    preparationStart: '12-18 months before entry',
    specialty: ['International Baccalaureate', 'Full IB Continuum', 'University Preparatory', 'Character Development'],
    features: ['Gender-inclusive', '11:1 student-staff ratio in DP', '100% university acceptance'],
    description: 'One of only 20 Canadian schools offering the complete IB programme from Kindergarten to Grade 12.',
    competitiveness: 'Very High',
    averageClassSize: 16,
    studentToTeacherRatio: '11:1',
    uniformRequired: true,
    entranceRequirements: ['Online application', '$300 fee', 'Birth certificate', 'Report cards', 'Reference form', 'SSAT (Grades 6-11)', 'Parent interview'],
    preparationTips: [
      'Prepare for SSAT testing (Grades 6-11)',
      'Practice Character Skills Snapshot',
      'Demonstrate intellectual curiosity',
      'Show commitment to IB values'
    ],
    keyDates: {
      applicationOpen: 'September',
      applicationDeadline: 'Varies by grade',
      assessmentDates: 'January-March',
      interviewDates: 'February-April',
      decisionDate: 'April',
      tourDates: 'October-May'
    }
  },

  {
    id: 'brockton-school',
    name: 'Brockton School',
    type: 'IB',
    level: 'k12',
    grades: 'Junior Kindergarten-Grade 12',
    location: 'North Vancouver',
    tuition: 28500,
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round by appointment',
    preparationStart: '12 months before entry',
    specialty: ['International Baccalaureate', 'Full IB Continuum', 'Holistic Education', 'Inclusive Community'],
    features: ['Gender-inclusive', 'Secular', 'Small class sizes', 'Character development'],
    description: 'Independent IB World Continuum School fostering academic excellence in a holistic and innovative learning environment.',
    competitiveness: 'High',
    averageClassSize: 15,
    studentToTeacherRatio: '9:1',
    uniformRequired: false,
    entranceRequirements: ['Application form', 'School records', 'Assessment', 'Family interview'],
    preparationTips: [
      'Emphasize child\'s curiosity and creativity',
      'Show alignment with IB philosophy',
      'Prepare for holistic assessment',
      'Demonstrate family commitment to education'
    ]
  },

  {
    id: 'churchill-ib',
    name: 'Sir Winston Churchill Secondary - IB Programme',
    type: 'Public',
    level: 'high',
    grades: 'Grades 11-12',
    location: 'Vancouver',
    tuition: 'Free',
    applicationDeadline: 'Application closed for Sept 2025 (Opens Nov 2025 for Sept 2026)',
    tourDates: 'Information sessions in fall',
    preparationStart: '2 years before entry',
    specialty: ['International Baccalaureate Diploma', 'Academic Excellence', 'University Preparation'],
    features: ['Established 1983', '21st century skills', 'Intercultural understanding'],
    description: 'Public IB Diploma Programme with over 40 years of excellence in international education.',
    competitiveness: 'High',
    entranceRequirements: ['Strong academic record', 'Application form', 'Teacher recommendations'],
    preparationTips: [
      'Maintain high grades in Grade 10',
      'Show commitment to academic challenge',
      'Demonstrate time management skills',
      'Prepare for rigorous coursework'
    ]
  },

  // === INDEPENDENT SCHOOLS ===
  {
    id: 'pacific-spirit-school',
    name: 'Pacific Spirit School',
    type: 'Independent',
    level: 'elementary',
    grades: 'Kindergarten-Grade 7 (+ High School)',
    location: 'Vancouver',
    tuition: 'Starting from $9,250 (sliding scale)',
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Information sessions by application',
    preparationStart: '6-12 months before entry',
    specialty: ['Progressive Education', 'Play-Based Learning', 'Arts-Enriched', 'Small Classes'],
    features: ['High educator-to-student ratio', 'Parent involvement', 'Outdoor education', 'Character development'],
    description: 'Independent K-7 school where children are happy, free to be themselves, and develop foundations for fulfilling lives.',
    competitiveness: 'Moderate',
    averageClassSize: 12,
    studentToTeacherRatio: '6:1',
    uniformRequired: false,
    entranceRequirements: ['Information session attendance', 'Application meeting', 'Classroom visit', 'Family interview'],
    preparationTips: [
      'Attend information session first',
      'Show alignment with progressive education values',
      'Demonstrate child\'s readiness for independence',
      'Emphasize family\'s commitment to community'
    ],
    keyDates: {
      applicationOpen: 'Year-round',
      applicationDeadline: 'Rolling',
      assessmentDates: 'Classroom visits',
      interviewDates: 'After classroom visit',
      decisionDate: 'Within 2 weeks',
      tourDates: 'Information sessions monthly'
    }
  },

  {
    id: 'collingwood-school',
    name: 'Collingwood School',
    type: 'Independent',
    level: 'k12',
    grades: 'Junior Kindergarten-Grade 12',
    location: 'West Vancouver',
    tuition: 31500,
    applicationDeadline: 'November 1, 2024',
    tourDates: 'September-May',
    preparationStart: '18 months before entry',
    specialty: ['University Preparation', 'Advanced Placement', 'Co-curricular Activities', 'Personalized Learning'],
    features: ['1:8 teacher-student ratio', '20+ AP courses', 'Real-world experiences'],
    description: 'K-12 independent school emphasizing personalized approach with exceptional academic foundation and forward-focused learning.',
    competitiveness: 'Very High',
    averageClassSize: 16,
    studentToTeacherRatio: '1:8',
    uniformRequired: true,
    entranceRequirements: ['Online application', 'School reports', 'Assessment', 'Interview'],
    preparationTips: [
      'Apply early (main intake: JK, K, Grade 3, Grade 8)',
      'Demonstrate academic excellence',
      'Show diverse interests and talents',
      'Prepare for comprehensive assessment'
    ]
  },

  {
    id: 'west-point-grey-academy',
    name: 'West Point Grey Academy',
    type: 'Independent',
    level: 'k12',
    grades: 'Junior Kindergarten-Grade 12',
    location: 'Vancouver',
    tuition: 30200,
    applicationDeadline: 'January 31, 2025',
    tourDates: 'October-April',
    preparationStart: '12-18 months before entry',
    specialty: ['Academic Excellence', 'Leadership Development', 'Community Service', 'Arts Programs'],
    features: ['Coeducational', 'University preparation', 'Global perspective', 'Character development'],
    description: 'Independent JK-12 coeducational day school fostering academic excellence and character development.',
    competitiveness: 'High',
    uniformRequired: true,
    entranceRequirements: ['Application form', 'Academic records', 'Assessment', 'Interview', 'References'],
    preparationTips: [
      'Demonstrate leadership potential',
      'Show commitment to community service',
      'Prepare for academic assessment',
      'Highlight unique talents and interests'
    ]
  },

  {
    id: 'york-house-school',
    name: 'York House School',
    type: 'Independent',
    level: 'k12',
    grades: 'Junior Kindergarten-Grade 12',
    location: 'Vancouver',
    tuition: 32000,
    applicationDeadline: 'Application deadline passed for 2025/26',
    tourDates: 'September-May',
    preparationStart: '18-24 months before entry',
    specialty: ['Girls Education', 'Leadership Development', 'Academic Excellence', 'Global Citizenship'],
    features: ['All-girls environment', 'University preparation', 'Strong alumnae network', 'Character development'],
    description: 'Independent girls\' school preparing young women to be leaders and global citizens.',
    competitiveness: 'Very High',
    uniformRequired: true,
    entranceRequirements: ['Canadian citizens/PR only', '$350 application fee', 'Academic records', 'Assessment', 'Interview'],
    preparationTips: [
      'Apply 18-24 months in advance',
      'Demonstrate leadership qualities',
      'Show strong academic performance',
      'Prepare for rigorous assessment process'
    ]
  },

  {
    id: 'st-georges-school',
    name: 'St. George\'s School',
    type: 'Independent',
    level: 'k12',
    grades: 'Kindergarten-Grade 12',
    location: 'Vancouver',
    tuition: 33500,
    applicationDeadline: 'October 30, 2025 (for 2026-27)',
    tourDates: 'September-May',
    preparationStart: '24 months before entry',
    specialty: ['Boys Education', 'Leadership Development', 'Academic Excellence', 'Character Building'],
    features: ['All-boys environment', 'Day and boarding', 'University preparation', 'Strong traditions'],
    description: 'Independent boys\' school with strong academic program and character development focus.',
    competitiveness: 'Very High',
    uniformRequired: true,
    boardingAvailable: true,
    entranceRequirements: ['Application form', 'School reports', 'Character reference', 'Assessment', 'Interview'],
    preparationTips: [
      'Apply 2 years in advance',
      'Demonstrate character and integrity',
      'Show academic potential',
      'Prepare for group assessment and interview'
    ],
    keyDates: {
      applicationOpen: 'September 2025',
      applicationDeadline: 'October 30, 2025',
      assessmentDates: 'November-February',
      interviewDates: 'January-March',
      decisionDate: 'March 15',
      tourDates: 'September-May'
    }
  },

  {
    id: 'vancouver-college',
    name: 'Vancouver College',
    type: 'Religious',
    level: 'k12',
    grades: 'Kindergarten-Grade 12',
    location: 'Vancouver',
    tuition: 18500,
    applicationDeadline: 'December 13, 2024',
    tourDates: 'October-January',
    preparationStart: '18 months before entry',
    specialty: ['Catholic Education', 'Boys Education', 'Academic Excellence', 'Character Formation'],
    features: ['All-boys environment', 'Christian Brothers tradition', 'University preparation'],
    description: 'Catholic boys\' school providing academic excellence within a faith-based community.',
    competitiveness: 'High',
    uniformRequired: true,
    entranceRequirements: ['Application form', 'Academic records', 'Interview', 'Assessment'],
    preparationTips: [
      'Main intake: K (26 spaces), Grade 4 (4 spaces), Grade 7 (30 spaces), Grade 8 (108 spaces)',
      'Show alignment with Catholic values',
      'Demonstrate academic potential',
      'Prepare for placement exams'
    ],
    keyDates: {
      applicationOpen: 'September',
      applicationDeadline: 'December 13',
      assessmentDates: 'January 18 & 22',
      interviewDates: 'January 10, 23-28',
      decisionDate: 'February',
      tourDates: 'October 22 Open House'
    }
  },

  // === MONTESSORI SCHOOLS ===
  {
    id: 'westside-montessori-academy',
    name: 'Westside Montessori Academy',
    type: 'Montessori',
    level: 'elementary',
    grades: 'Infant/Toddler-Grade 7',
    location: 'Vancouver',
    tuition: 15000,
    applicationDeadline: 'Recommended 1 year in advance',
    tourDates: 'Year-round by appointment',
    preparationStart: '12 months before entry',
    specialty: ['Montessori Method', 'Child-Centered Learning', 'Mixed-Age Classrooms', 'Independence'],
    features: ['Individual pace learning', 'One-on-one lessons', 'Practical life skills', 'Cultural studies'],
    description: 'Authentic Montessori education fostering independence, confidence, and love of learning.',
    competitiveness: 'Moderate',
    averageClassSize: 20,
    uniformRequired: false,
    entranceRequirements: ['Toilet training required (except Infant/Toddler)', 'Application form', 'Visit/observation'],
    preparationTips: [
      'Apply one year in advance for main entry points',
      'Visit to understand Montessori philosophy',
      'Ensure child meets age requirements',
      'Show family commitment to Montessori approach'
    ]
  },

  {
    id: 'vsb-montessori',
    name: 'Montessori Programs (VSB)',
    type: 'Public',
    level: 'elementary',
    grades: 'Kindergarten-Grade 7',
    location: 'Vancouver (Multiple locations)',
    tuition: 'Free',
    applicationDeadline: 'February 4, 2024',
    tourDates: 'Information sessions in fall',
    preparationStart: '6 months before application',
    specialty: ['Montessori Method', 'Child-Centered Learning', 'Multi-Age Classrooms', 'Independence'],
    features: ['Public option', 'Authentic Montessori', 'Mixed-age groupings', 'Self-directed learning'],
    description: 'Public Montessori programs offered through Vancouver School Board at multiple locations.',
    competitiveness: 'High',
    entranceRequirements: ['VSB application process', 'Lottery system if oversubscribed'],
    preparationTips: [
      'Apply early through VSB choice process',
      'Attend information sessions',
      'Understand Montessori philosophy',
      'Consider multiple school options'
    ]
  },

  // === SPECIALIZED HIGH SCHOOLS ===
  {
    id: 'bodwell-high-school',
    name: 'Bodwell High School',
    type: 'Private',
    level: 'high',
    grades: 'Grades 8-12',
    location: 'North Vancouver',
    tuition: 45000,
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    preparationStart: '12 months before entry',
    specialty: ['International Education', 'University Preparation', 'Boarding School', 'Diverse Community'],
    features: ['Co-educational', 'Boarding available', 'IB-MYP (Grades 8-10)', 'BC curriculum (10-12)'],
    description: 'University-prep boarding school with diverse international community and strong academic programs.',
    competitiveness: 'Moderate',
    boardingAvailable: true,
    languagePrograms: ['ESL support', 'Multiple languages'],
    entranceRequirements: ['Application form', 'Academic records', 'English proficiency', 'Interview'],
    preparationTips: [
      'Strong English language skills required',
      'Show adaptability and independence',
      'Demonstrate university aspirations',
      'Prepare for diverse community'
    ]
  },

  // === PUBLIC CHOICE PROGRAMS ===
  {
    id: 'french-immersion-vsb',
    name: 'French Immersion Program (VSB)',
    type: 'Public',
    level: 'k12',
    grades: 'Kindergarten-Grade 12',
    location: 'Vancouver (Multiple locations)',
    tuition: 'Free',
    applicationDeadline: 'February 4, 2024',
    tourDates: 'Information sessions in fall',
    preparationStart: '6 months before application',
    specialty: ['French Language Learning', 'Bilingual Education', 'Cultural Understanding'],
    features: ['Public option', 'Full immersion', 'Bilingual graduates', 'Cultural enrichment'],
    description: 'Public French immersion programs offering bilingual education from kindergarten through graduation.',
    competitiveness: 'Moderate',
    entranceRequirements: ['VSB application process', 'Early or late immersion options'],
    preparationTips: [
      'Apply early through VSB choice process',
      'Consider early vs late immersion',
      'No prior French knowledge required for early immersion',
      'Show commitment to bilingual education'
    ]
  },

  // === ALTERNATIVE PROGRAMS ===
  {
    id: 'mini-schools-vsb',
    name: 'Mini Schools (VSB)',
    type: 'Public',
    level: 'elementary',
    grades: 'Grades 4-7',
    location: 'Vancouver (Multiple locations)',
    tuition: 'Free',
    applicationDeadline: 'February 4, 2024',
    tourDates: 'Information sessions in fall',
    preparationStart: '12 months before application',
    specialty: ['Small Learning Communities', 'Gifted Education', 'Academic Challenge', 'Critical Thinking'],
    features: ['Small class sizes', 'Accelerated learning', 'Inquiry-based', 'Collaborative projects'],
    description: 'Small learning communities for academically capable students within regular elementary schools.',
    competitiveness: 'Very High',
    entranceRequirements: ['Academic portfolio', 'Teacher recommendations', 'Assessment', 'Interview'],
    preparationTips: [
      'Demonstrate academic excellence',
      'Show critical thinking skills',
      'Prepare portfolio showcasing work',
      'Practice interview skills'
    ]
  }
];

// Helper functions for application timeline and preparation
export const getApplicationTimeline = (schoolType: string) => {
  const timelines = {
    'IB': {
      '24-18 months before': 'Research schools, attend information sessions',
      '18-12 months before': 'Begin application process, book tours',
      '12-6 months before': 'Complete applications, prepare for assessments',
      '6-3 months before': 'Interviews, assessments, SSAT if required',
      '3-1 months before': 'Decision notifications, enrollment deposits',
      'Summer before': 'Orientation, uniform fittings, final preparations'
    },
    'Private': {
      '18-12 months before': 'Research schools, attend open houses',
      '12-8 months before': 'Complete applications, gather documents',
      '8-4 months before': 'Assessments, interviews, testing',
      '4-2 months before': 'Decision notifications, enrollment',
      'Summer before': 'Orientation and preparation'
    },
    'Public': {
      '12-6 months before': 'Research choice programs',
      '6-4 months before': 'Submit applications by VSB deadline',
      '4-2 months before': 'Lottery results, placement notifications',
      'Summer before': 'School registration and preparation'
    }
  };
  return timelines[schoolType] || timelines['Private'];
};

export const getPreparationTips = (competitiveness: string) => {
  const tips = {
    'Very High': [
      'Start preparation 2+ years early',
      'Consider SSAT prep tutoring',
      'Build strong academic portfolio',
      'Develop leadership experiences',
      'Practice interview skills extensively'
    ],
    'High': [
      'Start preparation 1-2 years early',
      'Maintain excellent grades',
      'Develop well-rounded interests',
      'Practice assessment activities',
      'Show genuine interest in school'
    ],
    'Moderate': [
      'Start preparation 6-12 months early',
      'Show alignment with school values',
      'Prepare for assessment day',
      'Demonstrate child readiness',
      'Visit school multiple times'
    ],
    'Low': [
      'Apply several months early',
      'Ensure basic requirements met',
      'Show interest and fit',
      'Complete application thoroughly'
    ]
  };
  return tips[competitiveness] || tips['Moderate'];
};

export const getTutoringRecommendations = () => {
  return [
    {
      name: 'KEY Education',
      specialty: 'SSAT prep, Private school admissions consulting',
      location: 'Vancouver',
      services: ['SSAT preparation', 'Admissions consulting', 'Interview coaching', 'Academic tutoring']
    },
    {
      name: 'Aspire Math Academy',
      specialty: 'Private school entrance coaching',
      location: 'West Vancouver',
      services: ['SSAT preparation', 'Mock interviews', 'Application assistance', 'Confidence building']
    },
    {
      name: 'Test Innovators',
      specialty: 'SSAT online preparation',
      location: 'Online',
      services: ['SSAT practice tests', 'Adaptive learning', 'Progress tracking']
    }
  ];
};

export default comprehensiveSchools;
