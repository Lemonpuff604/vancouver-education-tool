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

  const formatBudget = (budget) => {
    if (budget === 0) return 'Public schools only (Free)';
    return `Up to $${budget.toLocaleString()}/year`;
  };

  const filteredSchools = schools.filter(school => {
    const appropriateLevels = getAppropriateSchoolLevels(profile.childAge);
    if (!appropriateLevels.includes(school.level)) return false;
    if (profile.location !== 'Flexible') {
      const schoolLocation = school.location.toLowerCase();
      const selectedLocation = profile.location.toLowerCase();
      if (!schoolLocation.includes(selectedLocation)) {
        return false;
      }
    }
    if (profile.priorities.length > 0) {
      const hasMatchingPriority = profile.priorities.some(priority => {
        const priorityLower = priority.toLowerCase();
        return (
          school.specialty.some(spec => spec.toLowerCase().includes(priorityLower)) ||
          school.features.some(feature => feature.toLowerCase().includes(priorityLower)) ||
          school.description.toLowerCase().includes(priorityLower)
        );
      });
      if (!hasMatchingPriority) return false;
    }
    if (profile.budget === 0 && school.tuition !== 'Free') return false;
    if (profile.budget > 0 && school.tuition === 'Free') return true;
    if (profile.budget > 0 && typeof school.tuition === 'number') {
      if (school.tuition > profile.budget) return false;
    }
    return true;
  });

  const downloadPlan = () => {
    // unchanged
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* UI content unchanged, update component styles */}
    </div>
  );
}
