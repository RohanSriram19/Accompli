import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client only when needed and API key is available
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

export async function POST(request: NextRequest) {
  let requestData: any = { action: 'chat', messages: [] }
  
  try {
    requestData = await request.json()
    const { messages, context, action } = requestData

    const openai = getOpenAIClient()
    
    if (!openai) {
      // Return a helpful fallback response when API key is not configured
      return NextResponse.json({
        content: getDemoResponse(action, messages[messages.length - 1]?.content || '')
      })
    }

    let systemPrompt = ''
    
    switch (action) {
      case 'chat':
        systemPrompt = getSystemPrompt(context)
        break
      case 'generateIEPGoal':
        systemPrompt = 'You are a special education expert helping to write compliant IEP goals.'
        break
      case 'analyzeBehavior':
        systemPrompt = 'You are a board-certified behavior analyst (BCBA) analyzing behavior data for intervention planning.'
        break
      default:
        systemPrompt = 'You are an AI assistant specialized in special education and IEP management.'
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Using gpt-3.5-turbo which is more widely available
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    return NextResponse.json({
      content: response.choices[0]?.message?.content || 'Unable to process request.'
    })

  } catch (error) {
    console.error('AI API Error:', error)
    // Return a helpful fallback response instead of an error
    return NextResponse.json({
      content: getDemoResponse(requestData.action || 'chat', requestData.messages?.[requestData.messages.length - 1]?.content || '')
    })
  }
}

function getSystemPrompt(context: any): string {
  const basePrompt = `You are an AI assistant specialized in special education and IEP (Individual Education Plan) management. You are helping a ${context?.userRole?.toLowerCase() || 'teacher'} in a special education setting.

Core Guidelines:
- Always prioritize student privacy and FERPA compliance
- Provide evidence-based, research-backed recommendations
- Use person-first language (e.g., "student with autism" not "autistic student")
- Reference IDEA (Individuals with Disabilities Education Act) requirements when relevant
- Be supportive and encouraging while maintaining professionalism
- Suggest concrete, measurable, and achievable strategies`

  return basePrompt
}

function getDemoResponse(action: string, userMessage: string): string {
  const responses = {
    chat: {
      'learning at home': `Here are some evidence-based strategies to support your child's learning at home:

**Create a Structured Environment:**
- Establish consistent daily routines and visual schedules
- Designate a quiet, organized space for learning activities
- Use timers and visual cues to help with transitions

**Break Tasks into Smaller Steps:**
- Divide assignments into manageable chunks
- Provide clear, step-by-step instructions
- Use checklists to track progress

**Use Multi-Sensory Learning:**
- Incorporate visual, auditory, and tactile elements
- Try educational apps, games, and hands-on activities
- Connect learning to real-world experiences

**Positive Reinforcement:**
- Celebrate small wins and progress
- Use specific praise ("Great job staying focused for 10 minutes!")
- Create reward systems aligned with your child's interests

**Communication with School:**
- Stay in regular contact with teachers and support staff
- Share successful home strategies with the school team
- Request resources and materials that match classroom approaches

Would you like me to elaborate on any of these strategies or discuss specific subject areas?`,
      default: `I'm here to help with special education and IEP-related questions! As a specialized assistant, I can provide guidance on:

- Learning strategies and accommodations
- IEP goal development and progress monitoring  
- Behavior support techniques
- Home-school collaboration
- Educational resources and tools

What specific area would you like support with today? Please note: This is a demo response as the AI service is currently not configured with an API key.`
    },
    generateIEPGoal: `Here's a sample SMART IEP goal structure:

**Academic Goal Example:**
By [date], when given grade-level reading passages, [Student] will read with 90% accuracy and answer comprehension questions with 80% accuracy across 4 out of 5 consecutive trials as measured by curriculum-based assessments.

**Behavioral Goal Example:**  
By [date], when transitioning between activities, [Student] will follow the transition routine independently within 2 minutes with no more than 1 verbal prompt in 4 out of 5 opportunities as measured by daily data collection.

Note: This is a demo response. For personalized goals, please configure the AI service.`,
    
    analyzeBehavior: `Based on behavior analysis principles, here are some general strategies:

**Data Collection:**
- Track antecedents, behaviors, and consequences (ABC data)
- Note patterns in timing, setting, and triggers
- Monitor frequency, duration, and intensity

**Environmental Modifications:**
- Adjust physical environment to reduce triggers
- Provide clear expectations and structure
- Offer choices and predictability

**Replacement Behaviors:**
- Teach functionally equivalent appropriate behaviors
- Practice new skills during calm moments
- Reinforce positive behaviors consistently

Note: This is a demo response. For specific behavior analysis, please configure the AI service with a valid API key.`
  }

  // Match user message to appropriate response
  if (action === 'generateIEPGoal') return responses.generateIEPGoal
  if (action === 'analyzeBehavior') return responses.analyzeBehavior
  
  // For chat, try to match keywords
  const message = userMessage.toLowerCase()
  if (message.includes('home') && message.includes('learn')) {
    return responses.chat['learning at home']
  }
  
  return responses.chat.default
}
