import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Home,
  RefreshCw,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';

// Import comprehensive school data
import { comprehensiveSchools as schools, School, getApplicationTimeline, getPreparationTips, getTutoringRecommendations } from './data/comprehensive-schools';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    parentName: '',
    childName: '',
    childAge: 5,
    budget: 0,
    location: 'Vancouver',
    priorities: [] as string[]
  });
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const steps = ['Welcome', 'Profile', 'Discovery', 'Results'];
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));
  const restart = () => {
    setCurrentStep(0);
    setProfile({ 
      parentName: '', 
      childName: '', 
      childAge: 5, 
      budget: 0, 
      location: 'Vancouver', 
      priorities: [] 
    });
    setSelectedSchools([]);
  };

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

  const togglePriority = (priority) => {
    const current = profile.priorities;
    if (current.includes(priority)) {
      setProfile({...profile, priorities: current.filter(p => p !== priority)});
    } else {
      setProfile({...profile, priorities: [...current, priority]});
    }
  };

  const toggleSchool = (schoolId) => {
    if (selectedSchools.includes(schoolId)) {
      setSelectedSchools(selectedSchools.filter(id => id !== schoolId));
    } else if (selectedSchools.length < 5) {
      setSelectedSchools([...selectedSchools, schoolId]);
    }
  };

  // Helper function to determine appropriate school levels based on child's age
  const getAppropriateSchoolLevels = (age: number): string[] => {
    if (age >= 2 && age <= 5) {
      return ['preschool', 'k12'];
    } else if (age >= 6 && age <= 11) {
      return ['elementary', 'k12'];
    } else if (age >= 12 && age <= 14) {
      return ['middle', 'k12'];
    } else if (age >= 15 && age <= 18) {
      return ['high', 'k12'];
    } else {
      return ['preschool', 'elementary', 'middle', 'high', 'k12'];
    }
  };

  const filteredSchools = schools.filter(school => {
    // Filter by age/grade level appropriateness
    const appropriateLevels = getAppropriateSchoolLevels(profile.childAge);
    if (!appropriateLevels.includes(school.level)) return false;
    
    // Filter by location (unless "Flexible" is selected)
    if (profile.location !== 'Flexible') {
      const schoolLocation = school.location.toLowerCase();
      const selectedLocation = profile.location.toLowerCase();
      
      // Simple location matching - school location should contain selected location
      if (!schoolLocation.includes(selectedLocation)) {
        return false;
      }
    }
    
    // Filter by educational priorities (if any are selected)
    if (profile.priorities.length > 0) {
      const hasMatchingPriority = profile.priorities.some(priority => {
        const priorityLower = priority.toLowerCase();
        
        // Check against specialties
        const matchesSpecialty = school.specialty.some(spec => {
          const specLower = spec.toLowerCase();
          return specLower.includes(priorityLower) || 
                 priorityLower.includes(specLower) ||
                 (priorityLower === 'academic excellence' && (specLower.includes('academic') || specLower.includes('excellence') || specLower.includes('gifted'))) ||
                 (priorityLower === 'arts & creativity' && (specLower.includes('arts') || specLower.includes('creative') || specLower.includes('music') || specLower.includes('drama'))) ||
                 (priorityLower === 'small class sizes' && specLower.includes('small')) ||
                 (priorityLower === 'language learning' && (specLower.includes('language') || specLower.includes('bilingual') || specLower.includes('immersion') || specLower.includes('french') || specLower.includes('mandarin'))) ||
                 (priorityLower === 'gifted programs' && specLower.includes('gifted')) ||
                 (priorityLower === 'technology focus' && (specLower.includes('technology') || specLower.includes('stem') || specLower.includes('science'))) ||
                 (priorityLower === 'outdoor education' && (specLower.includes('outdoor') || specLower.includes('nature') || specLower.includes('environmental'))) ||
                 (priorityLower === 'strong community' && (specLower.includes('community') || specLower.includes('character') || specLower.includes('values')));
        });
        
        // Check against features
        const matchesFeature = school.features.some(feature => {
          const featureLower = feature.toLowerCase();
          return featureLower.includes(priorityLower) || 
                 (priorityLower === 'small class sizes' && featureLower.includes('small')) ||
                 (priorityLower === 'academic excellence' && (featureLower.includes('academic') || featureLower.includes('excellence'))) ||
                 (priorityLower === 'arts & creativity' && featureLower.includes('arts'));
        });
        
        // Check against description
        const matchesDescription = school.description.toLowerCase().includes(priorityLower) ||
                                 (priorityLower === 'academic excellence' && school.description.toLowerCase().includes('academic')) ||
                                 (priorityLower === 'arts & creativity' && school.description.toLowerCase().includes('arts')) ||
                                 (priorityLower === 'outdoor education' && school.description.toLowerCase().includes('outdoor'));
        
        return matchesSpecialty || matchesFeature || matchesDescription;
      });
      
      if (!hasMatchingPriority) return false;
    }
    
    // Filter by budget
    if (profile.budget === 0 && school.tuition !== 'Free') return false;
    if (profile.budget > 0 && school.tuition === 'Free') return true;
    if (profile.budget > 0 && typeof school.tuition === 'number') {
      if (school.tuition > profile.budget) return false;
    }
    return true;
  });

  const formatBudget = (budget) => {
    if (budget === 0) return 'Public schools only (Free)';
    return `Up to $${budget.toLocaleString()}/year`;
  };

const downloadPlan = () => {
    const selectedSchoolData = schools.filter(s => selectedSchools.includes(s.id));
    
    // Create PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = margin;
    
    // Helper function to add text with word wrap
    const addText = (text: string, fontSize = 10, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (currentY + (lines.length * fontSize * 0.4) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * fontSize * 0.4 + 5;
    };
    
    // Title with personalization
    const title = profile.parentName ? 
      `${profile.parentName.toUpperCase()}'S VANCOUVER EDUCATION PLAN` :
      'VANCOUVER EDUCATION PLAN';
    addText(title, 20, true);
    
    if (profile.childName) {
      addText(`For ${profile.childName}`, 14, true);
    }
    
    addText(`Generated: ${new Date().toLocaleDateString()}`, 12);
    currentY += 10;
    
    // Family Profile with names
    addText('FAMILY PROFILE:', 14, true);
    if (profile.parentName) addText(`Parent/Guardian: ${profile.parentName}`);
    if (profile.childName) addText(`Child: ${profile.childName}`);
    addText(`Child Age: ${profile.childAge} years`);
    addText(`Budget: ${formatBudget(profile.budget)}`);
    addText(`Location: ${profile.location}`);
    addText(`Priorities: ${profile.priorities.join(', ')}`);
    currentY += 10;
    
    // Selected Schools
    addText('SELECTED SCHOOLS:', 14, true);
    selectedSchoolData.forEach((school, index) => {
      addText(`${index + 1}. ${school.name}`, 12, true);
      addText(`   Type: ${school.type}`);
      addText(`   Location: ${school.location}`);
      addText(`   Grades: ${school.grades}`);
      addText(`   Tuition: ${typeof school.tuition === 'number' ? `$${school.tuition.toLocaleString()}/year` : school.tuition}`);
      addText(`   Specialties: ${school.specialty.join(', ')}`);
      addText(`   Application Deadline: ${school.applicationDeadline}`);
      addText(`   Description: ${school.description}`);
      currentY += 5;
    });
    
    currentY += 10;
    
    // Next Steps
    addText('NEXT STEPS:', 14, true);
    addText('1. Visit selected schools and attend information sessions');
    addText('2. Prepare application materials (transcripts, essays, references)');
    addText('3. Mark application deadlines on your calendar');
    addText('4. Register for any required entrance tests');
    addText('5. Continue monitoring your child\'s academic progress');
    addText('6. Prepare for interviews if required');
    
    currentY += 10;
    addText('Generated by Vancouver Education Decision Tool', 8);
    
    // Save with personalized filename
    const filename = profile.parentName ? 
      `${profile.parentName.toLowerCase().replace(/\s+/g, '-')}-education-plan.pdf` :
      'vancouver-education-plan.pdf';
    pdf.save(filename);
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold">Vancouver Education Tool</h1>
            </div>
            {currentStep > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length - 1}
                </span>
                <Progress value={progressPercentage} className="w-32" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Step */}
        {currentStep === 0 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Vancouver Education Decision Tool
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find the perfect school for your child. From preschool to high school, 
                we'll help you navigate Vancouver's educational options.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="w-12 h-12 mx-auto text-blue-500" />
                  <CardTitle>100+ Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Public, private, and specialized programs
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 mx-auto text-green-500" />
                  <CardTitle>Personalized Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Find schools that match your family's needs
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Calendar className="w-12 h-12 mx-auto text-purple-500" />
                  <CardTitle>Timeline Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Get deadlines and preparation steps
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={nextStep} size="lg" className="text-lg px-8 py-3">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Profile Step */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Tell Us About Your Family</h2>
              <p className="text-gray-600 mt-2">
                This helps us recommend the best schools for your child
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* NEW FAMILY INFORMATION CARD */}
              <Card>
                <CardHeader>
                  <CardTitle>Family Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Parent/Guardian Name</Label>
                    <Input
                      value={profile.parentName}
                      onChange={(e) => setProfile({...profile, parentName: e.target.value})}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label>Child's Name</Label>
                    <Input
                      value={profile.childName}
                      onChange={(e) => setProfile({...profile, childName: e.target.value})}
                      placeholder="Your child's name"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Child Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Child's Age</Label>
                    <Select value={profile.childAge.toString()} onValueChange={(value) => 
                      setProfile({...profile, childAge: parseInt(value)})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { age: 3, label: "3 years old (Preschool)" },
                          { age: 4, label: "4 years old (Pre-K/JK)" },
                          { age: 5, label: "5 years old (Kindergarten)" },
                          { age: 6, label: "6 years old (Grade 1)" },
                          { age: 7, label: "7 years old (Grade 2)" },
                          { age: 8, label: "8 years old (Grade 3)" },
                          { age: 9, label: "9 years old (Grade 4)" },
                          { age: 10, label: "10 years old (Grade 5)" },
                          { age: 11, label: "11 years old (Grade 6)" },
                          { age: 12, label: "12 years old (Grade 7)" },
                          { age: 13, label: "13 years old (Grade 8)" },
                          { age: 14, label: "14 years old (Grade 9)" },
                          { age: 15, label: "15 years old (Grade 10)" },
                          { age: 16, label: "16 years old (Grade 11)" },
                          { age: 17, label: "17 years old (Grade 12)" }
                        ].map(({ age, label }) => (
                          <SelectItem key={age} value={age.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Select value={profile.location} onValueChange={(value) => 
                      setProfile({...profile, location: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vancouver">Vancouver</SelectItem>
                        <SelectItem value="Burnaby">Burnaby</SelectItem>
                        <SelectItem value="Richmond">Richmond</SelectItem>
                        <SelectItem value="North Vancouver">North Vancouver</SelectItem>
                        <SelectItem value="West Vancouver">West Vancouver</SelectItem>
                        <SelectItem value="Surrey">Surrey</SelectItem>
                        <SelectItem value="New Westminster">New Westminster</SelectItem>
                        <SelectItem value="Maple Ridge">Maple Ridge</SelectItem>
                        <SelectItem value="Flexible">Flexible/Willing to Move</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Annual Education Budget</Label>
                    <div className="space-y-3 mt-2">
                      <Slider
                        value={[profile.budget]}
                        onValueChange={(value) => setProfile({...profile, budget: value[0]})}
                        max={50000}
                        step={2500}
                        className="w-full"
                      />
                      <div className="text-center font-medium">
                        {formatBudget(profile.budget)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Educational Priorities</CardTitle>
                <CardDescription>Select what matters most to your family</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {priorities.map((priority) => (
                    <div
                      key={priority}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        profile.priorities.includes(priority)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => togglePriority(priority)}
                    >
                      <Checkbox checked={profile.priorities.includes(priority)} />
                      <Label className="cursor-pointer text-sm">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={nextStep}>
                Find Schools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

{/* Discovery Step */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Discover Schools</h2>
              <p className="text-gray-600 mt-2">
                Found {filteredSchools.length} schools that match your criteria. 
                Select up to 5 to compare.
              </p>
            </div>

            {selectedSchools.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {selectedSchools.length} school{selectedSchools.length !== 1 ? 's' : ''} selected
                    </span>
                    <Badge variant="secondary">
                      {5 - selectedSchools.length} remaining
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {filteredSchools.map((school) => (
                <Card 
                  key={school.id}
                  className={`cursor-pointer transition-all ${
                    selectedSchools.includes(school.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleSchool(school.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{school.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {school.location} • {school.grades}
                        </CardDescription>
                      </div>
                      <Checkbox checked={selectedSchools.includes(school.id)} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-blue-600 font-medium">
                      {school.specialty.join(', ')}
                    </div>
                    
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {typeof school.tuition === 'number' ? `$${school.tuition.toLocaleString()}/year` : school.tuition}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {school.applicationDeadline}
                        </div>
                      </div>
                      {school.preparationStart && (
                        <div className="text-xs text-orange-600 font-medium">
                          🎯 Start preparing: {school.preparationStart}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {school.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500">
                      Competitiveness: {school.competitiveness}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={selectedSchools.length === 0}
              >
                View Results ({selectedSchools.length})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Results Step */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {profile.parentName ? `${profile.parentName}'s` : 'Your'} Education Plan
                {profile.childName && ` for ${profile.childName}`}
              </h2>
              <p className="text-gray-600 mt-2">
                Your personalized school recommendations and comprehensive action plan
              </p>
            </div>

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
                  <p className="text-sm text-gray-600">
                    Your budget range
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Calendar className="w-12 h-12 mx-auto text-purple-500" />
                  <CardTitle>Age {profile.childAge}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {profile.childAge <= 5 ? 'Early planning advantage' : 
                     profile.childAge <= 11 ? 'Perfect timing for research' : 
                     'Time-sensitive applications'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {profile.childName ? `${profile.childName}'s` : 'Your Child\'s'} Selected Schools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schools.filter(s => selectedSchools.includes(s.id)).map((school, index) => (
                  <div key={school.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{school.name}</h3>
                        <p className="text-gray-600">{school.specialty.join(', ')}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{school.location}</span>
                          <span>{typeof school.tuition === 'number' ? `$${school.tuition.toLocaleString()}/year` : school.tuition}</span>
                          <span>Application Deadline: {school.applicationDeadline}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{school.type}</Badge>
                    </div>
                    {index < selectedSchools.length - 1 && (
                      <hr className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Immediate Action Items */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Immediate Actions (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-700 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mark Critical Dates</p>
                    <p className="text-sm">Add all application deadlines to your calendar with 2-week early reminders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Start School Research</p>
                    <p className="text-sm">Visit websites, download information packages, and sign up for newsletters</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Create Application Tracking System</p>
                    <p className="text-sm">Spreadsheet or folder system to track requirements, deadlines, and progress</p>
                  </div>
                </div>
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
            {schools.filter(s => selectedSchools.includes(s.id)).some(school => school.competitiveness === 'Very High' || school.competitiveness === 'High') && (
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
            {schools.filter(s => selectedSchools.includes(s.id)).some(school => school.type === 'Private' || school.type === 'IB' || school.type === 'Independent') && (
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
