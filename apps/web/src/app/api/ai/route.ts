import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { messages, context, action } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
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
      model: 'gpt-4',
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
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
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
