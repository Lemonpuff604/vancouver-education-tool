import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

export default function App() {
  const [step, setStep] = useState(0);
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('5');
  const [location, setLocation] = useState('Vancouver');
  const [budget, setBudget] = useState(0);
  const [priorities, setPriorities] = useState<string[]>([]);

  const priorityOptions = [
    'Academic Excellence', 'Arts & Creativity', 'Small Class Sizes',
    'Language Learning', 'Gifted Programs', 'Technology Focus',
    'Outdoor Education', 'Strong Community'
  ];

  const togglePriority = (priority: string) => {
    setPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const formatBudget = (val: number) =>
    val === 0 ? 'Public schools only (Free)' : `Up to $${val.toLocaleString()}/year`;

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Vancouver Education Decision Tool</h1>

        {step === 0 && (
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Find the perfect school for your child — based on your family's values, priorities, and budget.
            </p>
            <Button className="btn-primary px-6 py-3" onClick={() => setStep(1)}>Get Started</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Parent/Guardian Name</Label>
                  <Input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label>Child's Name</Label>
                  <Input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Your child's name" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Child Info & Budget</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Child's Age</Label>
                  <Select value={childAge} onValueChange={setChildAge}>
                    <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
                    <SelectContent>
                      {[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} years old</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent>
                      {["Vancouver", "Burnaby", "Richmond", "North Vancouver", "West Vancouver", "Surrey", "New Westminster", "Flexible"]
                        .map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider value={[budget]} onValueChange={([val]) => setBudget(val)} max={50000} step={2500} />
                <p className="text-sm text-center mt-2 font-medium">{formatBudget(budget)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Priorities</CardTitle>
                <CardDescription>Select what matters most</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {priorityOptions.map(priority => (
                  <div
                    key={priority}
                    className={`flex items-center space-x-2 p-2 rounded border ${priorities.includes(priority) ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => togglePriority(priority)}
                  >
                    <Checkbox checked={priorities.includes(priority)} readOnly />
                    <span className="text-sm font-medium">{priority}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Coming soon!</h2>
            <p className="text-gray-500">Results and school matches will be shown here.</p>
            <Button className="mt-6" onClick={() => setStep(1)}>Go Back</Button>
          </div>
        )}
      </div>
    </div>
  );
}
