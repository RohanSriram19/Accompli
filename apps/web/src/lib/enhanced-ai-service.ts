// Enhanced AI Service with IEP Learning and Context Awareness

import { iepDataService } from './iep-data-service';
import { researchKnowledgeService } from './research-knowledge-service';

export interface StudentIEPData {
  id: string
  name: string
  grade: string
  disability: string
  iep: {
    goals: Array<{
      id: string
      domain: string
      goalText: string
      progress: number
      targetDate: string
      status: string
    }>
    accommodations: Record<string, string[]>
    services: Record<string, string>
    strengths: string[]
    needs: string[]
    presentLevels: string
  }
  recentBehaviorEvents?: Array<{
    date: string
    type: string
    severity: string
    description: string
    antecedent?: string
    consequence?: string
  }>
  progressData?: Array<{
    goalId: string
    date: string
    progress: number
    notes: string
  }>
}

export interface AIAssistantMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface AIAssistantContext {
  userRole: 'TEACHER' | 'AIDE' | 'ADMIN' | 'PARENT'
  studentData?: StudentIEPData
  conversationType: 'general' | 'iep_goals' | 'lesson_planning' | 'behavior_analysis' | 'report_writing' | 'parent_support' | 'progress_review'
  currentTask?: string
}

class EnhancedAIService {
  private buildIEPContext(studentData: StudentIEPData): string {
    const { name, grade, disability, iep } = studentData
    
    // Get research-based context for this student
    const researchContext = researchKnowledgeService.buildResearchContext(studentData);
    
    let context = `\n\n=== STUDENT IEP CONTEXT ===\n`
    context += `Student: ${name} (Grade ${grade})\n`
    context += `Primary Disability: ${disability}\n\n`
    
    // Present Levels
    if (iep.presentLevels) {
      context += `Present Levels of Performance:\n${iep.presentLevels}\n\n`
    }
    
    // Strengths and Needs
    if (iep.strengths?.length) {
      context += `Student Strengths:\n${iep.strengths.map(s => `• ${s}`).join('\n')}\n\n`
    }
    
    if (iep.needs?.length) {
      context += `Areas of Need:\n${iep.needs.map(n => `• ${n}`).join('\n')}\n\n`
    }
    
    // Current IEP Goals
    if (iep.goals?.length) {
      context += `Current IEP Goals:\n`
      iep.goals.forEach((goal, index) => {
        context += `${index + 1}. ${goal.domain}: ${goal.goalText}\n`
        context += `   Progress: ${goal.progress}% | Status: ${goal.status} | Target: ${goal.targetDate}\n`
      })
      context += '\n'
    }
    
    // Accommodations
    if (Object.keys(iep.accommodations).length) {
      context += `Accommodations:\n`
      Object.entries(iep.accommodations).forEach(([category, items]) => {
        context += `• ${category}: ${items.join(', ')}\n`
      })
      context += '\n'
    }
    
    // Services
    if (Object.keys(iep.services).length) {
      context += `Special Education Services:\n`
      Object.entries(iep.services).forEach(([service, details]) => {
        context += `• ${service}: ${details}\n`
      })
      context += '\n'
    }
    
    // Recent Progress Data
    if (studentData.progressData?.length) {
      const recentProgress = studentData.progressData
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5) // Last 5 progress updates
      
      context += `Recent Progress Updates:\n`
      recentProgress.forEach(p => {
        const goal = iep.goals.find(g => g.id === p.goalId)
        if (goal) {
          context += `• ${goal.domain}: ${p.progress}% (${p.date}) - ${p.notes}\n`
        }
      })
      context += '\n'
    }
    
    // Behavior Patterns
    if (studentData.recentBehaviorEvents?.length) {
      const recentBehaviors = studentData.recentBehaviorEvents
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3) // Last 3 behavior events
      
      context += `Recent Behavior Events:\n`
      recentBehaviors.forEach(b => {
        context += `• ${b.date}: ${b.type} (${b.severity}) - ${b.description}\n`
        if (b.antecedent) context += `  Antecedent: ${b.antecedent}\n`
        if (b.consequence) context += `  Consequence: ${b.consequence}\n`
      })
      context += '\n'
    }
    
    // Add research-based knowledge context
    context += researchContext;
    
    context += `=== END IEP CONTEXT ===\n\n`
    return context
  }

  private getSystemPrompt(context: AIAssistantContext): string {
    const basePrompt = `You are an AI assistant specialized in special education and IEP (Individual Education Plan) management. You are helping a ${context.userRole.toLowerCase()} in a special education setting.

IMPORTANT: You have access to detailed IEP information for the student. Use this information to provide highly personalized, specific recommendations that align with the student's current goals, accommodations, and progress patterns.

Core Guidelines:
- Always prioritize student privacy and FERPA compliance
- Provide evidence-based, research-backed recommendations
- Use person-first language (e.g., "student with autism" not "autistic student")
- Reference the student's specific IEP goals, accommodations, and services
- Analyze progress patterns to identify trends and areas needing attention
- Consider the student's strengths and use them to address areas of need
- Be supportive and encouraging while maintaining professionalism
- Suggest concrete, measurable, and achievable strategies based on current IEP data

Your expertise includes:
- Analyzing IEP goal progress and suggesting modifications
- Creating data-driven recommendations based on student performance
- Identifying patterns in behavior data and progress tracking
- Suggesting accommodations and modifications based on student needs
- Developing strategies that leverage student strengths
- Aligning interventions with current IEP goals and services`

    let specificPrompt = ''
    
    switch (context.conversationType) {
      case 'iep_goals':
        specificPrompt = `\n\nCurrent Focus: IEP Goal Analysis and Development
- Review current goal progress and identify areas for improvement
- Suggest modifications to underperforming goals
- Recommend new goals based on emerging needs or mastered skills
- Provide specific intervention strategies for each goal domain
- Analyze goal data trends and suggest adjustments to instruction`
        break
        
      case 'lesson_planning':
        specificPrompt = `\n\nCurrent Focus: IEP-Aligned Lesson Planning
- Create lesson plans that directly target the student's IEP goals
- Incorporate the student's accommodations and modifications
- Build on documented strengths while addressing areas of need
- Suggest activities that align with current service providers
- Include data collection methods that match IEP goal measurements`
        break
        
      case 'behavior_analysis':
        specificPrompt = `\n\nCurrent Focus: Behavior Analysis with IEP Context
- Analyze behavior patterns in relation to IEP goals and services
- Consider environmental factors and accommodations in behavior analysis
- Suggest interventions that support IEP goal achievement
- Look for connections between behavior events and academic progress
- Recommend behavior supports that align with current IEP services`
        break
        
      case 'progress_review':
        specificPrompt = `\n\nCurrent Focus: IEP Progress Review and Analysis
- Analyze progress data trends across all goal domains
- Identify goals that may need modification or replacement
- Suggest evidence-based interventions for underperforming areas
- Highlight successful strategies that should be continued
- Recommend adjustments to services or accommodations based on progress`
        break
        
      case 'report_writing':
        specificPrompt = `\n\nCurrent Focus: Data-Driven Report Writing
- Help write progress reports using specific IEP data and observations
- Provide objective summaries of goal progress with supporting evidence
- Suggest areas for IEP team discussion based on current data
- Help translate data into meaningful insights for parents and team members
- Ensure reports align with IEP requirements and timelines`
        break
        
      default:
        specificPrompt = `\n\nI have access to detailed IEP information and can help with any aspect of special education support. I can analyze progress data, suggest interventions, help with lesson planning, or answer questions about the student's program.`
    }
    
    return basePrompt + specificPrompt
  }

  private async analyzeStudentProgress(studentData: StudentIEPData): Promise<string> {
    const { iep, progressData } = studentData
    let analysis = "\n=== AUTOMATED PROGRESS ANALYSIS ===\n"
    
    if (!progressData?.length) {
      analysis += "No recent progress data available for analysis.\n"
      return analysis
    }
    
    // Analyze each goal's progress trend
    iep.goals.forEach(goal => {
      const goalProgress = progressData
        .filter(p => p.goalId === goal.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      if (goalProgress.length >= 2) {
        const firstProgress = goalProgress[0].progress
        const lastProgress = goalProgress[goalProgress.length - 1].progress
        const trend = lastProgress - firstProgress
        
        analysis += `\n${goal.domain} Goal Analysis:\n`
        analysis += `• Current Progress: ${goal.progress}%\n`
        analysis += `• Trend: ${trend > 0 ? '+' : ''}${trend}% over ${goalProgress.length} data points\n`
        
        if (trend > 10) {
          analysis += "• Status: Strong positive trend ✅\n"
        } else if (trend > 0) {
          analysis += "• Status: Slow but steady progress 📈\n"
        } else if (trend === 0) {
          analysis += "• Status: Progress has plateaued ⚠️\n"
        } else {
          analysis += "• Status: Declining performance - needs intervention ⚠️\n"
        }
        
        // Recent notes analysis
        const recentNotes = goalProgress.slice(-2).map(p => p.notes).filter(Boolean)
        if (recentNotes.length) {
          analysis += `• Recent Observations: ${recentNotes.join('; ')}\n`
        }
      }
    })
    
    analysis += "\n=== END ANALYSIS ===\n\n"
    return analysis
  }

  async chat(
    messages: AIAssistantMessage[],
    context: AIAssistantContext
  ): Promise<string> {
    try {
      // Build comprehensive context string
      let fullContext = this.getSystemPrompt(context)
      
      // Add IEP-specific context if student data is available
      if (context.studentData) {
        fullContext += this.buildIEPContext(context.studentData)
        
        // Add automated progress analysis
        if (context.conversationType === 'progress_review' || context.conversationType === 'iep_goals') {
          fullContext += await this.analyzeStudentProgress(context.studentData)
        }
      }
      
      // Add current task context if provided
      if (context.currentTask) {
        fullContext += `\nCurrent Task: ${context.currentTask}\n`
      }
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          messages: [
            { role: 'system', content: fullContext },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          context
        })
      })

      if (!response.ok) {
        throw new Error(`AI API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return data.message || 'I apologize, but I encountered an error processing your request.'
    } catch (error) {
      console.error('AI Service Error:', error)
      return 'I apologize, but I encountered an error processing your request. Please try again.'
    }
  }

  async generateIEPRecommendations(studentData: StudentIEPData): Promise<{
    goalRecommendations: string[]
    accommodationSuggestions: string[]
    interventionStrategies: string[]
    progressConcerns: string[]
  }> {
    const prompt = `Based on the student's IEP data and progress, provide specific recommendations in the following categories:

1. Goal Recommendations (modifications, new goals, or goal updates)
2. Accommodation Suggestions (new or modified accommodations)
3. Intervention Strategies (specific teaching strategies)
4. Progress Concerns (areas needing immediate attention)

Please provide 3-5 specific, actionable recommendations for each category.`

    const response = await this.chat([
      { role: 'user', content: prompt }
    ], {
      userRole: 'TEACHER',
      studentData,
      conversationType: 'iep_goals'
    })

    // Parse the response into categories (this would need more sophisticated parsing in real implementation)
    return {
      goalRecommendations: [response.substring(0, 200)], // Simplified for demo
      accommodationSuggestions: [],
      interventionStrategies: [],
      progressConcerns: []
    }
  }

  async analyzeBehaviorPatterns(studentData: StudentIEPData): Promise<string> {
    if (!studentData.recentBehaviorEvents?.length) {
      return "No recent behavior data available for analysis."
    }

    const prompt = `Analyze the behavior patterns for this student and provide:
1. Identified patterns or triggers
2. Connection to IEP goals and academic performance
3. Recommended interventions
4. Environmental modifications
5. Data collection suggestions`

    return await this.chat([
      { role: 'user', content: prompt }
    ], {
      userRole: 'TEACHER',
      studentData,
      conversationType: 'behavior_analysis'
    })
  }

  async generateProgressReport(studentData: StudentIEPData): Promise<string> {
    const prompt = `Generate a comprehensive progress report for this student including:
1. Overall IEP goal progress summary
2. Specific achievements and growth areas
3. Areas of concern or recommendations
4. Suggested next steps for the IEP team
5. Parent-friendly summary of progress

Use the specific progress data and behavior information provided.`

    return await this.chat([
      { role: 'user', content: prompt }
    ], {
      userRole: 'TEACHER',
      studentData,
      conversationType: 'report_writing'
    })
  }
}

export const aiService = new EnhancedAIService()
export default aiService
