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

  const formatBudget = (b: number) =>
    b === 0 ? 'Public only (Free)' : `Up to $${b.toLocaleString()}/yr`;

  // PDF generation
  const downloadPlan = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Title
    doc.setFont('helvetica', 'bold').setFontSize(18);
    const title = profile.parentName
      ? `${profile.parentName}'s Education Plan`
      : 'Your Education Plan';
    doc.text(title + (profile.childName ? ` for ${profile.childName}` : ''), margin, y);
    y += 30;

    // Subtitle
    doc.setFont('helvetica', 'normal').setFontSize(12);
    doc.text(
      'Your personalized school recommendations and comprehensive action plan',
      margin,
      y
    );
    y += 20;

    // Overview cards text
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(`${selected.length} Schools Selected`, margin, y);
    doc.text(`Budget: ${formatBudget(profile.budget)}`, margin + 200, y);
    doc.text(`Age ${profile.childAge}`, margin + 380, y);
    y += 30;

    // Selected schools list
    doc.setFont('helvetica', 'bold').setFontSize(14);
    doc.text(
      profile.childName
        ? `${profile.childName}'s Selected Schools`
        : 'Your Selected Schools',
      margin,
      y
    );
    y += 20;
    doc.setFont('helvetica', 'normal').setFontSize(11);

    filteredSchools
      .filter((s) => selected.includes(s.id))
      .forEach((s, i) => {
        doc.text(`${i + 1}. ${s.name} (${s.grades}) – ${s.location}`, margin, y);
        y += 14;
        doc.text(
          `Tuition: ${typeof s.tuition === 'number' ? `$${s.tuition}` : s.tuition}`,
          margin + 10,
          y
        );
        y += 12;
        doc.text(
          `Deadline: ${s.applicationDeadline}`,
          margin + 10,
          y
        );
        y += 20;
      });

    // Action tiers helper
    const drawTier = (color: string, title: string, tasks: string[]) => {
      doc.setFillColor(color + '20').rect(margin, y, 170, 16 + tasks.length * 8, 'F');
      doc.setTextColor(color).setFont('helvetica', 'bold').setFontSize(12);
      doc.text(title, margin + 4, y + 12);
      doc.setTextColor(0).setFont('helvetica', 'normal').setFontSize(10);
      tasks.forEach((t, idx) => doc.text(`• ${t}`, margin + 6, y + 24 + idx * 8));
      y += 16 + tasks.length * 8 + 10;
    };

    drawTier('#dc2626', 'Immediate Actions (This Week)', [
      'Mark critical dates with reminders',
      'Start school research',
      'Create application tracker',
    ]);
    drawTier('#f59e0b', 'Short-term (1–3 Months)', [
      'Book tours & info sessions',
      'Prepare application materials',
      ...(profile.childAge >= 12
        ? ['Register & prep for SSAT']
        : ['Gather transcripts & references']),
    ]);
    drawTier('#3b82f6', 'Medium-term (3–6 Months)', [
      'Focus on academic enrichment',
      'Practice interviews',
      'Plan finances & scholarships',
    ]);
    drawTier('#10b981', 'Long-term Success', [
      'Apply to backup schools',
      'Join community groups',
      'Monitor policy & updates',
    ]);

    const filename =
      (profile.parentName || 'plan').toLowerCase().replace(/\s+/g, '-') +
      '-education-plan.pdf';
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
    </div>
  );
}
