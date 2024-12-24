export interface Character {
  gender: string;
  sexualOrientation: string;
  appearance: number;
  intelligence: number;
  strength: number;
  talent: string[];
  personality: string;
  familyBackground: string;
  religion: string;
  ethnicity: string;
  nationality: string;
  socialClass: string;
}

export interface LifeEvent {
  age: number;
  event: string;
  isDeath?: boolean;
  isSignificant?: boolean;
}

export interface GameState {
  character: Character | null;
  currentAge: number;
  lifeEvents: LifeEvent[];
  isGameOver: boolean;
} 