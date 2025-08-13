/**
 * IEP Types - Aligned with IDEA Federal Requirements
 * Based on 34 CFR 300.320 and actual school district implementations
 */

// IDEA 13 Disability Categories
export type DisabilityCategory = 
  | 'autism'
  | 'deaf-blindness'
  | 'deafness'
  | 'emotional-disturbance'
  | 'hearing-impairment'
  | 'intellectual-disability'
  | 'multiple-disabilities'
  | 'orthopedic-impairment'
  | 'other-health-impairment'
  | 'specific-learning-disability'
  | 'speech-language-impairment'
  | 'traumatic-brain-injury'
  | 'visual-impairment'

// Service Types from Real Districts
export type ServiceType = 
  | 'special-education'
  | 'speech-language-therapy'
  | 'occupational-therapy'
  | 'physical-therapy'
  | 'counseling'
  | 'adaptive-pe'
  | 'assistive-technology'
  | 'orientation-mobility'
  | 'behavioral-support'
  | 'transition-services'

// Goal Areas
export type GoalArea = 
  | 'academic-reading'
  | 'academic-writing'
  | 'academic-math'
  | 'academic-science'
  | 'academic-social-studies'
  | 'communication'
  | 'social-emotional'
  | 'behavioral'
  | 'motor-skills'
  | 'daily-living'
  | 'vocational'
  | 'transition'

// Least Restrictive Environment Settings
export type LREEnvironment = 
  | 'general-education'
  | 'resource-room'
  | 'special-education-class'
  | 'separate-school'
  | 'residential-facility'
  | 'homebound'
  | 'hospital'

export interface PresentLevels {
  // PLAAFP - Present Levels of Academic Achievement and Functional Performance
  id: string
  student_id: string
  academic_performance: {
    reading_level: string
    math_level: string
    writing_abilities: string
    strengths: string[]
    needs: string[]
    baseline_data: Record<string, any>
  }
  functional_performance: {
    communication: string
    social_skills: string
    behavior: string
    daily_living: string
    motor_skills: string
  }
  how_disability_affects_progress: string
  parent_input: string
  assessment_data: {
    cognitive: Record<string, any>
    academic: Record<string, any>
    behavioral: Record<string, any>
    functional: Record<string, any>
  }
  created_at: string
  updated_at: string
}

export interface IEPGoal {
  id: string
  iep_id: string
  area: GoalArea
  
  // Measurable Annual Goal Components
  goal_statement: string
  baseline_data: string
  target_criteria: string
  evaluation_method: string
  evaluation_schedule: string // e.g., "quarterly", "monthly"
  
  // SMART Goal Components
  specific_behavior: string
  measurable_criteria: string
  achievable_conditions: string
  relevant_need: string
  time_bound: string
  
  // Progress Tracking
  short_term_objectives?: string[] // Required for alternate assessment students
  benchmarks?: string[]
  progress_monitoring: {
    method: string
    frequency: string
    responsible_person: string
  }
  
  // Current Progress
  current_progress: number // 0-100%
  progress_notes: string
  mastery_date?: string
  
  created_at: string
  updated_at: string
}

export interface Accommodation {
  id: string
  category: 'presentation' | 'response' | 'setting' | 'timing'
  description: string
  frequency: string // "daily", "during assessments", etc.
  location: string[] // where it applies
  is_assessment_accommodation: boolean
}

export interface Modification {
  id: string
  subject_area: string
  description: string
  rationale: string
  frequency: string
}

export interface RelatedService {
  id: string
  service_type: ServiceType
  provider_type: string // "SLP", "OT", "PT", etc.
  frequency: number // sessions per week/month
  duration: number // minutes per session
  location: LREEnvironment
  start_date: string
  end_date: string
  goals: string[]
}

export interface TransitionPlan {
  id: string
  student_id: string
  
  // Required for students 16+ (or younger if appropriate)
  postsecondary_goals: {
    education: string
    employment: string
    independent_living?: string
  }
  
  transition_services: {
    instruction: string[]
    related_services: string[]
    community_experiences: string[]
    employment_objectives: string[]
    daily_living_skills?: string[]
    functional_vocational_evaluation?: string
  }
  
  courses_of_study: string[]
  agency_linkages: {
    agency_name: string
    contact_info: string
    services_provided: string
  }[]
  
  transfer_of_rights_notice: boolean // must be included year before majority
  
  created_at: string
  updated_at: string
}

export interface IEPMeeting {
  id: string
  iep_id: string
  meeting_type: 'initial' | 'annual' | 'triennial' | 'amendment' | 'transition' | 'manifestation'
  meeting_date: string
  
  // Required Participants
  participants: {
    parent_guardian: boolean
    student: boolean // required for transition planning
    general_education_teacher: boolean
    special_education_teacher: boolean
    district_representative: boolean
    evaluation_interpreter: boolean
    others: string[]
  }
  
  agenda_items: string[]
  decisions_made: string[]
  parent_consent: boolean
  prior_written_notice: string
  
  created_at: string
  updated_at: string
}

export interface IEP {
  id: string
  student_id: string
  
  // IEP Identifying Information
  iep_year: string
  effective_date: string
  annual_review_date: string
  triennial_evaluation_date: string
  
  // Eligibility Information  
  disability_category: DisabilityCategory
  eligibility_date: string
  evaluation_summary: string
  
  // Required IEP Components (34 CFR 300.320)
  present_levels: PresentLevels
  annual_goals: IEPGoal[]
  progress_reporting: {
    method: string
    schedule: string // "quarterly with report cards"
  }
  
  // Special Education and Related Services
  special_education_services: {
    setting: LREEnvironment
    frequency: number // minutes per day/week
    location: string
    modifications: string[]
  }
  related_services: RelatedService[]
  supplementary_aids: string[]
  program_modifications: string[]
  personnel_support: string[]
  
  // LRE Documentation
  lre_justification: string
  general_education_participation: number // percentage
  nonacademic_participation: string[]
  
  // Assessment Information
  state_assessments: {
    participates_in_general: boolean
    accommodations: Accommodation[]
    alternate_assessment?: {
      assessment_name: string
      justification: string
    }
  }
  
  district_assessments: {
    participates_in_general: boolean
    accommodations: Accommodation[]
  }
  
  // Extended School Year (ESY)
  esy_services?: {
    eligible: boolean
    justification: string
    services: RelatedService[]
  }
  
  // Transition Planning (16+ or younger if appropriate)
  transition_plan?: TransitionPlan
  
  // Behavior Support Plan (if needed)
  behavior_intervention_plan?: {
    target_behaviors: string[]
    function_of_behavior: string
    replacement_behaviors: string[]
    antecedent_strategies: string[]
    consequence_strategies: string[]
    crisis_procedures: string[]
  }
  
  // Meeting Information
  meetings: IEPMeeting[]
  
  // Compliance and Legal
  prior_written_notice: string[]
  parent_consent_date: string
  confidentiality_notice: boolean
  
  // Status
  status: 'draft' | 'active' | 'expired' | 'amended'
  
  created_at: string
  updated_at: string
  created_by: string
  
  // Audit Trail
  amendments: {
    date: string
    changes: string
    reason: string
    authorized_by: string
  }[]
}

// Progress Monitoring Data
export interface GoalProgress {
  id: string
  goal_id: string
  measurement_date: string
  raw_score: number
  percentage: number
  notes: string
  measured_by: string
  data_collection_method: string
  
  created_at: string
}

// ABC Behavior Data (aligned with IEP behavior goals)
export interface BehaviorEvent {
  id: string
  student_id: string
  goal_id?: string // link to specific behavior goal if applicable
  
  timestamp: string
  antecedent: string
  behavior: string
  consequence: string
  
  severity: 'low' | 'medium' | 'high'
  duration_seconds: number
  location: string
  staff_present: string[]
  
  environmental_factors: string[]
  intervention_used: string[]
  effectiveness_rating: number // 1-5
  
  follow_up_needed: boolean
  follow_up_notes?: string
  
  created_by: string
  created_at: string
}

// Data Collection for IEP Goals
export interface DataCollection {
  id: string
  goal_id: string
  student_id: string
  
  collection_date: string
  trial_number: number
  
  // Data Types
  frequency_data?: number
  duration_data?: number
  latency_data?: number
  accuracy_data?: { correct: number; total: number }
  
  prompt_level: 'independent' | 'verbal' | 'gestural' | 'model' | 'physical'
  mastery_criteria_met: boolean
  
  teaching_conditions: string
  materials_used: string[]
  staff_implementing: string
  
  notes: string
  attachments?: string[]
  
  created_at: string
}
