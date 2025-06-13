import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Home,
  RefreshCw,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { schools, School } from './data/schools';

export default function App() {
  // ─── Wizard State ─────────────────────────────────────────
  const steps = ['Welcome','Profile','Discovery','Results'] as const;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const progress = (currentStep / (steps.length - 1)) * 100;
  const nextStep = () => setCurrentStep(c => Math.min(c+1, steps.length-1));
  const prevStep = () => setCurrentStep(c => Math.max(c-1, 0));

  // ─── Profile & Selection State ────────────────────────────
  const [profile, setProfile] = useState({
    childAge: 5,
    budget: 0,
    location: 'Vancouver',
    priorities: [] as string[]
  });
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const restart = () => {
    setCurrentStep(0);
    setProfile({ childAge:5, budget:0, location:'Vancouver', priorities:[] });
    setSelectedSchools([]);
  };

  // ─── Priority Helpers ─────────────────────────────────────
  const priorities = [
    'Academic Excellence',
    'Arts & Creativity',
    'Small Class Sizes',
    'Language Learning',
    'Gifted Programs',
    'Technology Focus',
    'Outdoor Education',
    'Strong Community'
  ];

  const togglePriority = (p: string) => {
    setProfile(prev => {
      const arr = prev.priorities.includes(p)
        ? prev.priorities.filter(x => x!==p)
        : [...prev.priorities, p];
      return {...prev, priorities:arr};
    });
  };

  // ─── School Selection ─────────────────────────────────────
  const toggleSchool = (id: string) => {
    setSelectedSchools(prev =>
      prev.includes(id)
        ? prev.filter(x=>x!==id)
        : prev.length<5
          ? [...prev,id]
          : prev
    );
  };

  // ─── Filter Helpers ────────────────────────────────────────
  function getLevels(age: number): string[] {
    if (age <= 6) return ['preschool','elementary','k12'];
    if (age <=11) return ['elementary','k12'];
    if (age <=14) return ['middle','high','k12'];
    return ['high','k12'];
  }
  const priorityKeywords: Record<string,string[]> = {
    'Academic Excellence': ['academic','excellence','gifted'],
    'Arts & Creativity': ['arts','drama','music','creative'],
    'Small Class Sizes': ['small class','small'],
    'Language Learning': ['language','french','mandarin','bilingual','immersion'],
    'Gifted Programs': ['gifted'],
    'Technology Focus': ['stem','science','technology'],
    'Outdoor Education': ['outdoor','nature','environment'],
    'Strong Community': ['community','values','character'],
  };

  const filteredSchools = schools.filter(school => {
  // 1) Age / Level
  if (!getLevels(profile.childAge).includes(school.level)) return false;

  // 2) Location
  if (
    profile.location !== 'Flexible' &&
    !school.location
      .toLowerCase()
      .includes(profile.location.toLowerCase())
  ) {
    return false;
  }

  // 3) Budget — “Free” always shows; numeric tuitions only if ≤ budget
  const isFree =
    typeof school.tuition === 'string' &&
    school.tuition.toLowerCase().includes('free');
  const isPaidNumber = typeof school.tuition === 'number';

  if (profile.budget === 0) {
    // budget=0 → only free
    if (!isFree) return false;
  } else {
    // budget>0 → show all frees + paid ≤ budget
    if (isPaidNumber && school.tuition > profile.budget) {
      return false;
    }
    // (everything else—including isFree—passes)
  }

  // 4) Priorities
  if (profile.priorities.length > 0) {
    const text = [
      ...school.specialty,
      ...school.features,
      school.description
    ]
      .join(' ')
      .toLowerCase();

    const ok = profile.priorities.some(p => {
      const kws = priorityKeywords[p] || [p.toLowerCase()];
      return kws.some(kw => text.includes(kw));
    });

    if (!ok) return false;
  }

  return true;
});

  const formatBudget = (b: number) =>
    b===0 ? 'Public only (Free)' : `Up to $${b.toLocaleString()}/yr`;

  // ─── PDF Generation ─────────────────────────────────────────
  function downloadPlan() {
    const downloadPlan = () => {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin;

  // — Title —
  doc.setFont('helvetica', 'bold').setFontSize(18);
  const title = profile.parentName
    ? `${profile.parentName}'s Education Plan`
    : "Your Education Plan";
  doc.text(title + (profile.childName ? ` for ${profile.childName}` : ''), margin, y);
  y += 30;

  // — Subtitle —
  doc.setFont('helvetica', 'normal').setFontSize(12);
  doc.text(
    'Your personalized school recommendations and comprehensive action plan',
    margin,
    y
  );
  y += 30;

  // — Overview Cards —
  doc.setFontSize(12).setFont('helvetica', 'bold');
  doc.text(`${selectedSchools.length} Schools Selected`, margin, y);
  doc.text(`Budget: ${formatBudget(profile.budget)}`, margin + 200, y);
  doc.text(`Age ${profile.childAge}`, margin + 380, y);
  y += 30;

  // — Selected Schools List —
  doc.setFont('helvetica', 'bold').setFontSize(14);
  doc.text(
    profile.childName
      ? `${profile.childName}'s Selected Schools`
      : "Your Selected Schools",
    margin,
    y
  );
  y += 20;
  doc.setFont('helvetica', 'normal').setFontSize(11);

  schools
    .filter(s => selectedSchools.includes(s.id))
    .forEach((s, i) => {
      // Header line
      const header = `${i + 1}. ${s.name} (${s.grades}) – ${s.location}`;
      doc.text(header, margin, y);
      y += 14;

      // Specialty line
      doc.setTextColor(90);
      doc.text(s.specialty.join(', '), margin + 10, y);
      doc.setTextColor(0);
      y += 14;

      // Tuition & Deadline
      const line = `${typeof s.tuition === 'number'
        ? `$${s.tuition.toLocaleString()}/yr`
        : s.tuition
      } • Deadline: ${s.applicationDeadline}`;
      doc.text(line, margin + 10, y);
      y += 20;

      // Wrap description
      const lines = doc.splitTextToSize(s.description, pageWidth - margin * 2 - 10);
      doc.text(lines, margin + 10, y);
      y += lines.length * 12 + 10;

      // Page break if needed
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    });

  // Utility to draw a colored box heading
  const drawSection = (color: string, title: string, tasks: string[]) => {
    doc.setDrawColor(color).setFillColor(color + '22').rect(margin, y, pageWidth - margin * 2, 60, 'FD');
    doc.setTextColor(color).setFont('helvetica', 'bold').setFontSize(12);
    doc.text(title, margin + 8, y + 16);
    doc.setTextColor(0).setFont('helvetica', 'normal').setFontSize(10);
    tasks.forEach((t, idx) =>
      doc.text(`• ${t}`, margin + 12, y + 34 + idx * 12)
    );
    y += 70;
  };

  // — Immediate (Red) —
  drawSection('#dc2626', 'Immediate Actions (This Week)', [
    'Mark critical dates with early reminders',
    'Start your school research online',
    'Create a tracking system (spreadsheet/folders)'
  ]);

  // — Short-term (Yellow) —
  drawSection('#f59e0b', 'Short-term Planning (1–3 Months)', [
    'Book tours & info sessions',
    'Prepare application materials',
    profile.childAge >= 12
      ? 'Register for SSAT & begin prep'
      : 'Gather transcripts & references'
  ]);

  // — Medium-term (Blue) —
  drawSection('#3b82f6', 'Medium-term Strategy (3–6 Months)', [
    'Focus on academic enrichment & tutoring',
    'Practice interviews with your child',
    'Plan finances & scholarship research'
  ]);

  // — Long-term (Green) —
  drawSection('#10b981', 'Long-term Success Strategy', [
    'Apply to safety/backup schools',
    'Join parent & school communities',
    'Monitor policy/program changes'
  ]);

  // — Final save —
  const filename = `${(profile.parentName || 'your')
    .toLowerCase()
    .replace(/\s+/g, '-')}-education-plan.pdf`;
  doc.save(filename);
};

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="bg-base-200 text-base-content">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Vancouver Education Tool</h1>
          </div>
          {currentStep>0 && (
            <div className="flex items-center space-x-4">
              <span>Step {currentStep} of {steps.length-1}</span>
              <Progress value={progress} className="w-32" />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Welcome */}
        {currentStep===0 && (
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Vancouver Education Decision Tool
            </h1>
            <p className="text-lg text-neutral-content/80">
              Find the perfect school for your child, with personalized guidance and a clear plan.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="w-12 h-12 mx-auto text-primary" />
                  <CardTitle>100+ Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Public, private & specialized programs</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 mx-auto text-success" />
                  <CardTitle>Personalized</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Matches based on your criteria</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Calendar className="w-12 h-12 mx-auto text-secondary" />
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Deadlines & action steps</p>
                </CardContent>
              </Card>
            </div>
            <Button onClick={nextStep} size="lg" className="btn-primary">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}

        {/* Profile */}
        {currentStep===1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Tell Us About Your Family</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Child Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Age: {profile.childAge}</Label>
                    <input
                      type="range" min={2} max={18} step={1}
                      value={profile.childAge}
                      onChange={e=>setProfile({...profile, childAge:+e.target.value})}
                      className="range range-primary w-full"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Select
                      value={profile.location}
                      onValueChange={loc=>setProfile({...profile, location:loc})}
                    >
                      <SelectTrigger className="bg-base-100 text-base-content">
                        <SelectValue placeholder="Flexible" />
                      </SelectTrigger>
                      <SelectContent className="bg-base-100 text-base-content">
                        {['Vancouver','Burnaby','Richmond','Flexible'].map(loc => (
                          <SelectItem value={loc} key={loc}>{loc}</SelectItem>
                         ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
                <CardContent>
                  <Label>{formatBudget(profile.budget)}</Label>
                  <input
                    type="range" min={0} max={50000} step={2500}
                    value={profile.budget}
                    onChange={e=>setProfile({...profile, budget:+e.target.value})}
                    className="range range-secondary w-full"
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Priorities</CardTitle>
                <CardDescription>Select what matters most</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {priorities.map(p=>(
                  <div
                    key={p}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition ${
                      profile.priorities.includes(p)
                        ? 'border-primary bg-primary/20'
                        : 'border-neutral'}
                    `}
                    onClick={()=>togglePriority(p)}
                  >
                    <Checkbox checked={profile.priorities.includes(p)} />
                    <Label>{p}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft /> Back
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Find Schools <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* Discovery */}
        {currentStep===2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary">Discover Schools</h2>
              <p className="text-neutral-content/80">
                Found {filteredSchools.length} matching schools. Select up to 5.
              </p>
            </div>
            {selectedSchools.length>0 && (
              <Card className="bg-primary/20 border-primary">
                <CardContent>
                  <div className="flex justify-between">
                    <span>{selectedSchools.length} selected</span>
                    <Badge>{5-selectedSchools.length} left</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSchools.map(s=>(
                <Card
                  key={s.id}
                  onClick={()=>toggleSchool(s.id)}
                  className={`cursor-pointer transition ${
                    selectedSchools.includes(s.id)
                      ? 'border-primary bg-primary/20'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{s.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-content/80" />
                          {s.location} • {s.grades}
                        </CardDescription>
                      </div>
                      <Checkbox checked={selectedSchools.includes(s.id)} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-primary font-medium">{s.specialty.join(', ')}</div>
                    <div className="flex items-center gap-4 text-sm text-neutral-content/80">
                      <div className="flex items-center gap-1">
                        <DollarSign /> {s.tuition}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar /> {s.applicationDeadline}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.features.map((f,i)=>(
                        <Badge key={i} variant="outline" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-neutral-content/60">
                      Competitiveness: {s.competitiveness}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft /> Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={selectedSchools.length===0}
                className="btn-primary"
              >
                View Results ({selectedSchools.length}) <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {/* Enhanced Results Step */}
{currentStep === 3 && (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-3xl font-bold">
        {profile.parentName ? `${profile.parentName}'s` : 'Your'} Education Plan
        {profile.childName && ` for ${profile.childName}`}
      </h2>
      <p className="text-gray-600 mt-2">
        Your personalized school recommendations and comprehensive action plan
      </p>
    </div>

    {/* Overview Cards */}
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="text-center">
        <CardHeader>
          <BookOpen className="w-12 h-12 mx-auto text-blue-500" />
          <CardTitle>{selectedSchools.length} Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Selected for {profile.childName || 'your child'}
          </p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardHeader>
          <DollarSign className="w-12 h-12 mx-auto text-green-500" />
          <CardTitle>{formatBudget(profile.budget)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Your budget range</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardHeader>
          <Calendar className="w-12 h-12 mx-auto text-purple-500" />
          <CardTitle>Age {profile.childAge}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {profile.childAge <= 5
              ? 'Early planning advantage'
              : profile.childAge <= 11
              ? 'Perfect timing for research'
              : 'Time-sensitive applications'}
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Selected Schools List */}
    <Card>
      <CardHeader>
        <CardTitle>
          {profile.childName
            ? `${profile.childName}'s`
            : "Your Child's"} Selected Schools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schools
          .filter(s => selectedSchools.includes(s.id))
          .map((school, index) => (
            <div key={school.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{school.name}</h3>
                  <p className="text-gray-600">
                    {school.specialty.join(', ')}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{school.location}</span>
                    <span>
                      {typeof school.tuition === 'number'
                        ? `$${school.tuition.toLocaleString()}/year`
                        : school.tuition}
                    </span>
                    <span>Deadline: {school.applicationDeadline}</span>
                  </div>
                </div>
                <Badge variant="outline">{school.type}</Badge>
              </div>
              {index < selectedSchools.length - 1 && <hr className="mt-4" />}
            </div>
          ))}
      </CardContent>
    </Card>

    {/* Immediate Actions (Red) */}
    <Card className="bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Immediate Actions (This Week)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-red-700 space-y-3">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Mark Critical Dates</p>
            <p className="text-sm">
              Add all application deadlines to your calendar with 2-week early
              reminders
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Start School Research</p>
            <p className="text-sm">
              Visit websites, download info packages, and sign up for updates
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Create Application Tracker</p>
            <p className="text-sm">
              Spreadsheet or folder system to track requirements & progress
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Short-term Planning (Yellow) */}
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Short-term Planning (1–3 Months)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-yellow-700 space-y-4">
        <div>
          <h4 className="font-medium mb-2">
            School Visits & Information Sessions
          </h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Book tours at your selected schools</li>
            <li>• Attend virtual or in-person info nights</li>
            <li>• Prepare questions on curriculum & culture</li>
            <li>• Take notes/images for later comparison</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Application Preparation</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Request transcripts & report cards</li>
            <li>• Contact references (teachers, mentors)</li>
            <li>• Draft essays or personal statements</li>
            <li>• Gather birth/immunization records</li>
          </ul>
        </div>
        {profile.childAge >= 12 && (
          <div>
            <h4 className="font-medium mb-2">Test Preparation (If Required)</h4>
            <ul className="space-y-1 text-sm ml-4">
              <li>• Register for SSAT & prep courses</li>
              <li>• Schedule practice tests & review</li>
              <li>• Plan retakes if needed</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Medium-term Strategy (Blue) */}
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Medium-term Strategy (3–6 Months)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Academic Enhancement</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Strengthen weak subject areas</li>
            <li>• Enroll in enrichment programs</li>
            <li>• Maintain strong grades & teacher rapport</li>
            <li>• Document awards & activities</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Interview Preparation</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>
              • Practice common questions with {profile.childName || 'your child'}
            </li>
            <li>• Articulate interests & goals</li>
            <li>• Prepare thoughtful school questions</li>
            <li>• Plan interview attire</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Financial Planning</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Research scholarships & bursaries</li>
            <li>• Calculate total costs (uniforms, supplies)</li>
            <li>• Plan payment schedules</li>
            <li>• Explore education savings plans</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    {/* Long-term Success (Green) */}
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Long-term Success Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-700 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Backup Plans</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Apply to safety schools</li>
            <li>• Research waitlist procedures</li>
            <li>• Plan gap-year or alternatives</li>
            <li>• Stagger entry points if needed</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Ongoing Monitoring</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Track policy & program changes</li>
            <li>• Maintain admissions contacts</li>
            <li>
              • Nurture {profile.childName || 'your child'}’s interests & talents
            </li>
            <li>• Plan for transitions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Community Building</h4>
          <ul className="space-y-1 text-sm ml-4">
            <li>• Connect with other families</li>
            <li>• Join parent groups early</li>
            <li>• Volunteer at prospective schools</li>
            <li>• Build long-term support networks</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    {/* Download & Restart */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button onClick={downloadPlan} size="lg">
        <Download className="w-4 h-4 mr-2" />
        Download {profile.parentName ? `${profile.parentName}'s` : 'Your'} Plan
      </Button>
      <Button variant="outline" onClick={restart} size="lg">
        <RefreshCw className="w-4 h-4 mr-2" />
        Start Over
      </Button>
    </div>
  </div>
)}
      </main>

      <footer className="bg-base-200 text-base-content text-center p-6">
        <p>Vancouver Education Decision Tool • Data as of Dec 2024</p>
      </footer>
    </div>
  );
}
