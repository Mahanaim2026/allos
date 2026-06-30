export type Mood = 'Anxious' | 'Sad' | 'Weary' | 'Angry' | 'Lonely' | 'Confused' | 'Grateful' | 'Hopeful';

export type Struggle = 'Fear' | 'Resentment' | 'Shame' | 'Doubt' | 'Unforgiveness' | 'Lust' | 'Impatience' | 'Discouragement';

export type LifeChallenge =
  | 'Waiting'
  | 'Childlessness'
  | 'Marital conflict'
  | 'Grief'
  | 'Parenting'
  | 'Finances'
  | 'Betrayal'
  | 'Unemployment';

export type SpiritualNeed = 'Comfort' | 'Wisdom' | 'Courage' | 'Repentance' | 'Hope' | 'Peace' | 'Direction' | 'Strength';

export type OutputType =
  | 'sermonette'
  | 'scripture_exhortation'
  | 'prayer'
  | 'meditation'
  | 'declaration'
  | 'song_poem';

export type Tone = 'gentle' | 'pastoral' | 'bold' | 'reflective' | 'prophetic';

export type Length = 'short' | 'medium' | 'deep';

export interface GenerateRequest {
  mood: string;
  struggle: string;
  lifeChallenge: string;
  spiritualNeed: string;
  outputType: OutputType;
  tone: Tone;
  length: Length;
  additionalContext?: string;
}

export interface JourneyEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  struggle?: string;
  life_challenge?: string;
  spiritual_need?: string;
  output_type: string;
  tone?: string;
  length?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  denomination?: string;
  country?: string;
  plan: string;
  created_at: string;
}
