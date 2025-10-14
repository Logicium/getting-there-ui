// Common shared TypeScript interfaces

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface HeroData {
  title: string;
  description: string;
  tag?: string | null;
}
