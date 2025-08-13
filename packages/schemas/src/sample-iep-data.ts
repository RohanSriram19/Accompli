/**
 * Sample IEP Data - Based on Real School District Examples
 * Demonstrates authentic IEP structure and content
 */

import { 
  IEP, 
  IEPGoal, 
  PresentLevels, 
  BehaviorEvent,
  DataCollection,
  TransitionPlan 
} from './iep-types'

// Sample Present Levels (PLAAFP) - Elementary Student with SLD
export const samplePresentLevels: PresentLevels = {
  id: "plaafp-001",
  student_id: "student-emma-001",
  academic_performance: {
    reading_level: "Beginning 2nd grade level (DRA Level 16)",
    math_level: "Mid 2nd grade level in computation, early 2nd grade in problem solving",
    writing_abilities: "Writes simple sentences with support, struggles with spelling and organization",
    strengths: [
      "Strong verbal communication skills",
      "Excellent listening comprehension", 
      "Shows enthusiasm for learning",
      "Works well with peers in small groups",
      "Good number sense for basic concepts"
    ],
    needs: [
      "Decoding multisyllabic words",
      "Reading fluency and comprehension",
      "Written expression organization",
      "Math word problem strategies",
      "Attention to task completion"
    ],
    baseline_data: {
      "oral_reading_fluency": "45 words per minute with 85% accuracy",
      "sight_words": "120/220 Dolch words mastered",
      "math_computation": "85% accuracy on 2-digit addition/subtraction",
      "writing_sample": "3-4 word sentences, phonetic spelling"
    }
  },
  functional_performance: {
    communication: "Communicates needs and wants clearly, asks for help appropriately",
    social_skills: "Plays cooperatively, follows classroom rules, needs reminders for turn-taking",
    behavior: "Generally compliant, occasional task avoidance when work is difficult",
    daily_living: "Independent with personal care, organizing materials with visual supports",
    motor_skills: "Age-appropriate gross motor, fine motor impacts handwriting legibility"
  },
  how_disability_affects_progress: "Emma's specific learning disability in reading significantly impacts her ability to access grade-level curriculum across all academic areas. She requires explicit, systematic instruction in phonics and decoding strategies. Her difficulty with written expression affects her ability to demonstrate knowledge in content areas.",
  parent_input: "Emma enjoys reading at home but gets frustrated with longer books. She loves math games and hands-on activities. Parents report she takes longer to complete homework and needs frequent breaks.",
  assessment_data: {
    cognitive: {
      "wais_full_scale_iq": 95,
      "verbal_comprehension": 102,
      "perceptual_reasoning": 88,
      "working_memory": 85,
      "processing_speed": 82
    },
    academic: {
      "woodcock_johnson_reading": "2.1 grade equivalent",
      "wiat_math": "2.3 grade equivalent", 
      "gort_fluency": "Below average range"
    },
    behavioral: {
      "conners_attention": "Average range",
      "basc_classroom_behavior": "At-risk for attention problems"
    },
    functional: {
      "vineland_daily_living": "Age appropriate",
      "classroom_observation": "On-task 70% during independent work"
    }
  },
  created_at: "2024-08-15T09:00:00Z",
  updated_at: "2024-09-01T14:30:00Z"
}

// Sample IEP Goals - Aligned with Common Core and Evidence-Based Practices
export const sampleIEPGoals: IEPGoal[] = [
  {
    id: "goal-reading-001",
    iep_id: "iep-emma-2024",
    area: "academic-reading",
    goal_statement: "By September 2025, when given a 2nd-3rd grade level passage, Emma will read aloud with 95% accuracy and answer 4 out of 5 comprehension questions correctly as measured by curriculum-based assessments administered monthly.",
    baseline_data: "Currently reads 2nd grade passages with 85% accuracy and answers 2 out of 5 comprehension questions correctly",
    target_criteria: "95% word accuracy and 80% comprehension (4/5 questions correct)",
    evaluation_method: "Curriculum-based measurement (CBM) oral reading fluency probes and comprehension questions",
    evaluation_schedule: "Monthly",
    specific_behavior: "Oral reading with comprehension",
    measurable_criteria: "95% accuracy, 4/5 comprehension questions",
    achievable_conditions: "2nd-3rd grade level passages",
    relevant_need: "Address reading decoding and comprehension deficits",
    time_bound: "By September 2025",
    progress_monitoring: {
      method: "CBM reading probes and comprehension assessments",
      frequency: "Weekly",
      responsible_person: "Special Education Teacher"
    },
    current_progress: 45,
    progress_notes: "Emma has increased accuracy to 90% and is answering 3/5 questions correctly. Continue with current intervention strategies.",
    created_at: "2024-09-01T10:00:00Z",
    updated_at: "2024-11-15T16:30:00Z"
  },
  {
    id: "goal-writing-001", 
    iep_id: "iep-emma-2024",
    area: "academic-writing",
    goal_statement: "By September 2025, when given a writing prompt, Emma will write a 5-sentence paragraph that includes a topic sentence, 3 supporting details, and a conclusion sentence with 80% of words spelled correctly as measured by writing samples collected bi-weekly.",
    baseline_data: "Currently writes 2-3 simple sentences with 60% spelling accuracy and limited organization",
    target_criteria: "5-sentence organized paragraph with 80% spelling accuracy",
    evaluation_method: "Writing samples scored with district rubric",
    evaluation_schedule: "Bi-weekly",
    specific_behavior: "Written paragraph composition",
    measurable_criteria: "5 sentences with required components, 80% spelling accuracy",
    achievable_conditions: "Given writing prompt and graphic organizer",
    relevant_need: "Improve written expression and organization skills",
    time_bound: "By September 2025",
    progress_monitoring: {
      method: "Writing samples and spelling assessments",
      frequency: "Bi-weekly",
      responsible_person: "Special Education Teacher"
    },
    current_progress: 30,
    progress_notes: "Emma is consistently writing 4 sentences and spelling accuracy has improved to 70%. Need to focus on conclusion sentences.",
    created_at: "2024-09-01T10:15:00Z",
    updated_at: "2024-11-15T16:30:00Z"
  },
  {
    id: "goal-math-001",
    iep_id: "iep-emma-2024", 
    area: "academic-math",
    goal_statement: "By September 2025, when presented with 2-step word problems involving addition and subtraction within 100, Emma will identify the correct operation and solve the problem with 80% accuracy across 4 consecutive data collection sessions as measured by teacher-created assessments administered weekly.",
    baseline_data: "Currently solves 1-step word problems with 70% accuracy and struggles to identify operations in multi-step problems",
    target_criteria: "80% accuracy on 2-step word problems across 4 consecutive sessions",
    evaluation_method: "Teacher-created word problem assessments",
    evaluation_schedule: "Weekly",
    specific_behavior: "Solving 2-step word problems",
    measurable_criteria: "80% accuracy across 4 consecutive sessions",
    achievable_conditions: "2-step problems with addition/subtraction within 100",
    relevant_need: "Improve mathematical reasoning and problem-solving skills",
    time_bound: "By September 2025",
    progress_monitoring: {
      method: "Weekly word problem assessments",
      frequency: "Weekly", 
      responsible_person: "Special Education Teacher"
    },
    current_progress: 60,
    progress_notes: "Emma is improving at identifying key words but still needs support breaking down multi-step problems.",
    created_at: "2024-09-01T10:30:00Z",
    updated_at: "2024-11-15T16:30:00Z"
  }
]

// Sample Full IEP - Elementary Student with Specific Learning Disability
export const sampleElementaryIEP: IEP = {
  id: "iep-emma-2024",
  student_id: "student-emma-001",
  iep_year: "2024-2025",
  effective_date: "2024-09-01",
  annual_review_date: "2025-09-01",
  triennial_evaluation_date: "2027-04-15",
  disability_category: "specific-learning-disability",
  eligibility_date: "2024-04-15",
  evaluation_summary: "Comprehensive evaluation indicates a specific learning disability in basic reading skills and written expression. Cognitive abilities are in the average range with relative weaknesses in processing speed and working memory.",
  present_levels: samplePresentLevels,
  annual_goals: sampleIEPGoals,
  progress_reporting: {
    method: "Quarterly progress reports with specific data on goal attainment",
    schedule: "Concurrent with regular report cards (every 9 weeks)"
  },
  special_education_services: {
    setting: "resource-room",
    frequency: 240, // 240 minutes per week
    location: "Special Education Resource Room",
    modifications: [
      "Extended time for assignments and assessments",
      "Reduced length assignments when appropriate",
      "Alternative assessment formats"
    ]
  },
  related_services: [
    {
      id: "service-speech-001",
      service_type: "speech-language-therapy",
      provider_type: "SLP",
      frequency: 1, // 1 session per week
      duration: 30, // 30 minutes
      location: "resource-room",
      start_date: "2024-09-01",
      end_date: "2025-09-01", 
      goals: ["Improve narrative language skills", "Develop vocabulary for academic success"]
    }
  ],
  supplementary_aids: [
    "Text-to-speech software for reading assignments",
    "Graphic organizers for writing tasks",
    "Calculator for multi-step math problems",
    "Visual schedule and task lists"
  ],
  program_modifications: [
    "Shortened assignments with same learning objectives",
    "Alternative assessment formats (oral vs written when appropriate)",
    "Additional processing time for complex tasks"
  ],
  personnel_support: [
    "Consultation between special education and general education teachers weekly"
  ],
  lre_justification: "Emma will receive special education services in the resource room for 240 minutes per week (approximately 20% of the school day) to address her specific learning needs in reading and writing. She will participate in the general education classroom for 80% of the day with appropriate supports and accommodations.",
  general_education_participation: 80,
  nonacademic_participation: [
    "Art", "Music", "Physical Education", "Lunch", "Recess", "Field trips", "School assemblies"
  ],
  state_assessments: {
    participates_in_general: true,
    accommodations: [
      {
        id: "acc-001",
        category: "presentation",
        description: "Read aloud for all subject areas except reading comprehension",
        frequency: "during all state assessments",
        location: ["separate room"],
        is_assessment_accommodation: true
      },
      {
        id: "acc-002", 
        category: "timing",
        description: "Extended time (time and a half)",
        frequency: "during all state assessments",
        location: ["separate room", "general classroom"],
        is_assessment_accommodation: true
      }
    ]
  },
  district_assessments: {
    participates_in_general: true,
    accommodations: [
      {
        id: "acc-003",
        category: "response",
        description: "Oral responses for written assignments when appropriate",
        frequency: "as needed",
        location: ["general classroom", "resource room"],
        is_assessment_accommodation: true
      }
    ]
  },
  meetings: [
    {
      id: "meeting-001",
      iep_id: "iep-emma-2024",
      meeting_type: "annual",
      meeting_date: "2024-08-15",
      participants: {
        parent_guardian: true,
        student: false, // Elementary age
        general_education_teacher: true,
        special_education_teacher: true,
        district_representative: true,
        evaluation_interpreter: true,
        others: ["School Psychologist", "Speech-Language Pathologist"]
      },
      agenda_items: [
        "Review present levels of performance",
        "Discuss annual goals",
        "Determine appropriate services",
        "Plan for transition to 4th grade"
      ],
      decisions_made: [
        "Continue special education services in resource room setting",
        "Add speech-language therapy services",
        "Implement new assistive technology supports"
      ],
      parent_consent: true,
      prior_written_notice: "Parents were provided prior written notice on August 10, 2024 regarding proposed changes to Emma's educational program.",
      created_at: "2024-08-15T14:00:00Z",
      updated_at: "2024-08-15T16:30:00Z"
    }
  ],
  prior_written_notice: [
    "Notice of proposed services provided August 10, 2024",
    "Notice of evaluation results provided April 20, 2024"
  ],
  parent_consent_date: "2024-08-20",
  confidentiality_notice: true,
  status: "active",
  created_at: "2024-08-15T14:00:00Z",
  updated_at: "2024-11-15T16:30:00Z",
  created_by: "teacher-001",
  amendments: []
}

// Sample Transition Plan - High School Student
export const sampleTransitionPlan: TransitionPlan = {
  id: "transition-001",
  student_id: "student-marcus-001",
  postsecondary_goals: {
    education: "Marcus will enroll in a 2-year automotive technology program at the local community college within one year of graduation.",
    employment: "Marcus will obtain competitive employment in the automotive repair field working at least 20 hours per week at minimum wage or above within one year of graduation.",
    independent_living: "Marcus will live independently in his own apartment or with minimal support within two years of graduation."
  },
  transition_services: {
    instruction: [
      "Job-specific vocabulary and communication skills",
      "Functional math skills for workplace application", 
      "Independent living skills curriculum",
      "Self-advocacy and self-determination skills"
    ],
    related_services: [
      "Career counseling",
      "Transportation training",
      "Assistive technology assessment"
    ],
    community_experiences: [
      "Work-based learning experiences at local automotive shops",
      "Community college campus visits and orientation",
      "Independent travel training on public transportation"
    ],
    employment_objectives: [
      "Complete automotive technology job shadowing",
      "Participate in paid work experience program",
      "Develop job search and interview skills",
      "Create professional resume and portfolio"
    ],
    daily_living_skills: [
      "Money management and budgeting",
      "Meal planning and preparation", 
      "Time management and scheduling",
      "Personal care and hygiene maintenance"
    ],
    functional_vocational_evaluation: "Marcus demonstrates strong aptitude for hands-on mechanical work and shows interest in automotive repair. Assessment indicates need for support in reading technical manuals and mathematical calculations."
  },
  courses_of_study: [
    "Automotive Technology I & II",
    "Applied Mathematics",
    "Workplace Communication",
    "Independent Living Skills",
    "Career Exploration"
  ],
  agency_linkages: [
    {
      agency_name: "Department of Vocational Rehabilitation",
      contact_info: "John Smith, VR Counselor - (555) 123-4567",
      services_provided: "Job placement assistance, vocational training funding, assistive technology"
    },
    {
      agency_name: "County Community College",
      contact_info: "Sarah Johnson, Disability Services - (555) 987-6543", 
      services_provided: "Academic accommodations, support services, career planning"
    }
  ],
  transfer_of_rights_notice: true,
  created_at: "2024-08-15T10:00:00Z",
  updated_at: "2024-11-15T16:30:00Z"
}

// Sample Behavior Events with IEP Goal Alignment
export const sampleBehaviorEvents: BehaviorEvent[] = [
  {
    id: "behavior-001",
    student_id: "student-tyler-001",
    goal_id: "goal-behavior-001", // Links to specific behavior goal
    timestamp: "2024-11-15T10:30:00Z",
    antecedent: "Transition from preferred activity (art) to non-preferred activity (math worksheet)",
    behavior: "Threw pencil, pushed materials off desk, verbal refusal 'I'm not doing this!'",
    consequence: "Brief break provided, materials cleaned up together, redirected to task with modified assignment",
    severity: "medium",
    duration_seconds: 180, // 3 minutes
    location: "General education classroom", 
    staff_present: ["Mrs. Smith - General Ed Teacher", "Mr. Jones - Aide"],
    environmental_factors: ["Noisy classroom", "Unexpected schedule change", "Peer conflict earlier"],
    intervention_used: ["Choice of seating", "Modified assignment length", "Visual schedule review"],
    effectiveness_rating: 4,
    follow_up_needed: true,
    follow_up_notes: "Discuss transition warnings with team. Consider adding choice board for math activities.",
    created_by: "aide-001", 
    created_at: "2024-11-15T10:35:00Z"
  }
]

// Sample Data Collection for IEP Goals
export const sampleDataCollection: DataCollection[] = [
  {
    id: "data-001",
    goal_id: "goal-reading-001",
    student_id: "student-emma-001",
    collection_date: "2024-11-15",
    trial_number: 1,
    accuracy_data: { correct: 38, total: 40 }, // 95% accuracy
    prompt_level: "independent",
    mastery_criteria_met: true,
    teaching_conditions: "Small group instruction with 3 students",
    materials_used: ["2nd grade reading passage", "comprehension questions worksheet"],
    staff_implementing: "Special Education Teacher",
    notes: "Emma read fluently and self-corrected two errors. Answered 4/5 comprehension questions correctly.",
    created_at: "2024-11-15T14:00:00Z"
  },
  {
    id: "data-002", 
    goal_id: "goal-writing-001",
    student_id: "student-emma-001",
    collection_date: "2024-11-15",
    trial_number: 1,
    accuracy_data: { correct: 32, total: 40 }, // 80% spelling accuracy
    prompt_level: "verbal",
    mastery_criteria_met: false, // Only wrote 4 sentences instead of 5
    teaching_conditions: "1:1 instruction",
    materials_used: ["Writing prompt", "graphic organizer", "word bank"],
    staff_implementing: "Special Education Teacher",
    notes: "Emma wrote 4 well-organized sentences but needs reminding to add conclusion. Spelling accuracy improved.",
    created_at: "2024-11-15T15:30:00Z"
  }
]
