export type OutputType = 'sermonette' | 'exhortation' | 'prayer' | 'meditation' | 'declaration' | 'song';
export type Tone = 'gentle' | 'pastoral' | 'bold' | 'reflective';
export type Length = 'short' | 'medium' | 'deep';

export interface SeasonInput {
  moods: string[];
  struggles: string[];
  challenges: string[];
  spiritualNeeds: string[];
  customInput: string;
}

export interface GenerateRequest {
  season: SeasonInput;
  outputType: OutputType;
  tone: Tone;
  length: Length;
}

export interface AllosResponse {
  title: string;
  scriptureReferences: string[];
  body: string;
  reflection?: string;
  prayer?: string;
  declaration?: string;
  nextStep?: string;
}

export interface JourneyEntry {
  id: string;
  created_at: string;
  mood: string;
  struggle: string;
  challenge: string;
  spiritual_need: string;
  custom_input: string;
  output_type: string;
  tone: string;
  length: string;
  title: string;
  scripture_references: string[];
  generated_text: string;
  favorite: boolean;
  helpful_rating: string | null;
}