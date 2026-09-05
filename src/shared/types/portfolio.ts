export interface PersonalInfo {
  name: string
  title: string
  tagline: string
  bio: string
  autobiography: string[]
}

export interface StepLink {
  label: string
  url: string
  icon?: 'github' | 'link' | 'pdf' | 'video' | 'slide'
}

export interface StepAward {
  title: string
  issuer?: string
  year?: string
}

export interface StepDetail {
  highlights?: string[]
  links?: StepLink[]
  papers?: StepLink[]
  awards?: StepAward[]
  courses?: string[]
  responsibilities?: string[]
}

export interface JourneyStep {
  id: string
  year: string
  type: 'education' | 'work'
  title: string
  institution: string
  city: string
  country: string
  lat: number
  lon: number
  description: string
  quote?: string
  skills: string[]
  details?: StepDetail
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  url: string
  github: string
}

export interface ContactInfo {
  email: string
  github: string
  linkedin: string
}

export interface PortfolioData {
  personal: PersonalInfo
  journey: JourneyStep[]
  projects: Project[]
  contact: ContactInfo
}
