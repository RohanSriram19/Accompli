'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, TrendingUp, Lightbulb } from 'lucide-react'
import { ResearchAwareAIAssistant } from '@/components/research-aware-ai-assistant'
import { researchKnowledgeService } from '@/lib/research-knowledge-service'

export default function AIResearchPage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Sample student data for demonstration
  const sampleStudents = [
    {
      name: "Alex Johnson",
      disability: "Autism Spectrum Disorder",
      gradeLevel: "3rd Grade",
      strengths: ["Visual processing", "Pattern recognition", "Technology skills"],
      needs: ["Social communication", "Flexible thinking", "Sensory regulation"],
      iep: {
        goals: [
          { goal: "Improve social communication skills", area: "Communication", progress: 65 },
          { goal: "Increase flexible thinking", area: "Cognitive", progress: 45 }
        ],
        accommodations: ["Visual supports", "Movement breaks", "Sensory tools"]
      }
    },
    {
      name: "Maria Rodriguez",
      disability: "ADHD",
      gradeLevel: "5th Grade",
      strengths: ["Creative thinking", "Verbal skills", "Leadership"],
      needs: ["Sustained attention", "Organization", "Impulse control"],
      iep: {
        goals: [
          { goal: "Improve sustained attention to task", area: "Executive Function", progress: 78 },
          { goal: "Develop organizational skills", area: "Academic", progress: 56 }
        ],
        accommodations: ["Extended time", "Movement breaks", "Graphic organizers"]
      }
    }
  ]

  const researchDashboard = researchKnowledgeService.getResearchDashboard()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Research-Aware AI Assistant
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          AI-powered special education support enhanced with evidence-based practices from publicly available research databases, peer-reviewed studies, and educational clearinghouses.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Research Dashboard</TabsTrigger>
          <TabsTrigger value="interventions">Evidence-Based Interventions</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="students">Student Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Strong Evidence</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{researchDashboard.strongEvidence.length}</div>
                <p className="text-xs text-muted-foreground">
                  Interventions with strong research support
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Effectiveness</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{researchDashboard.topInterventions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Interventions with 80%+ effectiveness
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Implementation Guides</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{researchDashboard.implementationGuides.length}</div>
                <p className="text-xs text-muted-foreground">
                  Step-by-step implementation guides
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Research Sources</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8+</div>
                <p className="text-xs text-muted-foreground">
                  Peer-reviewed databases and clearinghouses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Research Knowledge Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Federal Databases</h4>
                  <ul className="text-sm space-y-1">
                    <li>• What Works Clearinghouse (IES)</li>
                    <li>• National Center on Intensive Intervention</li>
                    <li>• IRIS Center (Vanderbilt University)</li>
                    <li>• National Technical Assistance Center</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Research Organizations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Cochrane Systematic Reviews</li>
                    <li>• Council for Exceptional Children</li>
                    <li>• National Professional Development Center</li>
                    <li>• Learning Disabilities Association</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <div className="grid gap-4">
            {researchDashboard.strongEvidence.map((intervention, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{intervention.intervention}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="default">{intervention.evidenceLevel} evidence</Badge>
                      <Badge variant="outline">{Math.round(intervention.effectiveness * 100)}% effective</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{intervention.summary}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Best for: </span>
                      <span className="text-sm">{intervention.population.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Conditions: </span>
                      <span className="text-sm">{intervention.conditions.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Source: </span>
                      <span className="text-sm text-blue-600">{intervention.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-6">
          <ResearchAwareAIAssistant 
            studentData={selectedStudent} 
            className="max-w-4xl mx-auto"
          />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Student for Research-Informed Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleStudents.map((student, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.name === student.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <h4 className="font-semibold">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.disability} • {student.gradeLevel}</p>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">Current IEP Goals:</div>
                        <div className="text-sm">
                          {student.iep.goals.map(goal => goal.goal).join(', ')}
                        </div>
                      </div>
                      {selectedStudent?.name === student.name && (
                        <div className="mt-3">
                          <Badge variant="default">Selected for AI Assistant</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Evidence-Based Interventions for {selectedStudent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchKnowledgeService
                    .getInterventionsForCondition(selectedStudent.disability)
                    .slice(0, 3)
                    .map((intervention, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{intervention.intervention}</h4>
                          <Badge variant="outline">
                            {Math.round(intervention.effectiveness * 100)}% effective
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{intervention.summary}</p>
                        <div className="text-xs text-blue-600">
                          Source: {intervention.source}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
