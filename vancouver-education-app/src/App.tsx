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
  AlertCircle
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

  // 3) Budget
  if (profile.budget === 0) {
    if (school.tuition !== 'Free') return false;
  } else if (
    typeof school.tuition === 'number' &&
    school.tuition > profile.budget
  ) {
    return false;
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
    // ...your existing downloadPlan logic or jsPDF helper...
  }

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
        {currentStep===3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary">Your Education Plan</h2>
              <p className="text-neutral-content/80">
                Personalized recommendations & next steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="w-12 h-12 mx-auto text-primary" />
                  <CardTitle>{selectedSchools.length} Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Selected for you</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <DollarSign className="w-12 h-12 mx-auto text-success" />
                  <CardTitle>{formatBudget(profile.budget)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Budget range</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <Calendar className="w-12 h-12 mx-auto text-secondary" />
                <CardTitle>Age {profile.childAge}</CardTitle>
                <CardContent>
                  <p>Planning timeline</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selected Schools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schools
                  .filter(s=>selectedSchools.includes(s.id))
                  .map((s,i)=>(
                  <div key={s.id}>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{s.name}</h3>
                        <p className="text-neutral-content/80">{s.specialty.join(', ')}</p>
                        <div className="flex items-center gap-4 text-sm mt-1 text-neutral-content/80">
                          <MapPin /> {s.location}
                          <DollarSign /> {s.tuition}
                          <Calendar /> {s.applicationDeadline}
                        </div>
                      </div>
                      <Badge>{s.type}</Badge>
                    </div>
                    {i < selectedSchools.length-1 && <hr className="my-4"/>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 4-Tier Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Immediate */}
              <Card className="border-error">
                <CardHeader>
                  <CardTitle className="text-error"><Clock className="mr-2"/>This Week</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-disc list-inside">
                    <li>Mark deadlines in your calendar</li>
                    <li>Research info sessions</li>
                    <li>Track school updates</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Short-term */}
              <Card className="border-warning">
                <CardHeader>
                  <CardTitle className="text-warning"><Calendar className="mr-2"/>1–3 Months</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-disc list-inside">
                    <li>Book tours & info nights</li>
                    <li>Prepare applications</li>
                    {profile.childAge>=12 && <li>Register for tests (SSAT)</li>}
                  </ul>
                </CardContent>
              </Card>
              {/* Medium-term */}
              <Card className="border-info">
                <CardHeader>
                  <CardTitle className="text-info"><FileText className="mr-2"/>3–6 Months</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-disc list-inside">
                    <li>Academic enrichment & tutoring</li>
                    <li>Interview practice</li>
                    <li>Financial planning</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Long-term */}
              <Card className="border-success">
                <CardHeader>
                  <CardTitle className="text-success"><BookOpen className="mr-2"/>Long-term</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-disc list-inside">
                    <li>Apply to backup schools</li>
                    <li>Join community groups</li>
                    <li>Monitor policy changes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={downloadPlan} className="btn-primary">
                <Download className="mr-2"/> Download Your Plan
              </Button>
              <Button variant="outline" onClick={restart}>
                <RefreshCw className="mr-2"/> Start Over
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
