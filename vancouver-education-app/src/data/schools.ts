// Comprehensive Vancouver Education School Database
// Updated with private school application timelines and requirements

// ============================
// VANCOUVER AREA SCHOOL TYPES
// ============================

export interface School {
  id: string;
  name: string;
  type: 'Private' | 'Public' | 'Mini School' | 'IB Program' | 'Independent' | 'Charter' | 'Catholic';
  level: 'elementary' | 'middle' | 'high' | 'k12' | 'preschool';
  grades: string;
  location: string;
  tuition: number | string;
  specialty: string[];
  website: string;
  description: string;

  // Application Timeline
  applicationDeadline: string;
  tourDates?: string;
  openHouse?: string;
  assessmentDates?: string;
  decisionDate?: string;

  // Intake Information
  mainIntakeGrades?: string[];
  intakeSpaces?: { [grade: string]: number };

  // Requirements
  ssatRequired?: boolean;
  characterSkillsSnapshot?: boolean;
  parentInterview?: boolean;
  studentInterview?: boolean;
  applicationFee?: number;

  // Preparation
  preparationTimeNeeded?: string;
  recommendedStartTime?: string;

  // Additional Info
  features: string[];
  competitiveness: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extremely High';
  financialAid?: boolean;
  boardingAvailable?: boolean;
  uniformRequired?: boolean;
}

export const schools: School[] = [
  // === PRIVATE SCHOOLS ===
  {
    id: 'collingwood',
    name: 'Collingwood School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'West Vancouver',
    tuition: 42000,
    specialty: ['Four Strand Education', 'Round Square', 'Advanced Placement'],
    website: 'https://www.collingwood.org',
    description: 'Premier independent school with Four Strand approach: Academics, Arts, Athletics, Service. Only Round Square school in Greater Vancouver.',
    
    applicationDeadline: 'November 1',
    tourDates: 'September-October (by appointment)',
    openHouse: 'Early October',
    assessmentDates: 'January (after application)',
    decisionDate: 'February',
    
    mainIntakeGrades: ['JK', 'K', 'Grade 3', 'Grade 8'],
    intakeSpaces: { 'JK': 26, 'K': 26, 'Grade 3': 8, 'Grade 8': 40 },
    
    applicationFee: 350,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Two campus locations', '1:8 teacher ratio', '20+ AP courses', '100% university acceptance'],
    competitiveness: 'Extremely High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'mulgrave',
    name: 'Mulgrave School',
    type: 'Private',
    level: 'k12',
    grades: 'PK3-12',
    location: 'West Vancouver',
    tuition: 38500,
    specialty: ['IB World School', 'International Education', 'Technology Integration'],
    website: 'https://www.mulgrave.com',
    description: 'International Baccalaureate World School with diverse student body from 40+ countries. Strong technology integration and global perspective.',
    
    applicationDeadline: 'December 2, 2024',
    tourDates: 'September onwards (book online)',
    openHouse: 'October',
    assessmentDates: 'January 18-25, 2025',
    decisionDate: 'February 18, 2025',
    
    mainIntakeGrades: ['PK3', 'PK4', 'Kindergarten', 'Grade 7', 'Grade 10', 'Grade 11'],
    
    ssatRequired: false,
    parentInterview: true,
    studentInterview: true,
    applicationFee: 350,
    preparationTimeNeeded: '8-12 months',
    recommendedStartTime: 'March (for following September)',
    
    features: ['27-acre campus', 'IB Program K-12', '40+ countries represented', 'No agents policy'],
    competitiveness: 'Extremely High',
    financialAid: true,
    uniformRequired: false
  },
  
  {
    id: 'st-georges',
    name: "St. George's School",
    type: 'Private',
    level: 'k12',
    grades: 'K-12',
    location: 'Vancouver (Point Grey)',
    tuition: 35000,
    specialty: ['Boys Education', 'Leadership Development', 'Boarding School'],
    website: 'https://www.stgeorges.bc.ca',
    description: 'Independent boys school with day and boarding options. Strong leadership development and character building focus.',
    
    applicationDeadline: 'November 1 (K, Gr 4-11), January 31 (Gr 1-3)',
    tourDates: 'October-November',
    openHouse: 'October',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    mainIntakeGrades: ['Kindergarten', 'Grade 4', 'Grade 6', 'Grade 8'],
    intakeSpaces: { 'Kindergarten': 36, 'Grade 4': 14, 'Grade 6': 20, 'Grade 8': 50 },
    
    ssatRequired: false,
    parentInterview: true,
    studentInterview: true,
    applicationFee: 300,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Boys-only education', 'Boarding available', '25-acre campus', 'Video application for Gr 8+'],
    competitiveness: 'Extremely High',
    financialAid: true,
    boardingAvailable: true,
    uniformRequired: true
  },
  
  {
    id: 'crofton-house',
    name: 'Crofton House School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'Vancouver (Kerrisdale)',
    tuition: 32000,
    specialty: ['Girls Education', 'Girl-Centered Learning', 'Leadership'],
    website: 'https://www.croftonhouse.ca',
    description: 'Independent day school for girls emphasizing girl-centered education and developing confident, capable young women.',
    
    applicationDeadline: 'November 15 (JK/SK), December 3 (Gr 6/8), December 3 (others)',
    tourDates: 'October-November',
    openHouse: 'October',
    assessmentDates: 'January',
    decisionDate: 'February',
    
    mainIntakeGrades: ['JK', 'SK', 'Grade 6', 'Grade 8'],
    
    parentInterview: true,
    studentInterview: true,
    applicationFee: 350,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Girls-only education', 'Founded 1898', 'Strong alumnae network', 'Heritage building'],
    competitiveness: 'Extremely High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'york-house',
    name: 'York House School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'Vancouver (Shaughnessy)',
    tuition: 34000,
    specialty: ['Girls Education', 'Innovation', 'Global Citizenship'],
    website: 'https://www.yorkhouse.ca',
    description: 'Independent day school for girls focusing on innovation, collaboration, and global citizenship in beautiful heritage setting.',
    
    applicationDeadline: 'November 15 (JK/SK), December 3 (Gr 8), February 1 (others)',
    tourDates: 'Fall tours available',
    openHouse: 'Fall (registration in September)',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    mainIntakeGrades: ['JK', 'SK', 'Grade 8'],
    
    parentInterview: true,
    studentInterview: true,
    applicationFee: 350,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Girls-only education', 'Heritage mansion campus', '$1M+ financial aid annually', 'Innovation focus'],
    competitiveness: 'Extremely High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'west-point-grey-academy',
    name: 'West Point Grey Academy',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'Vancouver (Point Grey)',
    tuition: 33000,
    specialty: ['Co-Educational', 'Academic Excellence', 'Innovation'],
    website: 'https://www.wpga.ca',
    description: 'Independent co-educational school emphasizing academic excellence, innovation, and character development.',
    
    applicationDeadline: 'December 3',
    tourDates: 'October-November',
    openHouse: 'October',
    assessmentDates: 'January (in-person only)',
    decisionDate: 'February',
    
    ssatRequired: true, // Grades 8-12
    characterSkillsSnapshot: true, // Grades 8-12
    parentInterview: true,
    studentInterview: true,
    applicationFee: 350,
    preparationTimeNeeded: '8-12 months (includes SSAT prep)',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Co-educational', 'SSAT required Gr 8+', 'In-person assessments', 'No sibling guarantee'],
    competitiveness: 'Extremely High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'stratford-hall',
    name: 'Stratford Hall IB World School',
    type: 'Private',
    level: 'k12',
    grades: 'K-12',
    location: 'Vancouver (UBC area)',
    tuition: 30000,
    specialty: ['IB World School', 'International Mindedness', 'Academic Excellence'],
    website: 'https://www.stratfordhall.ca',
    description: 'IB World School offering Primary Years, Middle Years, and Diploma Programmes with focus on international mindedness.',
    
    applicationDeadline: 'November 15 (K/Gr 1/Gr 6), November 30 (others)',
    tourDates: 'October-November',
    openHouse: 'October',
    assessmentDates: 'January',
    decisionDate: 'February',
    
    mainIntakeGrades: ['Kindergarten', 'Grade 1', 'Grade 6', 'Grade 8', 'Grade 11'],
    
    ssatRequired: true, // Grades 6-11
    characterSkillsSnapshot: true, // Grades 6-11
    parentInterview: true, // K, Gr 1, Gr 6-11
    applicationFee: 300,
    preparationTimeNeeded: '8-12 months (includes SSAT prep)',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Full IB Continuum', 'SSAT required Gr 6+', 'International fee $10,000', 'No consultants policy'],
    competitiveness: 'Very High',
    financialAid: false,
    uniformRequired: false
  },
  
  {
    id: 'vancouver-college',
    name: 'Vancouver College',
    type: 'Catholic',
    level: 'k12',
    grades: 'K-12',
    location: 'Vancouver (Shaughnessy)',
    tuition: 25000,
    specialty: ['Catholic Education', 'Boys Education', 'Character Formation'],
    website: 'https://www.vancouvercollege.ca',
    description: 'Catholic independent day school for boys emphasizing academic excellence, character formation, and spiritual development.',
    
    applicationDeadline: 'December 13',
    tourDates: 'October-November',
    openHouse: 'October 22',
    assessmentDates: 'January 10 (interviews), January 18 (assessments)',
    decisionDate: 'February',
    
    mainIntakeGrades: ['Kindergarten', 'Grade 4', 'Grade 7', 'Grade 8'],
    intakeSpaces: { 'Kindergarten': 26, 'Grade 4': 4, 'Grade 7': 30, 'Grade 8': 108 },
    
    parentInterview: true,
    studentInterview: true,
    applicationFee: 300,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'March (for following September)',
    
    features: ['Catholic boys education', 'Grade 7 & 8 main entry', 'Character formation', 'Spiritual development'],
    competitiveness: 'Very High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'southridge',
    name: 'Southridge School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'Surrey',
    tuition: 28000,
    specialty: ['Co-Educational', 'Academic Excellence', 'Character Development'],
    website: 'https://www.southridge.ca',
    description: 'Independent co-educational school in Surrey focused on academic excellence, character development, and community service.',
    
    applicationDeadline: 'December 1',
    tourDates: 'October-November',
    openHouse: 'October',
    assessmentDates: 'January',
    decisionDate: 'February',
    
    parentInterview: true,
    studentInterview: true,
    applicationFee: 300,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'March (for following September)',
    
    features: ['Co-educational', 'Surrey location', '$200K+ bursaries annually', '680 students'],
    competitiveness: 'High',
    financialAid: true,
    uniformRequired: true
  },
  
  {
    id: 'meadowridge',
    name: 'Meadowridge School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'Maple Ridge',
    tuition: 25000,
    specialty: ['IB World School', 'Co-Educational', 'Character Development'],
    website: 'https://www.meadowridge.bc.ca',
    description: 'IB World School in Maple Ridge emphasizing academic excellence, character development, and community in beautiful natural setting.',
    
    applicationDeadline: 'November 30 (JK/K), December 31 (Gr 1-11)',
    tourDates: 'Student-led tours available',
    openHouse: 'TBA for 2025-26',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'March (for following September)',
    
    features: ['IB World School', 'Natural setting', 'Character focus', 'Mountain view campus'],
    competitiveness: 'High',
    financialAid: true,
    uniformRequired: false
  },
  
  // === IB PROGRAMS IN PUBLIC SCHOOLS ===
  {
    id: 'churchill-ib',
    name: 'Sir Winston Churchill IB Programme',
    type: 'IB Program',
    level: 'high',
    grades: '11-12',
    location: 'Vancouver',
    tuition: 'Free',
    specialty: ['International Baccalaureate', 'University Preparation'],
    website: 'https://www.vsb.bc.ca/sir-winston-churchill',
    description: 'Established IB Diploma Programme at Churchill Secondary, offering rigorous academic preparation for university.',
    
    applicationDeadline: 'December (for Grade 11 entry)',
    tourDates: 'November Information Session',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    preparationTimeNeeded: '6 months',
    recommendedStartTime: 'Grade 10 planning',
    
    features: ['Since 1983', 'Free public program', 'University preparation', 'Community involvement'],
    competitiveness: 'High',
    financialAid: false
  },
  
  {
    id: 'west-vancouver-ib',
    name: 'West Vancouver Secondary IB Programme',
    type: 'IB Program',
    level: 'high',
    grades: '11-12',
    location: 'West Vancouver',
    tuition: 'Free',
    specialty: ['International Baccalaureate', 'Critical Thinking'],
    website: 'https://westvancouverschools.ca/ib',
    description: 'Competitive IB Programme with critical thinking test and rigorous academic standards.',
    
    applicationDeadline: 'January 31 (outside students), February 28 (WVSS students)',
    tourDates: 'January 19 Information Night',
    assessmentDates: 'January 22-February 24 (Critical Thinking Tests)',
    decisionDate: 'February 24 (first offers), March 3 (second offers)',
    
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'Grade 10 planning',
    
    features: ['Critical thinking test', 'Admission interviews', 'High standards', 'Free program'],
    competitiveness: 'Very High',
    financialAid: false
  },
  
  {
    id: 'richmond-ib',
    name: 'Richmond Secondary IB Programme',
    type: 'IB Program',
    level: 'high',
    grades: '11-12',
    location: 'Richmond',
    tuition: 'Free + fees',
    specialty: ['International Baccalaureate', 'Multilingual Environment'],
    website: 'https://rhsib.wordpress.com',
    description: 'IB Diploma Programme in Richmond with diverse student body and strong academic preparation.',
    
    applicationDeadline: 'December 16 - January 10',
    tourDates: 'December 4 Information Night',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    preparationTimeNeeded: '6 months',
    recommendedStartTime: 'Grade 10 planning',
    
    features: ['Paper application required', 'Grade 10 transcripts needed', 'Program fees apply', 'Diverse community'],
    competitiveness: 'High',
    financialAid: false
  },
  
  // === MINI SCHOOLS (VSB) ===
  {
    id: 'eric-hamber-challenge',
    name: 'Eric Hamber Challenge Studio',
    type: 'Mini School',
    level: 'high',
    grades: '8-12',
    location: 'South Vancouver',
    tuition: 'Free',
    specialty: ['Creative Problem-Solving', 'Project-Based Learning'],
    website: 'https://www.vsb.bc.ca/schools/eric-hamber-secondary',
    description: 'Innovative mini school focusing on creative problem-solving and project-based learning in small cohort setting.',
    
    applicationDeadline: 'December 19',
    tourDates: 'October Information Night',
    assessmentDates: 'January (video application review)',
    decisionDate: 'February',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Grade 7 planning',
    
    features: ['Video application', 'Small cohort', 'Creative focus', 'Grade 8 entry'],
    competitiveness: 'Very High',
    financialAid: false
  },
  
  {
    id: 'point-grey-mini',
    name: 'Point Grey Mini School',
    type: 'Mini School',
    level: 'high',
    grades: '8-12',
    location: 'West Vancouver',
    tuition: 'Free',
    specialty: ['Academic Enrichment', 'Critical Thinking'],
    website: 'https://www.vsb.bc.ca/point-grey',
    description: 'Academic enrichment program for motivated students emphasizing critical thinking and advanced studies.',
    
    applicationDeadline: 'December 19',
    tourDates: 'October 30 Information Night',
    assessmentDates: 'January',
    decisionDate: 'February',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Grade 7 planning',
    
    features: ['Academic enrichment', 'Critical thinking focus', 'Grade 8 entry', 'Vancouver residents only'],
    competitiveness: 'Very High',
    financialAid: false
  },

{
  id: 'gladstone-secondary-mini',
  name: 'Gladstone Secondary – Mini School Enrichment Program',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'East Vancouver',
  tuition: 'Free',
  specialty: ['Academic Acceleration','Leadership','Community Service'],
  website: 'https://www.vsb.bc.ca/schools/gladstone-secondary',
  description: 'Academic acceleration (Grades 8–10 in two years), leadership development, and community-service focus.',
  applicationDeadline: 'December 19',
  features: ['Accelerated curriculum','Leadership projects','Service learning'],
  competitiveness: 'Very High'
},
{
  id: 'prince-of-wales-mini',
  name: 'Prince of Wales Secondary – Mini School',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'Shaughnessy',
  tuition: 'Free',
  specialty: ['Community Focus','Academic Enrichment'],
  website: 'https://www.vsb.bc.ca/schools/prince-of-wales-secondary',
  description: 'Rigorous academic enrichment with strong emphasis on community and leadership.',
  applicationDeadline: 'December 19',
  features: ['Service opportunities','Peer mentorship','Enrichment electives'],
  competitiveness: 'Very High'
},
{
  id: 'tupper-mini-school',
  name: 'Sir Charles Tupper Secondary – Tupper Mini School',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'East Vancouver',
  tuition: 'Free',
  specialty: ['Leadership Development','Accelerated Academics'],
  website: 'https://www.vsb.bc.ca/schools/sir-charles-tupper-secondary',
  description: 'Academic enrichment program with leadership and critical-thinking focus.',
  applicationDeadline: 'December 19',
  features: ['Leadership workshops','Critical thinking','Advanced coursework'],
  competitiveness: 'Very High'
},
{
  id: 'killarney-computer-science-mini',
  name: 'Killarney Secondary – Computer Science Mini School',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'East Vancouver',
  tuition: 'Free',
  specialty: ['Programming','Cyber Security','Robotics'],
  website: 'https://www.vsb.bc.ca/schools/killarney-secondary',
  description: 'Focus on computer science fundamentals, cybersecurity, robotics and system administration.',
  applicationDeadline: 'December 19',
  features: ['Coding labs','Robotics club','Security workshops'],
  competitiveness: 'Very High'
},
{
  id: 'churchill-mini-school',
  name: 'Sir Winston Churchill Secondary – Ideal Mini School',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'West Vancouver',
  tuition: 'Free',
  specialty: ['Academic Enrichment','Creative Thinking'],
  website: 'https://www.vsb.bc.ca/schools/sir-winston-churchill-secondary',
  description: 'Enrichment program emphasizing creative problem-solving and advanced academics.',
  applicationDeadline: 'December 19',
  features: ['Innovation projects','Advanced seminars','Creative workshops'],
  competitiveness: 'Very High'
},
{
  id: 'john-oliver-tech-immersion',
  name: "John Oliver Secondary – Tech Immersion Program",
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'South Vancouver',
  tuition: 'Free',
  specialty: ['Digital Skills','Technology Integration'],
  website: 'https://www.vsb.bc.ca/schools/john-oliver-secondary',
  description: 'Immersive tech program covering software development, digital media, and emerging technologies.',
  applicationDeadline: 'December 19',
  features: ['Multimedia labs','Coding courses','Digital portfolios'],
  competitiveness: 'Very High'
},
{
  id: 'vancouver-technical-flex-humanities',
  name: 'Vancouver Technical Secondary – Flex Humanities Program',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'East Vancouver',
  tuition: 'Free',
  specialty: ['Humanities','Liberal Arts'],
  website: 'https://www.vsb.bc.ca/schools/vancouver-technical-secondary',
  description: 'Humanities-focused enrichment with seminars in philosophy, history, and literature.',
  applicationDeadline: 'December 19',
  features: ['Small seminars','Debate clubs','Creative writing'],
  competitiveness: 'Very High'
},
{
  id: 'templeton-mini-school',
  name: 'Templeton Secondary – Templeton Mini School',
  type: 'Mini School',
  level: 'high',
  grades: '8–12',
  location: 'East Vancouver',
  tuition: 'Free',
  specialty: ['Academic Enrichment','Critical Thinking'],
  website: 'https://www.vsb.bc.ca/schools/templeton-secondary',
  description: 'Rigorous academic program with emphasis on analysis, research, and critical-thinking skills.',
  applicationDeadline: 'December 19',
  features: ['Research projects','Philosophy seminars','Advanced studies'],
  competitiveness: 'Very High'
},
  
  // === SPECIALIZED & ALTERNATIVE SCHOOLS ===
  {
    id: 'choice-gifted',
    name: 'Choice School for Gifted',
    type: 'Private',
    level: 'elementary',
    grades: 'K-8',
    location: 'Richmond',
    tuition: 20000,
    specialty: ['Gifted Education', 'Small Classes', 'Individual Attention'],
    website: 'https://choiceschoolforgifted.com',
    description: 'Only designated school for gifted students in BC, offering individualized programs for academically gifted children.',
    
    applicationDeadline: 'February 28',
    tourDates: 'January-February',
    assessmentDates: 'March (IQ testing required)',
    decisionDate: 'April',
    
    preparationTimeNeeded: '6-12 months (IQ testing)',
    recommendedStartTime: 'Grade before entry',
    
    features: ['Only gifted school in BC', '7-8 students per class', 'IQ testing required', 'Individual programs'],
    competitiveness: 'Extremely High',
    financialAid: false,
    uniformRequired: false
  },
  
  {
    id: 'vancouver-waldorf',
    name: 'Vancouver Waldorf School',
    type: 'Private',
    level: 'k12',
    grades: 'Preschool-12',
    location: 'Vancouver',
    tuition: 13000,
    specialty: ['Waldorf Pedagogy', 'Arts Integration', 'Nature-Based Learning'],
    website: 'https://www.vancouverwaldorf.ca',
    description: 'Holistic education following Waldorf pedagogy with emphasis on arts, nature, and child development.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Monthly tours available',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Any time during year',
    
    features: ['Waldorf pedagogy', 'Arts integration', 'Mixed-age learning', 'Nature focus'],
    competitiveness: 'Moderate',
    financialAid: true,
    uniformRequired: false
  },
  
  // === PUBLIC CHOICE PROGRAMS ===
  {
    id: 'french-immersion-vsb',
    name: 'French Immersion Program (VSB)',
    type: 'Public',
    level: 'elementary',
    grades: 'K-12',
    location: 'Multiple Vancouver schools',
    tuition: 'Free',
    specialty: ['Bilingual Education', 'French Language', 'Cultural Immersion'],
    website: 'https://www.vsb.bc.ca',
    description: 'Public French immersion programs across Vancouver offering bilingual education in French and English.',
    
    applicationDeadline: 'February 4',
    tourDates: 'January Information Sessions',
    assessmentDates: 'No assessment required',
    decisionDate: 'March (lottery system)',
    
    preparationTimeNeeded: '2-3 months',
    recommendedStartTime: 'Kindergarten year',
    
    features: ['50-80% French instruction', '12 school locations', 'Public program', 'Lottery system'],
    competitiveness: 'Moderate',
    financialAid: false
  },
  
  {
    id: 'montessori-vsb',
    name: 'Montessori Programs (VSB)',
    type: 'Public',
    level: 'elementary',
    grades: 'K-7',
    location: '3 Vancouver schools',
    tuition: 'Free',
    specialty: ['Montessori Method', 'Child-Centered Learning', 'Multi-Age Classrooms'],
    website: 'https://www.vsb.bc.ca',
    description: 'Public Montessori programs following authentic Montessori methodology with mixed-age classrooms.',
    
    applicationDeadline: 'February 4',
    tourDates: 'January Information Sessions',
    assessmentDates: 'No assessment required',
    decisionDate: 'March',
    
    preparationTimeNeeded: '2-3 months',
    recommendedStartTime: 'Kindergarten year',
    
    features: ['Mixed-age classrooms', 'Hands-on materials', 'Self-directed learning', '3 locations'],
    competitiveness: 'Moderate',
    financialAid: false
  },

  // === NORTH VANCOUVER SCHOOLS ===
  {
    id: 'brockton-school',
    name: 'Brockton School',
    type: 'Private',
    level: 'k12',
    grades: 'JK-12',
    location: 'North Vancouver',
    tuition: 36000,
    specialty: ['IB World Continuum', 'Gender-Inclusive', 'Holistic Learning'],
    website: 'https://brocktonschool.com',
    description: 'One of only two schools in BC offering the full IB World Continuum from Junior Kindergarten to Grade 12.',
    
    applicationDeadline: 'November-December',
    tourDates: 'October-November',
    assessmentDates: 'January-February',
    decisionDate: 'March',
    
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Full IB Continuum', 'Gender-inclusive', 'Secular school', 'North Vancouver location'],
    competitiveness: 'Very High',
    financialAid: true,
    uniformRequired: false
  },

  {
    id: 'carson-graham-ib',
    name: 'Carson Graham Secondary IB Programme',
    type: 'IB Program',
    level: 'high',
    grades: '11-12',
    location: 'North Vancouver',
    tuition: 'Free',
    specialty: ['International Baccalaureate', 'University Preparation'],
    website: 'https://www.sd44.ca/school/carson',
    description: 'IB Diploma Programme offered at Carson Graham Secondary in North Vancouver School District.',
    
    applicationDeadline: 'February 18',
    tourDates: 'February 11 Information Session',
    assessmentDates: 'February 6-7 (DP for a Day)',
    decisionDate: 'March',
    
    preparationTimeNeeded: '6 months',
    recommendedStartTime: 'Grade 10 planning',
    
    features: ['Free public program', 'Grade 10 preparation available', 'North Shore location'],
    competitiveness: 'High',
    financialAid: false
  },

  // === SOUTH VANCOUVER SCHOOLS ===
  {
    id: 'little-flower-academy',
    name: 'Little Flower Academy',
    type: 'Catholic',
    level: 'high',
    grades: '8-12',
    location: 'Vancouver (South)',
    tuition: 18000,
    specialty: ['Catholic Girls Education', 'Academic Excellence', 'Character Development'],
    website: 'https://www.lfabc.org',
    description: 'Catholic high school for girls offering challenging curriculum with AP courses and strong extracurricular programs.',
    
    applicationDeadline: 'November 29',
    tourDates: 'October Open House',
    openHouse: 'October 22',
    assessmentDates: 'December 7 (Entrance Exam)',
    decisionDate: 'January',
    
    mainIntakeGrades: ['Grade 8'],
    
    parentInterview: false,
    studentInterview: false,
    applicationFee: 150,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'Grade 7 year',
    
    features: ['Girls-only education', 'Catholic values', 'AP courses', 'Grade 8 main entry'],
    competitiveness: 'High',
    financialAid: true,
    uniformRequired: true
  },

  // === WESTSIDE INDEPENDENT SCHOOLS ===
  {
    id: 'pacific-spirit-school',
    name: 'Pacific Spirit School',
    type: 'Independent',
    level: 'elementary',
    grades: 'K-8',
    location: 'Vancouver (West)',
    tuition: 22000,
    specialty: ['Play-Based Learning', 'Arts Enrichment', 'Outdoor Education'],
    website: 'https://www.pacificspiritschool.org',
    description: 'Independent school following BC curriculum with play-based, arts-enriched programs and outdoor education focus.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    mainIntakeGrades: ['Kindergarten', 'Grade 8'],
    
    applicationFee: 200,
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Year before entry',
    
    features: ['Small classes', 'Minimal homework', 'Parent involvement', 'Bus service from East Vancouver'],
    competitiveness: 'Moderate',
    financialAid: true,
    uniformRequired: false
  },

  {
    id: 'westside-montessori',
    name: 'Westside Montessori School',
    type: 'Independent',
    level: 'preschool',
    grades: 'Preschool-Kindergarden',
    location: 'Vancouver (West)',
    tuition: 15000,
    specialty: ['Montessori Method', 'Three-Year Program', 'Child Development'],
    website: 'https://www.westsidemontessori.ca',
    description: 'Authentic Montessori preschool requiring three-year commitment including Kindergarten year.',
    
    applicationDeadline: 'On-going Year long',
    tourDates: 'January Annual Open House',
    openHouse: 'January',
    assessmentDates: '30-minute Children\'s Visit',
    decisionDate: 'February',
    
    mainIntakeGrades: ['Preschool (30 months)'],
    
    applicationFee: 50,
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'Child\'s 2nd birthday',
    
    features: ['Three-year commitment', 'Lottery system', 'Sibling priority', 'Authentic Montessori'],
    competitiveness: 'High',
    financialAid: false,
    uniformRequired: false
  },
    {
  id: 'westside-montessori-academy',
  name: 'Westside Montessori Academy',
  type: 'Independent',
  level: 'elementary',
  grades: 'K–7',
  location: 'Vancouver',
  tuition: 16000, // Elementary tuition for 2025–26 is $16,000  [oai_citation:0‡westsidemontessoriacademy.ca](https://www.westsidemontessoriacademy.ca/wp-content/uploads/2024/11/NEW-Elementary-Fees-Registration-and-Withdrawal-2025-2026.pdf)
  specialty: [
    'Montessori Method',
    'Individualized Attention',
    'Community Involvement',
    'Co-Curricular Programs'
  ],
  website: 'https://www.westsidemontessoriacademy.ca/',
  description:
    'Authentic Montessori education for Kindergarten through Grade 7, emphasizing self-directed learning, individualized attention, and community involvement.',

  applicationDeadline: 'December 6, 2024', // Next deadline: Dec 6, 2024  [oai_citation:1‡westsidemontessoriacademy.ca](https://www.westsidemontessoriacademy.ca/application-process/)

  features: [
    'Art, theatre & music programs',
    'Outdoor & indoor sports',
    'Yoga & language classes',
    'Annual Open House in November',
    'Parent/Child interviews',
    'Application fee: $200'
  ],
  competitiveness: 'High'
},

  // === RICHMOND SCHOOLS ===
  {
    id: 'richmond-christian-school',
    name: 'Richmond Christian School',
    type: 'Private',
    level: 'k12',
    grades: 'K-12',
    location: 'Richmond',
    tuition: 16000,
    specialty: ['Christian Education', 'Character Development', 'Academic Excellence'],
    website: 'https://myrcs.ca',
    description: 'Established in 1957, Richmond Christian School equips students to serve Christ with three campuses serving different grade levels.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Year before entry',
    
    features: ['Three campuses', 'Christian worldview', 'Established 1957', 'Elementary to secondary'],
    competitiveness: 'Moderate',
    financialAid: true,
    uniformRequired: true
  },

  {
    id: 'canada-star-secondary',
    name: 'Canada Star Secondary School',
    type: 'Independent',
    level: 'high',
    grades: '8-12',
    location: 'Richmond',
    tuition: 20000,
    specialty: ['University Preparation', 'International Program', 'BC Curriculum'],
    website: 'https://canadastarsecondary.ca',
    description: 'Co-educational independent high school preparing students for top Canadian and U.S. universities.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Grade 7 planning',
    
    features: ['University preparation focus', 'International students welcome', 'Founded 2013', 'Safe environment'],
    competitiveness: 'Moderate',
    financialAid: false,
    uniformRequired: false
  },

  {
    id: 'chaoyin-bilingual',
    name: 'Chaoyin Bilingual School',
    type: 'Independent',
    level: 'elementary',
    grades: 'K-7',
    location: 'Richmond',
    tuition: 18000,
    specialty: ['Bilingual Education', 'Mandarin Program', 'Cultural Immersion'],
    website: 'https://chaoyinschool.ca',
    description: 'Canadian bilingual elementary school offering unique Mandarin language program with balanced development approach.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Kindergarten year',
    
    features: ['Mandarin-English bilingual', 'Cultural immersion', 'Independent learning', 'Collaborative environment'],
    competitiveness: 'Moderate',
    financialAid: false,
    uniformRequired: false
  },

  {
    id: 'pythagoras-academy',
    name: 'Pythagoras Academy',
    type: 'Independent',
    level: 'elementary',
    grades: 'K-8',
    location: 'Richmond',
    tuition: 19000,
    specialty: ['Academic Excellence', 'Arts Integration', 'Innovation'],
    website: 'https://pythagorasacademy.ca',
    description: 'Private school promoting whole child development with focus on academic foundation and creative thinking skills.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Year before entry',
    
    features: ['Whole child development', 'Arts-infused curriculum', 'Critical thinking', 'Innovation focus'],
    competitiveness: 'Moderate',
    financialAid: false,
    uniformRequired: false
  },

  // === BURNABY SCHOOLS ===
  {
    id: 'deer-lake-sda',
    name: 'Deer Lake Seventh-day Adventist School',
    type: 'Private',
    level: 'elementary',
    grades: 'K-8',
    location: 'Burnaby',
    tuition: 14000,
    specialty: ['Christian Education', 'Whole Child Development', 'Character Building'],
    website: 'https://www.deerlakeschool.ca',
    description: 'Seventh-day Adventist school providing Christian education with focus on whole child development.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Open House or school tours required',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Year before entry',
    
    features: ['Christian education', 'Character building', 'English proficiency testing', 'Open house required'],
    competitiveness: 'Low',
    financialAid: true,
    uniformRequired: true
  },

  {
    id: 'st-helens-catholic',
    name: 'St. Helen\'s Catholic School',
    type: 'Catholic',
    level: 'elementary',
    grades: 'K-7',
    location: 'Burnaby',
    tuition: 8000,
    specialty: ['Catholic Education', 'Faith Formation', 'Academic Excellence'],
    website: 'https://www.sthelensschool.ca',
    description: 'Catholic elementary school celebrating 101+ years of providing Catholic education with academic excellence.',
    
    applicationDeadline: 'February',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Kindergarten year',
    
    features: ['101+ years history', 'Catholic faith formation', 'Parent involvement', 'Fundraising programs'],
    competitiveness: 'Low',
    financialAid: true,
    uniformRequired: true
  },

  // === INDEPENDENT/SPECIALIZED SCHOOLS ===
  {
    id: 'urban-academy',
    name: 'Urban Academy',
    type: 'Independent',
    level: 'k12',
    grades: 'JK-12',
    location: 'New Westminster',
    tuition: 24000,
    specialty: ['Small School', 'Individualized Learning', 'Arts & Innovation'],
    website: 'https://www.urbanacademy.ca',
    description: 'Small independent school emphasizing individualized learning and arts integration in urban setting.',
    
    applicationDeadline: 'November 15 (JK/SK), January 1 (others)',
    tourDates: 'Fall tours available',
    
    preparationTimeNeeded: '6-12 months',
    recommendedStartTime: 'January (for following September)',
    
    features: ['Small school environment', 'Individualized programs', 'Arts focus', 'Urban location'],
    competitiveness: 'High',
    financialAid: true,
    uniformRequired: false
  },

  {
    id: 'cornerstone-christian-academy',
    name: 'Cornerstone Christian Academy',
    type: 'Private',
    level: 'k12',
    grades: 'K-12',
    location: 'Surrey',
    tuition: 12000,
    specialty: ['Christian Education', 'Biblical Worldview', 'Character Building'],
    website: 'https://www.cornerstonechristianacademy.ca',
    description: 'Christian academy established in 1997, focusing on academic excellence and character building from biblical worldview.',
    
    applicationDeadline: 'Rolling admissions',
    tourDates: 'Year-round',
    
    preparationTimeNeeded: '3-6 months',
    recommendedStartTime: 'Year before entry',
    
    features: ['Biblical worldview', 'Character building', 'Safe learning environment', 'ACSI member'],
    competitiveness: 'Low',
    financialAid: true,
    uniformRequired: true
  }
];

// ============================
// HELPER FUNCTIONS
// ============================

export const getSchoolsByType = (type: School['type']) => {
  return schools.filter(school => school.type === type);
};

export const getSchoolsByLevel = (level: School['level']) => {
  return schools.filter(school => school.level === level);
};

export const getSchoolsByCompetitiveness = (competitiveness: School['competitiveness']) => {
  return schools.filter(school => school.competitiveness === competitiveness);
};

export const getPrivateSchools = () => {
  return schools.filter(school =>
    school.type === 'Private' ||
    school.type === 'Independent' ||
    school.type === 'Catholic'
  );
};

export const getPublicChoicePrograms = () => {
  return schools.filter(school =>
    school.type === 'Public' ||
    school.type === 'Mini School' ||
    school.type === 'IB Program'
  );
};

export const getSchoolsRequiringSSAT = () => {
  return schools.filter(school => school.ssatRequired === true);
};

export const getSchoolsWithFinancialAid = () => {
  return schools.filter(school => school.financialAid === true);
};

// ============================
// APPLICATION TIMELINE HELPERS
// ============================

export const getApplicationTimeline = () => {
  return {
    'Early Planning': {
      timeframe: 'January-March (year before)',
      tasks: [
        'Research schools and programs',
        'Attend open houses and tours',
        'Start SSAT preparation if needed',
        'Plan family budget and financial aid needs'
      ]
    },
    'Spring Preparation': {
      timeframe: 'April-August',
      tasks: [
        'Continue SSAT prep (minimum 6 weeks)',
        'Gather required documents',
        'Request recommendation letters',
        'Plan school visits and tours'
      ]
    },
    'Application Season': {
      timeframe: 'September-December',
      tasks: [
        'Attend school open houses',
        'Take SSAT exams (if required)',
        'Submit applications before deadlines',
        'Complete parent/student interviews'
      ]
    },
    'Assessment Period': {
      timeframe: 'January-February',
      tasks: [
        'Participate in school assessments',
        'Complete student interviews',
        'Submit any additional documents',
        'Wait for admission decisions'
      ]
    },
    'Decision Time': {
      timeframe: 'March-April',
      tasks: [
        'Receive admission decisions',
        'Make final school choice',
        'Submit enrollment deposits',
        'Plan for September start'
      ]
    }
  };
};
