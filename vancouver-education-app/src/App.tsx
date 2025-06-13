import React, { useState } from 'react';
import jsPDF from 'jspdf';
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
  Info,
} from 'lucide-react';

import { schools, School } from './data/schools';

export default function App() {
  // Wizard state
  const [step, setStep] = useState(0);
  const steps = ['Welcome', 'Profile', 'Discovery', 'Results'];
  const progress = (step / (steps.length - 1)) * 100;

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

  // Improved filter logic
  const getSchoolsForAge = (age: number) => {
    return schools.filter(school => {
      // Check if school serves this age based on grades
      const grades = school.grades.toLowerCase();
      
      // Preschool (ages 3-5)
      if (age <= 5) {
        return school.level === 'preschool' || 
               grades.includes('pk') || 
               grades.includes('jk') || 
               grades.includes('preschool') ||
               (school.level === 'k12' && (grades.includes('jk') || grades.includes('pk')));
      }
      
      // Elementary (ages 5-11: K-7)
      if (age >= 5 && age <= 11) {
        return school.level === 'elementary' || 
               school.level === 'k12' ||
               grades.includes('k') || 
               grades.includes('1') || 
               grades.includes('2') || 
               grades.includes('3') || 
               grades.includes('4') || 
               grades.includes('5') || 
               grades.includes('6') || 
               grades.includes('7');
      }
      
      // Middle School (ages 11-14: Grades 6-9)
      if (age >= 11 && age <= 14) {
        return school.level === 'middle' || 
               school.level === 'high' || 
               school.level === 'k12' ||
               grades.includes('6') || 
               grades.includes('7') || 
               grades.includes('8') || 
               grades.includes('9');
      }
      
      // High School (ages 14-18: Grades 9-12)
      if (age >= 14) {
        return school.level === 'high' || 
               school.level === 'k12' ||
               grades.includes('8') || 
               grades.includes('9') || 
               grades.includes('10') || 
               grades.includes('11') || 
               grades.includes('12');
      }
      
      return false;
    });
  };

  const filteredSchools = getSchoolsForAge(profile.childAge).filter((school) => {
    // Location filter
    if (profile.location !== 'Flexible' && school.location !== profile.location) {
      // More flexible location matching
      const schoolLocation = school.location.toLowerCase();
      const selectedLocation = profile.location.toLowerCase();
      
      // Check if school location contains the selected location or vice versa
      if (!schoolLocation.includes(selectedLocation) && !selectedLocation.includes(schoolLocation)) {
        return false;
      }
    }
    
    // Budget filter - only apply if budget > 0 and tuition is a number
    if (profile.budget > 0 && typeof school.tuition === 'number' && school.tuition > profile.budget) {
      return false;
    }
    
    return true;
  });

  const selectedSchools = filteredSchools.filter((s) => selected.includes(s.id));

  const formatBudget = (b: number) =>
    b === 0 ? 'Public only (Free)' : `Up to $${b.toLocaleString()}/yr`;

  // PDF generation using jsPDF
  const downloadPlan = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.height;

    // Helper to add new page if needed
    const checkPageBreak = (neededSpace: number) => {
      if (y + neededSpace > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Helper to add text with automatic page breaks
    const addText = (text: string, x: number, fontSize: number = 12, style: string = 'normal') => {
      checkPageBreak(lineHeight + 5);
      doc.setFont('helvetica', style);
      doc.setFontSize(fontSize);
      doc.text(text, x, y);
      y += lineHeight + 2;
    };

    // Helper to add a section
    const addSection = (title: string, items: string[]) => {
      checkPageBreak(30 + items.length * lineHeight);
      
      // Section title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(title, margin, y);
      y += lineHeight + 3;
      
      // Items
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      items.forEach(item => {
        checkPageBreak(lineHeight + 2);
        doc.text(`• ${item}`, margin + 5, y);
        y += lineHeight;
      });
      y += 5;
    };

    // Title
    const title = profile.parentName
      ? `${profile.parentName}'s Education Plan`
      : 'Your Education Plan';
    addText(title + (profile.childName ? ` for ${profile.childName}` : ''), margin, 18, 'bold');
    
    addText('Your personalized school recommendations and comprehensive action plan', margin, 12);
    y += 5;

    // Overview
    addText(`${selected.length} Schools Selected | Budget: ${formatBudget(profile.budget)} | Age: ${profile.childAge}`, margin, 12, 'bold');
    y += 5;

    // Selected Schools
    addText('Your Selected Schools:', margin, 16, 'bold');
    selectedSchools.forEach((school, i) => {
      checkPageBreak(25);
      addText(`${i + 1}. ${school.name} (${school.grades}) – ${school.location}`, margin + 5, 12);
      addText(`   Tuition: ${typeof school.tuition === 'number' ? `$${school.tuition.toLocaleString()}` : school.tuition}`, margin + 10, 10);
      addText(`   Deadline: ${school.applicationDeadline}`, margin + 10, 10);
      y += 3;
    });

    // Action Plan Sections
    addSection('Immediate Actions (This Week)', [
      'Mark all application deadlines in your calendar with reminders',
      'Start researching each selected school thoroughly',
      'Create a spreadsheet to track application requirements',
      'Research info sessions and book school tours'
    ]);

    addSection('Short-term Planning (1-3 Months)', [
      'Book tours at your selected schools (many require advance booking)',
      'Attend virtual or in-person information nights',
      'Request transcripts and report cards from current school',
      'Identify and contact potential references',
      ...(profile.childAge >= 12 ? ['Register for SSAT if applying to competitive private schools'] : ['Gather documentation (birth certificates, immunization records)'])
    ]);

    addSection('Medium-term Strategy (3-6 Months)', [
      'Focus on strengthening weak subject areas',
      'Practice interview questions and help articulate interests',
      'Research scholarship and bursary opportunities',
      'Calculate total costs including uniforms and activities',
      'Document achievements, awards, and extracurricular activities'
    ]);

    addSection('Long-term Success Strategy', [
      'Apply to safety schools that you would be happy with',
      'Stay updated on school policy changes and new programs',
      'Connect with other families going through the process',
      'Build relationships that will support your family\'s journey',
      'Plan for transitions and adjustment periods'
    ]);

    // Add footer
    checkPageBreak(20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Vancouver Education Decision Tool • Always verify details with schools directly', margin, y);

    // Download
    const filename = `${(profile.parentName || 'education').toLowerCase().replace(/\s+/g, '-')}-plan.pdf`;
    doc.save(filename);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
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
          <div className="space-y-6">
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

            {/* Beta Disclaimer */}
            <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center text-lg">
                  <Info className="w-5 h-5 mr-2" />
                  Beta Version Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="space-y-3 text-sm">
                  <p className="font-medium">
                    This tool is currently in beta and may not be comprehensive.
                  </p>
                  <p>
                    Our current focus includes <strong>independent schools, private schools, mini schools, and programs similar to mini schools</strong> in the Vancouver area.
                  </p>
                  <p>
                    While we strive for accuracy, this tool should be used as a starting point for your research. Always verify current details, application requirements, and deadlines directly with schools.
                  </p>
                  <p className="text-xs mt-4 border-t border-blue-300 pt-3">
                    We're continuously working to expand our database and improve the tool's comprehensiveness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 years</span>
                  <span>18 years</span>
                </div>
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
                    <SelectItem value="Maple Ridge">Maple Ridge</SelectItem>
                    <SelectItem value="New Westminster">New Westminster</SelectItem>
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Free</span>
                  <span>$50,000/yr</span>
                </div>
              </div>

              {/* Priorities section moved here */}
              <div>
                <Label className="text-base font-medium">What matters most to you?</Label>
                <p className="text-sm text-gray-600 mb-3">Select your top priorities (optional)</p>
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
                    'Character Development',
                    'Innovation',
                    'Outdoor Education',
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

        {/* Step 2: Discovery - simplified to just school selection */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schools matching your criteria</CardTitle>
                <CardDescription>
                  Select up to 5 schools that interest you ({selected.length}/5)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSchools.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No schools match your current criteria.</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your budget, location, or age range to see more options.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredSchools.map((school) => (
                      <div
                        key={school.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selected.includes(school.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${selected.length >= 5 && !selected.includes(school.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (selected.length < 5 || selected.includes(school.id)) {
                            toggleSchool(school.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{school.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {school.type}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  school.competitiveness === 'Extremely High' ? 'border-red-500 text-red-700' :
                                  school.competitiveness === 'Very High' ? 'border-orange-500 text-orange-700' :
                                  school.competitiveness === 'High' ? 'border-yellow-500 text-yellow-700' :
                                  'border-green-500 text-green-700'
                                }`}
                              >
                                 {school.competitiveness === 'Extremely High' ? 'Extremely High Competition' :
                                 school.competitiveness === 'Very High' ? 'Very High Competition' :
                                 school.competitiveness === 'High' ? 'High Competition' :
                                 school.competitiveness === 'Moderate' ? 'Moderate Competition' :
                                 'Low Competition'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{school.grades}</p>
                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{school.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            {school.specialty && school.specialty.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {school.specialty.slice(0, 3).map((spec, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                  {school.specialty.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{school.specialty.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <Checkbox
                            checked={selected.includes(school.id)}
                            disabled={selected.length >= 5 && !selected.includes(school.id)}
                            onChange={() => {
                              if (selected.length < 5 || selected.includes(school.id)) {
                                toggleSchool(school.id);
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {index + 1}. {school.name}
                        </h3>
                        <Badge variant="outline">{school.type}</Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            school.competitiveness === 'Extremely High' ? 'border-red-500 text-red-700' :
                            school.competitiveness === 'Very High' ? 'border-orange-500 text-orange-700' :
                            school.competitiveness === 'High' ? 'border-yellow-500 text-yellow-700' :
                            'border-green-500 text-green-700'
                          }`}
                        >
                          {school.competitiveness}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{school.grades}</p>
                      <p className="text-sm text-gray-700 mb-3">{school.description}</p>
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
                      {school.specialty && school.specialty.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {school.specialty.map((spec, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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
            {selectedSchools.some(school => school.competitiveness === 'Very High' || school.competitiveness === 'Extremely High') && (
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
            {selectedSchools.some(school => school.type === 'Private' || school.type === 'IB Program' || school.type === 'Independent') && (
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
                        <div className="font-medium">Prep Academy Tutors</div>
                        <div>In-home and online tutoring, certified teachers, all grades</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">StudyPug Learning</div>
                        <div>Online platform founded in Vancouver, math and science focus</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">TUEX Education</div>
                        <div>Math, Science, English tutoring, background-checked tutors</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Plan Cards */}
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

                {profile.childAge >= 12 && selectedSchools.some(s => s.ssatRequired) && (
                  <div>
                    <h4 className="font-medium mb-2">Test Preparation (Required for Selected Schools)</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Register for SSAT - required for some of your selected schools</li>
                      <li>• Consider test prep courses or tutoring (KEY Education, Prep Academy)</li>
                      <li>• Schedule practice tests and review sessions</li>
                      <li>• Plan test dates allowing time for retakes if needed</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

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
