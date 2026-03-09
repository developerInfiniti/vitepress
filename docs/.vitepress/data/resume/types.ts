export interface ResumeData {
  meta: ResumeMeta
  header: ResumeHeader
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  projects: ProjectItem[]
  languages: LanguageItem[]
  certifications?: CertificationItem[]
}

export interface ResumeMeta {
  locale: 'ru' | 'uk' | 'en'
  lastUpdated: string
  pdfFileName: string
}

export interface ResumeHeader {
  name: string
  title: string
  photo?: string
  contacts: ContactItem[]
}

export interface ContactItem {
  icon: string
  label: string
  value: string
  link?: string
}

export interface ExperienceItem {
  company: string
  position: string
  period: string
  location?: string
  description: string
  achievements: string[]
  stack: string[]
}

export interface EducationItem {
  institution: string
  degree: string
  period: string
  description?: string
}

export interface SkillGroup {
  category: string
  skills: { name: string; level: number }[]
}

export interface ProjectItem {
  name: string
  description: string
  stack: string[]
  links: { label: string; url: string }[]
  image?: string
}

export interface LanguageItem {
  language: string
  level: string
}

export interface CertificationItem {
  name: string
  issuer: string
  year: number
  link?: string
}
