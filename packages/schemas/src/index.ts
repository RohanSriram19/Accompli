import { z } from 'zod'

// Base schemas
export const UUIDSchema = z.string().uuid()
export const TimestampSchema = z.string().datetime()

// User and org schemas
export const UserRoleSchema = z.enum(['TEACHER', 'AIDE', 'ADMIN'])

export const OrgSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  created_at: TimestampSchema,
})

export const UserSchema = z.object({
  id: UUIDSchema,
  org_id: UUIDSchema,
  email: z.string().email(),
  role: UserRoleSchema,
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  created_at: TimestampSchema,
})

// Student schemas
export const StudentSchema = z.object({
  id: UUIDSchema,
  org_id: UUIDSchema,
  first_name: z.string(),
  last_name: z.string(),
  grade: z.string().optional(),
  created_at: TimestampSchema,
})

// IEP schemas
export const IEPSchema = z.object({
  id: UUIDSchema,
  student_id: UUIDSchema,
  start_date: z.string().date(),
  end_date: z.string().date(),
  accommodations: z.record(z.any()).default({}),
  services: z.record(z.any()).default({}),
  created_at: TimestampSchema,
})

export const GoalSchema = z.object({
  id: UUIDSchema,
  iep_id: UUIDSchema,
  area: z.string(),
  objective: z.string(),
  baseline: z.string().optional(),
  target: z.string().optional(),
  measurement_schedule: z.string().optional(),
  created_at: TimestampSchema,
})

// Behavior tracking schemas
export const SeveritySchema = z.enum(['low', 'medium', 'high'])

export const ABCDataSchema = z.object({
  antecedent: z.string(),
  behavior: z.string(),
  consequence: z.string(),
})

export const BehaviorEventSchema = z.object({
  id: UUIDSchema,
  org_id: UUIDSchema,
  student_id: UUIDSchema,
  abc: ABCDataSchema,
  severity: SeveritySchema,
  duration_seconds: z.number().int().min(0).default(0),
  timestamp: TimestampSchema,
  created_by: UUIDSchema,
  created_at: TimestampSchema,
})

// Lesson planning schemas
export const LessonStatusSchema = z.enum(['draft', 'active', 'done'])

export const LessonPlanSchema = z.object({
  id: UUIDSchema,
  org_id: UUIDSchema,
  student_id: UUIDSchema.optional(),
  group_id: UUIDSchema.optional(),
  objective: z.string(),
  scaffold: z.record(z.any()).default({}),
  resources: z.array(z.record(z.any())).default([]),
  status: LessonStatusSchema.default('draft'),
  created_by: UUIDSchema,
  created_at: TimestampSchema,
})

// Evidence schemas
export const EvidenceKindSchema = z.enum(['note', 'photo', 'doc', 'video', 'audio'])

export const EvidenceSchema = z.object({
  id: UUIDSchema,
  org_id: UUIDSchema,
  student_id: UUIDSchema,
  s3_key: z.string(),
  kind: EvidenceKindSchema,
  meta: z.record(z.any()).default({}),
  created_by: UUIDSchema,
  created_at: TimestampSchema,
})

// Request/Response schemas for API
export const CreateBehaviorEventRequestSchema = z.object({
  student_id: UUIDSchema,
  abc: ABCDataSchema,
  severity: SeveritySchema,
  duration_seconds: z.number().int().min(0).default(0),
  timestamp: TimestampSchema,
})

export const CreateLessonPlanRequestSchema = z.object({
  student_id: UUIDSchema.optional(),
  group_id: UUIDSchema.optional(),
  objective: z.string(),
  scaffold: z.record(z.any()).default({}),
  resources: z.array(z.record(z.any())).default([]),
  status: LessonStatusSchema.default('draft'),
})

export const GenerateDailyNoteRequestSchema = z.object({
  student_id: UUIDSchema,
  date: z.string().date(),
  include_events: z.boolean().default(true),
  include_lessons: z.boolean().default(true),
})

// Auth schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  expires_in: z.number(),
  user: UserSchema,
})

// Type exports
export type UUID = z.infer<typeof UUIDSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type Org = z.infer<typeof OrgSchema>
export type User = z.infer<typeof UserSchema>
export type Student = z.infer<typeof StudentSchema>
export type IEP = z.infer<typeof IEPSchema>
export type Goal = z.infer<typeof GoalSchema>
export type Severity = z.infer<typeof SeveritySchema>
export type ABCData = z.infer<typeof ABCDataSchema>
export type BehaviorEvent = z.infer<typeof BehaviorEventSchema>
export type LessonStatus = z.infer<typeof LessonStatusSchema>
export type LessonPlan = z.infer<typeof LessonPlanSchema>
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>
export type Evidence = z.infer<typeof EvidenceSchema>

export type CreateBehaviorEventRequest = z.infer<typeof CreateBehaviorEventRequestSchema>
export type CreateLessonPlanRequest = z.infer<typeof CreateLessonPlanRequestSchema>
export type GenerateDailyNoteRequest = z.infer<typeof GenerateDailyNoteRequestSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type TokenResponse = z.infer<typeof TokenResponseSchema>

// Export comprehensive IEP types
export * from './iep-types'
