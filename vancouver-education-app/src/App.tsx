import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
  Star,
  RefreshCw,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

import { schools, School } from './data/schools';

export default function App() {
  // Wizard state
  const [step, setStep] = useState(0);
  const steps = ['Welcome', 'Profile', 'Discovery', 'Results'];
  const progress = (step / (steps.length - 1)) * 100;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Profile state
  const [profile, setProfile] = useState({
    parentName: '',
    childName: '',
    childAge: 5,
    budget: 0,
    location: 'Vancouver',
    priorities: [] as string[],
  });
  const updateProfile = (key: keyof typeof profile, value: any) =>
    setProfile({ ...profile, [key]: value });

  // Selection state
  const [selected, setSelected] = useState<string[]>([]);
  const toggleSchool = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 5 ? [...s, id] : s
    );
  const togglePriority = (p: string) =>
    updateProfile(
      'priorities',
      profile.priorities.includes(p)
        ? profile.priorities.filter((x) => x !== p)
        : [...profile.priorities, p]
    );

  // Navigation helpers
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => {
    setStep(0);
    setProfile({
      parentName: '',
      childName: '',
      childAge: 5,
      budget: 0,
      location: 'Vancouver',
      priorities: [],
    });
    setSelected([]);
  };

  // Filter logic
  const levelsForAge = (age: number) => {
    if (age <= 6) return ['preschool', 'elementary', 'k12'];
    if (age <= 11) return ['elementary', 'k12'];
    if (age <= 14) return ['middle', 'high', 'k12'];
    return ['high', 'k12'];
  };
  const filteredSchools = schools.filter((sch) => {
    if (!levelsForAge(profile.childAge).includes(sch.level)) return false;
    if (profile.location !== 'Flexible' && sch.location !== profile.location)
      return false;
    if (
      typeof sch.tuition === 'number' &&
      profile.budget > 0 &&
      sch.tuition > profile.budget
    )
      return false;
    return true;
  });

  const selectedSchools = filteredSchools.filter((s) => selected.includes(s.id));

  const formatBudget = (b: number) =>
    b === 0 ? 'Public only (Free)' : `Up to $${b.toLocaleString()}/yr`;

  // Canvas-based PDF generation
  const downloadPlan = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (A4 proportions)
    canvas.width = 800;
    canvas.height = 1120;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let y = 40;
    const margin = 40;
    const lineHeight = 20;
    
    // Helper function to draw text
    const drawText = (text: string, x: number, size: number = 12, color: string = '#000000', weight: string = 'normal') => {
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px Arial, sans-serif`;
      ctx.fillText(text, x, y);
      y += lineHeight;
    };
    
    // Helper function to draw section
    const drawSection = (title: string, items: string[], bgColor: string = '#f8f9fa') => {
      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(margin, y - 15, canvas.width - (margin * 2), items.length * lineHeight + 30);
      
      // Title
      drawText(title, margin + 10, 14, '#333333', 'bold');
      
      // Items
      items.forEach(item => {
        drawText(`• ${item}`, margin + 20, 11, '#555555');
      });
      
      y += 20; // Extra spacing after section
    };

    // Title
    const title = profile.parentName
      ? `${profile.parentName}'s Education Plan`
      : 'Your Education Plan';
    drawText(title + (profile.childName ? ` for ${profile.childName}` : ''), margin, 20, '#1a202c', 'bold');
    
    drawText('Your personalized school recommendations and comprehensive action plan', margin, 12, '#666666');
    y += 20;

    // Overview
    drawText(`${selected.length} Schools Selected | Budget: ${formatBudget(profile.budget)} | Age: ${profile.childAge}`, margin, 12, '#333333', 'bold');
    y += 20;

    // Selected Schools
    drawText('Selected Schools:', margin, 16, '#1a202c', 'bold');
    selectedSchools.forEach((school, i) => {
      drawText(`${i + 1}. ${school.name} (${school.grades}) – ${school.location}`, margin + 10, 12);
      drawText(`   Tuition: ${typeof school.tuition === 'number' ? `$${school.tuition.toLocaleString()}` : school.tuition}`, margin + 10, 10, '#666666');
      drawText(`   Deadline: ${school.applicationDeadline}`, margin + 10, 10, '#666666');
    });
    y += 20;

    // Action Plan Sections
    drawSection('Immediate Actions (This Week)', [
      'Mark all application deadlines in your calendar with reminders',
      'Start researching each selected school thoroughly',
      'Create a spreadsheet to track application requirements',
      'Research info sessions and book school tours'
    ], '#fee2e2');

    drawSection('Short-term Planning (1-3 Months)', [
      'Book tours at your selected schools (many require advance booking)',
      'Attend virtual or in-person information nights',
      'Request transcripts and report cards from current school',
      'Identify and contact potential references',
      ...(profile.childAge >= 12 ? ['Register for SSAT if applying to competitive private schools'] : ['Gather documentation (birth certificates, immunization records)'])
    ], '#fef3c7');

    drawSection('Medium-term Strategy (3-6 Months)', [
      'Focus on strengthening weak subject areas',
      'Practice interview questions and help articulate interests',
      'Research scholarship and bursary opportunities',
      'Calculate total costs including uniforms and activities',
      'Document achievements, awards, and extracurricular activities'
    ], '#dbeafe');

    drawSection('Long-term Success Strategy', [
      'Apply to safety schools that you would be happy with',
      'Stay updated on school policy changes and new programs',
      'Connect with other families going through the process',
      'Build relationships that will support your family\'s journey',
      'Plan for transitions and adjustment periods'
    ], '#dcfce7');

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(profile.parentName || 'education').toLowerCase().replace(/\s+/g, '-')}-plan.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hidden canvas for PDF generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <header className="bg-base-200 p-4 shadow">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Vancouver Education Tool</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`flex items-center ${
                  i === step ? 'text-primary font-bold' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    i <= step ? 'bg-primary text-primary-content' : 'bg-gray-300'
                  }`}
                >
                  {i + 1}
                </div>
                {s}
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                Welcome to the Vancouver Education Tool
              </CardTitle>
              <CardDescription className="text-lg">
                Find the perfect school for your child with our personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <Users className="h-12 w-12 text-primary mb-2" />
                  <h3 className="font-semibold">Personalized</h3>
                  <p className="text-sm text-gray-600">
                    Tailored to your child's age and needs
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="h-12 w-12 text-primary mb-2" />
                  <h3 className="font-semibold">Location-Based</h3>
                  <p className="text-sm text-gray-600">
                    Schools in Vancouver and surrounding areas
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-primary mb-2" />
                  <h3 className="font-semibold">Action Plan</h3>
                  <p className="text-sm text-gray-600">
                    Get a comprehensive education plan
                  </p>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full max-w-md">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Profile */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>
                Help us personalize your school recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Your Name (Optional)</Label>
                  <Input
                    id="parentName"
                    value={profile.parentName}
                    onChange={(e) => updateProfile('parentName', e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="childName">Child's Name (Optional)</Label>
                  <Input
                    id="childName"
                    value={profile.childName}
                    onChange={(e) => updateProfile('childName', e.target.value)}
                    placeholder="Enter child's name"
                  />
                </div>
              </div>

              <div>
                <Label>Child's Age: {profile.childAge}</Label>
                <Slider
                  value={[profile.childAge]}
                  onValueChange={([val]) => updateProfile('childAge', val)}
                  min={3}
                  max={18}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Preferred Location</Label>
                <Select
                  value={profile.location}
                  onValueChange={(val) => updateProfile('location', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vancouver">Vancouver</SelectItem>
                    <SelectItem value="Richmond">Richmond</SelectItem>
                    <SelectItem value="Burnaby">Burnaby</SelectItem>
                    <SelectItem value="Surrey">Surrey</SelectItem>
                    <SelectItem value="North Vancouver">North Vancouver</SelectItem>
                    <SelectItem value="West Vancouver">West Vancouver</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Annual Budget: {formatBudget(profile.budget)}</Label>
                <Slider
                  value={[profile.budget]}
                  onValueChange={([val]) => updateProfile('budget', val)}
                  min={0}
                  max={50000}
                  step={1000}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Discovery */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What matters most to you?</CardTitle>
                <CardDescription>
                  Select your top priorities (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Academic Excellence',
                    'Arts Programs',
                    'Sports Programs',
                    'Small Class Sizes',
                    'Technology Integration',
                    'Language Programs',
                    'Special Needs Support',
                    'International Baccalaureate',
                    'Religious Education',
                  ].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={priority}
                        checked={profile.priorities.includes(priority)}
                        onCheckedChange={() => togglePriority(priority)}
                      />
                      <Label htmlFor={priority} className="text-sm">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schools matching your criteria</CardTitle>
                <CardDescription>
                  Select up to 5 schools that interest you ({selected.length}/5)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selected.includes(school.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleSchool(school.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{school.name}</h3>
                          <p className="text-gray-600">{school.grades}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {school.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {typeof school.tuition === 'number'
                                ? `$${school.tuition.toLocaleString()}`
                                : school.tuition}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {school.applicationDeadline}
                            </span>
                          </div>
                        </div>
                        <Checkbox
                          checked={selected.includes(school.id)}
                          onChange={() => toggleSchool(school.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={nextStep} disabled={selected.length === 0}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                {profile.childName
                  ? `${profile.childName}'s Education Plan`
                  : 'Your Education Plan'}
              </h2>
              <p className="text-gray-600">
                Congratulations! Here's your personalized school selection and action plan.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{selected.length}</h3>
                  <p className="text-gray-600">Schools Selected</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold">{formatBudget(profile.budget)}</h3>
                  <p className="text-gray-600">Budget Range</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{profile.childAge}</h3>
                  <p className="text-gray-600">Age</p>
                </CardContent>
              </Card>
            </div>

            {/* Selected Schools */}
            <Card>
              <CardHeader>
                <CardTitle>Your Selected Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSchools.map((school, index) => (
                    <div key={school.id} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold text-lg">
                        {index + 1}. {school.name}
                      </h3>
                      <p className="text-gray-600">{school.grades}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {school.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {typeof school.tuition === 'number'
                            ? `$${school.tuition.toLocaleString()}`
                            : school.tuition}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {school.applicationDeadline}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Alert */}
            {profile.childAge >= 11 && (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Critical Timeline Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700">
                  <p className="font-medium">
                    {profile.childAge === 11 ? 
                      "Grade 6 is crucial for Grade 8 private school applications. Most deadlines are in December-January." :
                      profile.childAge === 12 ?
                      "Grade 7 applications are due soon! Focus on completing applications and preparing for interviews." :
                      "High school applications require immediate attention. Some deadlines may have passed - check current availability."
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Application Preparation Tips */}
            {selectedSchools.some(school => school.competitiveness === 'Very High' || school.competitiveness === 'High') && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                    Preparation Tips for Competitive Schools
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <div className="space-y-3">
                    <p className="font-medium">Since you've selected competitive schools, consider these preparation steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Start preparation 12-24 months before application deadlines</li>
                      <li>Consider SSAT preparation tutoring for private schools</li>
                      <li>Build a portfolio showcasing your child's achievements</li>
                      <li>Practice interview skills and assessment activities</li>
                      <li>Attend multiple school information sessions and tours</li>
                      <li>Maintain excellent academic performance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tutoring Resources */}
            {selectedSchools.some(school => school.type === 'Private' || school.type === 'IB' || school.type === 'Independent') && (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">
                    <BookOpen className="w-5 h-5 inline mr-2" />
                    Recommended Preparation Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700">
                  <div className="space-y-3">
                    <p className="font-medium">Local tutoring and preparation services:</p>
                    <div className="grid gap-3">
                      <div className="text-sm">
                        <div className="font-medium">KEY Education</div>
                        <div>SSAT prep, private school admissions consulting, interview coaching</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Aspire Math Academy (West Vancouver)</div>
                        <div>Private school entrance coaching, SSAT preparation, mock interviews</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Test Innovators (Online)</div>
                        <div>SSAT practice tests, adaptive learning platform</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Immediate Actions */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Immediate Actions (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-700 space-y-4">
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Mark all application deadlines in your calendar with reminders</li>
                  <li>• Start researching each selected school thoroughly</li>
                  <li>• Create a spreadsheet to track application requirements</li>
                  <li>• Research info sessions and book school tours</li>
                </ul>
              </CardContent>
            </Card>

            {/* Short-term Planning */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Short-term Planning (Next 1-3 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-700 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">School Visits & Information Sessions</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Book tours at your selected schools (many require advance booking)</li>
                    <li>• Attend virtual or in-person information nights</li>
                    <li>• Prepare questions about curriculum, class sizes, and school culture</li>
                    <li>• Take notes and photos (if permitted) for later comparison</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Application Preparation</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Request transcripts and report cards from current school</li>
                    <li>• Identify and contact potential references (teachers, coaches, mentors)</li>
                    <li>• Begin drafting personal statements or essays if required</li>
                    <li>• Gather documentation (birth certificates, immunization records)</li>
                  </ul>
                </div>

                {profile.childAge >= 12 && (
                  <div>
                    <h4 className="font-medium mb-2">Test Preparation (If Required)</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Register for SSAT if applying to competitive private schools</li>
                      <li>• Consider test prep courses or tutoring (KEY Education, Prep Academy)</li>
                      <li>• Schedule practice tests and review sessions</li>
                      <li>• Plan test dates allowing time for retakes if needed</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medium-term Strategy */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Medium-term Strategy (3-6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Academic Enhancement</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Focus on strengthening weak subject areas</li>
                    <li>• Consider enrichment programs that align with your priorities</li>
                    <li>• Maintain strong grades and positive teacher relationships</li>
                    <li>• Document achievements, awards, and extracurricular activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Interview Preparation</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Practice common interview questions with {profile.childName || 'your child'}</li>
                    <li>• Help them articulate their interests and goals</li>
                    <li>• Prepare questions they can ask about the school</li>
                    <li>• Plan appropriate interview attire</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Financial Planning</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Research scholarship and bursary opportunities</li>
                    <li>• Calculate total costs including uniforms, supplies, and activities</li>
                    <li>• Plan payment schedules and explore financing options</li>
                    <li>• Consider tax implications and education savings plans</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Long-term Considerations */}
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
                    <li>• Apply to safety schools that you'd be happy with</li>
                    <li>• Research waitlist procedures for competitive schools</li>
                    <li>• Have a plan for gap year or alternative pathways if needed</li>
                    <li>• Consider timing of applications for different entry points</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ongoing Monitoring</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Stay updated on school policy changes and new programs</li>
                    <li>• Maintain relationships with school admissions offices</li>
                    <li>• Continue developing {profile.childName || 'your child'}'s interests and talents</li>
                    <li>• Plan for transitions and adjustment periods</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Community Building</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Connect with other families going through the process</li>
                    <li>• Join parent groups and school communities early</li>
                    <li>• Build relationships that will support your family's journey</li>
                    <li>• Consider volunteering opportunities at prospective schools</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

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

      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>
            Vancouver Education Decision Tool • Data updated December 2024
          </p>
          <p className="mt-2">
            Always verify current details with schools directly.
          </p>
        </div>
      </footer>
    </div>
  );
}
