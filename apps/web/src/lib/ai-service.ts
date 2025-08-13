// AI Service using secure API routes (no client-side API key exposure)

export interface AIAssistantMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface AIAssistantContext {
  userRole: 'TEACHER' | 'AIDE' | 'ADMIN'
  studentInfo?: {
    name: string
    grade: string
    disability: string
    currentGoals: string[]
  }
  conversationType: 'general' | 'iep_goals' | 'lesson_planning' | 'behavior_analysis' | 'report_writing'
}

class AIService {
  private getSystemPrompt(context: AIAssistantContext): string {
    const basePrompt = `You are an AI assistant specialized in special education and IEP (Individual Education Plan) management. You are helping a ${context.userRole.toLowerCase()} in a special education setting.

Core Guidelines:
- Always prioritize student privacy and FERPA compliance
- Provide evidence-based, research-backed recommendations
- Use person-first language (e.g., "student with autism" not "autistic student")
- Reference IDEA (Individuals with Disabilities Education Act) requirements when relevant
- Be supportive and encouraging while maintaining professionalism
- Suggest concrete, measurable, and achievable strategies

Your expertise includes:
- IEP goal development and progress monitoring
- Behavior intervention strategies and ABC data analysis
- Differentiated instruction and accommodations
- Transition planning and life skills development
- Assistive technology recommendations
- Data collection and progress reporting`

    switch (context.conversationType) {
      case 'iep_goals':
        return `${basePrompt}

Current Focus: IEP Goal Development
- Help create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Suggest appropriate accommodations and modifications
- Provide guidance on progress monitoring methods
- Ensure goals align with state standards and student needs`

      case 'lesson_planning':
        return `${basePrompt}

Current Focus: Lesson Planning
- Create IEP-aligned lesson plans with clear objectives
- Suggest differentiation strategies for various learning needs
- Provide ideas for hands-on, engaging activities
- Include assessment and data collection methods
- Consider universal design for learning (UDL) principles`

      case 'behavior_analysis':
        return `${basePrompt}

Current Focus: Behavior Analysis and Support
- Analyze ABC (Antecedent-Behavior-Consequence) data patterns
- Suggest positive behavior intervention strategies
- Provide crisis de-escalation techniques
- Recommend environmental modifications
- Help develop behavior intervention plans (BIPs)`

      case 'report_writing':
        return `${basePrompt}

Current Focus: Report Writing and Documentation
- Help write clear, objective progress reports
- Assist with IEP meeting preparation
- Provide templates for data summaries
- Ensure compliance with special education documentation requirements
- Suggest parent-friendly language for communication`

      default:
        return `${basePrompt}

I'm here to help with any special education related questions or tasks. How can I assist you today?`
    }
  }

  async chat(
    messages: AIAssistantMessage[],
    context: AIAssistantContext
  ): Promise<string> {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'API request failed')
      }

      const data = await response.json()
      return data.content || 'I apologize, but I encountered an error processing your request.'
    } catch (error) {
      console.error('AI Service Error:', error)
      if (error instanceof Error && error.message.includes('API key')) {
        return 'Please configure your OpenAI API key to use the AI assistant feature.'
      }
      return 'I apologize, but I encountered an error. Please try again.'
    }
  }

  async generateIEPGoal(studentInfo: {
    name: string
    grade: string
    disability: string
    currentLevel: string
    targetArea: string
    timeframe?: string
  }): Promise<string> {
    try {
      const prompt = `Create a SMART IEP goal for a student with the following information:
      
Student: ${studentInfo.name}
Grade: ${studentInfo.grade}
Disability: ${studentInfo.disability}
Current Performance Level: ${studentInfo.currentLevel}
Target Area: ${studentInfo.targetArea}
Timeframe: ${studentInfo.timeframe || '1 academic year'}

Please provide:
1. A complete SMART goal statement
2. Suggested measurement criteria
3. Recommended frequency of progress monitoring
4. Possible accommodations

Format as a professional IEP goal following IDEA requirements.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateIEPGoal',
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate IEP goal')
      }

      const data = await response.json()
      return data.content || 'Unable to generate IEP goal.'
    } catch (error) {
      console.error('IEP Goal Generation Error:', error)
      return 'Error generating IEP goal. Please try again.'
    }
  }

  async analyzeBehaviorData(behaviorEvents: Array<{
    antecedent: string
    behavior: string
    consequence: string
    date: string
    severity: string
  }>): Promise<string> {
    try {
      const dataString = behaviorEvents.map(event => 
        `Date: ${event.date}, Antecedent: ${event.antecedent}, Behavior: ${event.behavior}, Consequence: ${event.consequence}, Severity: ${event.severity}`
      ).join('\n')

      const prompt = `Analyze the following ABC behavior data and provide insights:

${dataString}

Please provide:
1. Patterns identified in antecedents
2. Function of behavior hypothesis
3. Recommended intervention strategies
4. Environmental modifications to consider
5. Data collection recommendations for next steps`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyzeBehavior',
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze behavior data')
      }

      const data = await response.json()
      return data.content || 'Unable to analyze behavior data.'
    } catch (error) {
      console.error('Behavior Analysis Error:', error)
      return 'Error analyzing behavior data. Please try again.'
    }
  }
}

export const aiService = new AIService()
