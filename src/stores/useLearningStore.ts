import { create } from 'zustand';
import { Explanation, QuestionRound, Gap, PracticeItem } from '../db/database';

type LearningStep = 'idle' | 'explaining' | 'questioning' | 'diagnosing' | 'practicing';

interface LearningState {
  currentExplanation: Explanation | null;
  currentQuestions: QuestionRound | null;
  currentDiagnosis: Gap[];
  currentPractice: PracticeItem | null;
  learningStep: LearningStep;

  setExplanation: (explanation: Explanation | null) => void;
  addQuestion: (questionRound: QuestionRound) => void;
  setDiagnosis: (diagnosis: Gap[]) => void;
  setPractice: (practice: PracticeItem | null) => void;
  setLearningStep: (step: LearningStep) => void;
  resetFlow: () => void;
}

const initialState = {
  currentExplanation: null,
  currentQuestions: null,
  currentDiagnosis: [] as Gap[],
  currentPractice: null,
  learningStep: 'idle' as LearningStep,
};

export const useLearningStore = create<LearningState>((set) => ({
  ...initialState,

  setExplanation: (explanation) => {
    set({
      currentExplanation: explanation,
      learningStep: explanation ? 'explaining' : 'idle',
    });
  },

  addQuestion: (questionRound) => {
    set({
      currentQuestions: questionRound,
      learningStep: 'questioning',
    });
  },

  setDiagnosis: (diagnosis) => {
    set({
      currentDiagnosis: diagnosis,
      learningStep: diagnosis.length > 0 ? 'diagnosing' : 'idle',
    });
  },

  setPractice: (practice) => {
    set({
      currentPractice: practice,
      learningStep: practice ? 'practicing' : 'idle',
    });
  },

  setLearningStep: (step) => {
    set({ learningStep: step });
  },

  resetFlow: () => {
    set(initialState);
  },
}));
