export interface Question {
  id: number;
  question: string;
  placeholder: string;
}

export interface FlowState {
  answers: string[];
  photo: string | null;
}

