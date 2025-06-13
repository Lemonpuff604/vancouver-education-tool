import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  comprehensiveSchools as schools,
  School
} from './data/comprehensive-schools';
import {
  Clock,
  FileText,
  Calendar,
  AlertCircle,
  BookOpen,
  Download,
  RefreshCw,
  MapPin
} from 'lucide-react';

export default function App() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    parentName: '',
    childName: '',
    childAge: 6,
    location: 'Flexible',
    priorities: [] as string[],
    budget: 0
  });
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const toggleSchool = (id: string) =>
    setSelectedSchools(s =>
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    );

  // ─── Helpers: Levels & Keywords & Formatting ──────────────────────────────
  const getAppropriateSchoolLevels = (age: number): string[] => {
    if (age >= 2 && age <= 5) return ['preschool', 'k12'];
    if (age >= 6 && age <= 11) return ['elementary', 'k12'];
    if (age >= 12 && age <= 14) return ['middle', 'k12'];
    if (age >= 15 && age <= 18) return ['high', 'k12'];
    return ['preschool', 'elementary', 'middle', 'high', 'k12'];
  };

  const priorityKeywords: Record<string, string[]> = {
    'academic excellence': ['academic', 'excellence', 'gifted'],
    'arts & creativity': ['arts', 'music', 'drama', 'creative'],
    'small class sizes': ['small class', 'small'],
    'language learning': [
      'language',
      'french',
      'mandarin',
      'bilingual',
      'immersion'
    ],
    'gifted programs': ['gifted'],
    'technology focus': ['stem', 'science', 'technology'],
    'outdoor education': ['outdoor', 'nature', 'environment'],
    'strong community': ['community', 'character', 'values']
  };

  const formatBudget = (b: number) =>
    b === 0 ? 'Free / Public only' : `$${b.toLocaleString()}/year`;

  // ─── Filter Logic ─────────────────────────────────────────────────────────
  const filteredSchools = schools.filter(school => {
    // 1) Age / Level
    const levels = getAppropriateSchoolLevels(profile.childAge);
    if (!levels.includes(school.level)) return false;

    // 2) Location
    if (
      profile.location !== 'Flexible' &&
      !school.location
        .toLowerCase()
        .includes(profile.location.toLowerCase())
    )
      return false;

    // 3) Educational Priorities
    if (profile.priorities.length > 0) {
      const blob = [
        ...school.specialty,
        ...school.features,
        school.description
      ]
        .join(' ')
        .toLowerCase();
      const hasPriority = profile.priorities.some(prio => {
        const kws =
          priorityKeywords[prio.toLowerCase()] || [
            prio.toLowerCase()
          ];
        return kws.some(kw => blob.includes(kw));
      });
      if (!hasPriority) return false;
    }

    // 4) Budget
    if (profile.budget === 0) {
      if (school.tuition !== 'Free') return false;
    } else {
      const tuitionValue =
        typeof school.tuition === 'number'
          ? school.tuition
          : school.tuition === 'Free'
          ? 0
          : parseInt(
              school.tuition.replace(/[^0-9]/g, ''),
              10
            );
      if (tuitionValue > profile.budget) return false;
    }

    return true;
  });

  // ─── PDF Helpers ──────────────────────────────────────────────────────────
  // Convert hex → [r,g,b]
  function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(s => s + s)
        .join('');
    }
    const bigint = parseInt(hex, 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ];
  }

  // Draw a colored, underlined section header
  const addSectionHeader = (
    pdf: jsPDF,
    title: string,
    margin: number,
    currentY: number,
    headerRgb: [number, number, number],
    textRgb: [number, number, number]
  ): number => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(...headerRgb);
    pdf.text(title, margin, currentY);
    const w = pdf.getTextWidth(title);
    pdf.setDrawColor(...headerRgb);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY + 2, margin + w, currentY + 2);
    let newY = currentY + 8;
    pdf.setTextColor(...textRgb);
    pdf.setFont('helvetica', 'normal');
    return newY;
  };

  // Draw a bold label + normal value on one line
  const addLabeledLine = (
    pdf: jsPDF,
    label: string,
    value: string,
    margin: number,
    currentY: number,
    textRgb: [number, number, number]
  ): number => {
    pdf.setTextColor(...textRgb);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, currentY);
    pdf.setFont('helvetica', 'normal');
    const xOff = pdf.getTextWidth(label);
    pdf.text(` ${value}`, margin + xOff, currentY);
    const lineH = pdf.internal.getLineHeightFactor() * 10;
    return currentY + lineH + 2;
  };

  // ─── PDF Generation ────────────────────────────────────────────────────────
  const generatePDF = () => {
    // 1) Read your DaisyUI CSS vars
    const root = getComputedStyle(
      document.documentElement
    );
    const primaryHex = root
      .getPropertyValue('--color-primary')
      .trim();
    const neutralHex = root
      .getPropertyValue('--color-base-content')
      .trim();
    const headerRgb = hexToRgb(primaryHex);
    const textRgb = hexToRgb(neutralHex);

    // 2) Init jsPDF
    const pdf = new jsPDF();
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;
    let page = 1;

    // Footer helper
    const addFooter = () => {
      pdf.setFontSize(8);
      pdf.setTextColor(...textRgb);
      pdf.text(
        `Page ${page}`,
        pageW - margin,
        pageH - 10,
        { align: 'right' }
      );
      page++;
    };

    // 3) Title
    currentY = addSectionHeader(
      pdf,
      profile.parentName
        ? `${profile.parentName.toUpperCase()}'S EDUCATION PLAN`
        : 'EDUCATION PLAN',
      margin,
      currentY,
      headerRgb,
      textRgb
    );

    // 4) Family Profile
    currentY = addSectionHeader(
      pdf,
      'FAMILY PROFILE',
      margin,
      currentY,
      headerRgb,
      textRgb
    );
    currentY = addLabeledLine(
      pdf,
      'Parent/Guardian:',
      profile.parentName || '—',
      margin,
      currentY,
      textRgb
    );
    currentY = addLabeledLine(
      pdf,
      'Child:',
      profile.childName || '—',
      margin,
      currentY,
      textRgb
    );
    currentY = addLabeledLine(
      pdf,
      'Age:',
      `${profile.childAge} years`,
      margin,
      currentY,
      textRgb
    );
    currentY = addLabeledLine(
      pdf,
      'Location:',
      profile.location,
      margin,
      currentY,
      textRgb
    );
    currentY = addLabeledLine(
      pdf,
      'Budget:',
      profile.budget === 0
        ? 'Free only'
        : `$${profile.budget}`,
      margin,
      currentY,
      textRgb
    );

    // 5) Selected Schools Table
    pdf.autoTable({
      startY: currentY,
      head: [['#', 'Name', 'Type', 'Tuition']],
      body: selectedSchools.map((id, i) => {
        const s = schools.find(x => x.id === id)!;
        return [
          i + 1,
          s.name,
          s.type,
          typeof s.tuition === 'number'
            ? `$${s.tuition.toLocaleString()}`
            : s.tuition
        ];
      }),
      theme: 'grid',
      headStyles: { fillColor: headerRgb },
      margin: { left: margin, right: margin }
    });
    currentY =
      (pdf as any).lastAutoTable.finalY + 10;

    // 6) Short-term Strategy
    currentY = addSectionHeader(
      pdf,
      'SCHOOL VISITS & INFORMATION SESSIONS',
      margin,
      currentY,
      headerRgb,
      textRgb
    );
    [
      'Book tours at your selected schools (many require advance booking)',
      'Attend virtual or in-person information nights',
      'Prepare questions about curriculum, class sizes, and school culture',
      'Take notes and photos (if permitted) for later comparison'
    ].forEach(line => {
      const bullet = '• ';
      const wrapped = pdf.splitTextToSize(
        bullet + line,
        pageW - margin * 2
      );
      // Page break check
      const lh =
        pdf.internal.getLineHeightFactor() * 6;
      if (
        currentY + wrapped.length * lh >
        pageH - margin
      ) {
        addFooter();
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(wrapped, margin, currentY);
      currentY += wrapped.length * lh + 2;
    });

    // 7) Application Preparation
    currentY = addSectionHeader(
      pdf,
      'APPLICATION PREPARATION',
      margin,
      currentY,
      headerRgb,
      textRgb
    );
    [
      'Request transcripts and report cards from current school',
      'Identify and contact potential references (teachers, coaches, mentors)',
      'Begin drafting personal statements or essays if required',
      'Gather documentation (birth certificates, immunization records)'
    ].forEach(line => {
      const bullet = '• ';
      const wrapped = pdf.splitTextToSize(
        bullet + line,
        pageW - margin * 2
      );
      const lh =
        pdf.internal.getLineHeightFactor() * 6;
      if (
        currentY + wrapped.length * lh >
        pageH - margin
      ) {
        addFooter();
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(wrapped, margin, currentY);
      currentY += wrapped.length * lh + 2;
    });

    // 8) Test Prep if age ≥12
    if (profile.childAge >= 12) {
      currentY = addSectionHeader(
        pdf,
        'TEST PREPARATION (IF REQUIRED)',
        margin,
        currentY,
        headerRgb,
        textRgb
      );
      [
        'Register for SSAT if applying to competitive private schools',
        'Consider test prep courses or tutoring (KEY Education, Prep Academy)',
        'Schedule practice tests and review sessions',
        'Plan test dates allowing time for retakes if needed'
      ].forEach(line => {
        const bullet = '• ';
        const wrapped = pdf.splitTextToSize(
          bullet + line,
          pageW - margin * 2
        );
        const lh =
          pdf.internal.getLineHeightFactor() * 6;
        if (
          currentY + wrapped.length * lh >
          pageH - margin
        ) {
          addFooter();
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(wrapped, margin, currentY);
        currentY += wrapped.length * lh + 2;
      });
    }

    // 9) Final footer + save
    addFooter();
    pdf.save(
      profile.parentName
        ? `${profile.parentName
            .toLowerCase()
            .replace(/\s+/g, '-')}-plan.pdf`
        : 'education-plan.pdf'
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto p-6 flex-grow">
        {/* ─── Filter Controls ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label>Parent/Guardian Name</Label>
            <Input
              value={profile.parentName}
              onChange={e =>
                setProfile({
                  ...profile,
                  parentName: e.target.value
                })
              }
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <Label>Child Name</Label>
            <Input
              value={profile.childName}
              onChange={e =>
                setProfile({
                  ...profile,
                  childName: e.target.value
                })
              }
              placeholder="e.g. Ava"
            />
          </div>
          <div>
            <Label>Child Age: {profile.childAge}</Label>
            <Slider
              value={[profile.childAge]}
              min={2}
              max={18}
              step={1}
              onValueChange={val =>
                setProfile({
                  ...profile,
                  childAge: val[0]
                })
              }
            />
          </div>
          <div>
            <Label>Location</Label>
            <Select
              value={profile.location}
              onValueChange={val =>
                setProfile({
                  ...profile,
                  location: val
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Flexible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flexible">
                  Flexible
                </SelectItem>
                {Array.from(
                  new Set(schools.map(s => s.location))
                ).map(loc => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <Label>Priorities</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(priorityKeywords).map(prio => (
                <Checkbox
                  key={prio}
                  checked={profile.priorities.includes(prio)}
                  onCheckedChange={checked => {
                    setProfile({
                      ...profile,
                      priorities: checked
                        ? [...profile.priorities, prio]
                        : profile.priorities.filter(
                            p => p !== prio
                          )
                    });
                  }}
                >
                  {prio}
                </Checkbox>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <Label>Budget: {formatBudget(profile.budget)}</Label>
            <Slider
              value={[profile.budget]}
              min={0}
              max={50000}
              step={500}
              onValueChange={val =>
                setProfile({
                  ...profile,
                  budget: val[0]
                })
              }
            />
          </div>
        </div>

        {/* ─── Download PDF Button ─────────────────────────────────── */}
        <div className="mb-6">
          <Button
            onClick={generatePDF}
            leftIcon={<Download />}
          >
            Download PDF Plan
          </Button>
        </div>

        {/* ─── School Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredSchools.map(school => (
            <Card
              key={school.id}
              onClick={() => toggleSchool(school.id)}
              className={`cursor-pointer ${
                selectedSchools.includes(school.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {school.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {school.location} • {school.grades}
                    </CardDescription>
                  </div>
                  <Badge>
                    {school.level.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {school.description}
                </p>
                <div className="mt-2 text-sm font-medium">
                  Tuition:{' '}
                  {typeof school.tuition === 'number'
                    ? `$${school.tuition.toLocaleString()}`
                    : school.tuition}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Strategy Cards ──────────────────────────────────────── */}
        {selectedSchools.length > 0 && (
          <div className="space-y-6">
            {/* Short-term Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Short-term Strategy (Now → 3 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    School Visits & Information Sessions
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Book tours at your selected schools
                      (many require advance booking)
                    </li>
                    <li>
                      • Attend virtual or in-person
                      information nights
                    </li>
                    <li>
                      • Prepare questions about
                      curriculum, class sizes, and school
                      culture
                    </li>
                    <li>
                      • Take notes and photos (if
                      permitted) for later comparison
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Application Preparation
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Request transcripts and report
                      cards from current school
                    </li>
                    <li>
                      • Identify and contact potential
                      references (teachers, coaches,
                      mentors)
                    </li>
                    <li>
                      • Begin drafting personal
                      statements or essays if required
                    </li>
                    <li>
                      • Gather documentation (birth
                      certificates, immunization records)
                    </li>
                  </ul>
                </div>

                {profile.childAge >= 12 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Test Preparation (If Required)
                    </h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>
                        • Register for SSAT if applying to
                        competitive private schools
                      </li>
                      <li>
                        • Consider test prep courses or
                        tutoring (KEY Education, Prep
                        Academy)
                      </li>
                      <li>
                        • Schedule practice tests and
                        review sessions
                      </li>
                      <li>
                        • Plan test dates allowing time
                        for retakes if needed
                      </li>
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
                  <h4 className="font-medium mb-2">
                    Academic Enhancement
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Focus on strengthening weak
                      subject areas
                    </li>
                    <li>
                      • Consider enrichment programs
                      that align with your priorities
                    </li>
                    <li>
                      • Maintain strong grades and
                      positive teacher relationships
                    </li>
                    <li>
                      • Document achievements, awards,
                      and extracurricular activities
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Interview Preparation
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Practice common interview
                      questions with{' '}
                      {profile.childName || 'your child'}
                    </li>
                    <li>
                      • Help them articulate their
                      interests and goals
                    </li>
                    <li>
                      • Prepare questions they can ask
                      about the school
                    </li>
                    <li>
                      • Plan appropriate interview
                      attire
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Financial Planning
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Research scholarship and
                      bursary opportunities
                    </li>
                    <li>
                      • Calculate total costs including
                      uniforms, supplies, and activities
                    </li>
                    <li>
                      • Plan payment schedules and
                      explore financing options
                    </li>
                    <li>
                      • Consider tax implications and
                      education savings plans
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Long-term Success */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Long-term Success Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    Backup Plans
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Apply to safety schools that
                      you'd be happy with
                    </li>
                    <li>
                      • Research waitlist procedures for
                      competitive schools
                    </li>
                    <li>
                      • Have a plan for gap year or
                      alternative pathways if needed
                    </li>
                    <li>
                      • Consider timing of applications
                      for different entry points
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Ongoing Monitoring
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Stay updated on school policy
                      changes and new programs
                    </li>
                    <li>
                      • Maintain relationships with
                      school admissions offices
                    </li>
                    <li>
                      • Continue developing{' '}
                      {profile.childName || 'your child'}’s
                      interests and talents
                    </li>
                    <li>
                      • Plan for transitions and
                      adjustment periods
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Community Building
                  </h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>
                      • Connect with other families
                      going through the process
                    </li>
                    <li>• Join parent groups and school communities early</li>
                    <li>
                      • Build relationships that will
                      support your family’s journey
                    </li>
                    <li>
                      • Consider volunteering
                      opportunities at prospective
                      schools
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Critical Timeline Alert */}
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
                    {profile.childAge === 11
                      ? 'Grade 6 is crucial for Grade 8 private school applications. Deadlines are typically Dec–Jan.'
                      : profile.childAge === 12
                      ? 'Grade 7 applications are due soon! Focus on completing applications and preparing for interviews.'
                      : 'High school applications require immediate attention. Some deadlines may have passed—check current availability.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Competitive School Tips */}
            {schools
              .filter(s => selectedSchools.includes(s.id))
              .some(s =>
                ['Very High', 'High'].includes(
                  s.competitiveness
                )
              ) && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Preparation Tips for Competitive Schools
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      Start preparation 12–24 months before
                      deadlines
                    </li>
                    <li>
                      Consider SSAT prep tutoring for private
                      schools
                    </li>
                    <li>
                      Build a portfolio showcasing
                      achievements
                    </li>
                    <li>
                      Practice interview skills and
                      assessments
                    </li>
                    <li>
                      Attend multiple school info sessions
                      and tours
                    </li>
                    <li>
                      Maintain excellent academic
                      performance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tutoring Resources */}
            {schools
              .filter(s => selectedSchools.includes(s.id))
              .some(s =>
                ['Private', 'IB', 'Independent'].includes(
                  s.type
                )
              ) && (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Recommended Preparation Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700">
                  <ul className="space-y-3 text-sm">
                    <li>
                      <strong>KEY Education:</strong> SSAT prep,
                      admissions consulting, interview coaching
                    </li>
                    <li>
                      <strong>Aspire Math Academy
                      (W Vancouver):</strong> Entrance coaching,
                      SSAT prep, mock interviews
                    </li>
                    <li>
                      <strong>Test Innovators (Online):</strong>{' '}
                      SSAT practice tests, adaptive learning
                      platform
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Download & Restart */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF Plan
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.location.reload()
                }
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer items-center p-4 bg-base-200 text-base-content">
        <p className="mx-auto">
          Vancouver Education Tool ©{' '}
          {new Date().getFullYear()} • Built with ❤️
        </p>
      </footer>
    </div>
  );
}
