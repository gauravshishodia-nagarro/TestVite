import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StepProgressState {
  setStep: (step: number) => void;
  gotoNextStep: () => void;
  setTotalSteps: (total: number) => void;
  currentStep: number;
  totalSteps: number;
  setProgress: (step: number, total?: number) => void;
}

const initialState: Omit<
  StepProgressState,
  "setStep" | "setTotalSteps" | "setProgress" | "gotoNextStep"
> = {
  currentStep: 1,
  totalSteps: 5,
};

export const useStepProgressStore = create<StepProgressState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      gotoNextStep: () => set({ currentStep: get().currentStep + 1 }),
      setTotalSteps: (total) => set({ totalSteps: total }),
      setProgress: (step, total = get().totalSteps) =>
        set({ currentStep: step, totalSteps: total }),
    }),
    { name: "useStepProgressStore" }
  )
);
