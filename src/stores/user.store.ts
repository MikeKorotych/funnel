import { create } from "zustand";

/** Compiled user profile for handoff to the product app */
export type UserProfile = {
  sessionId: string;
  topicId: string;
  creativeId: string | null;
  utmParams: Record<string, string>;
  answers: Record<string, string>;
  scores: Record<string, number>;
  diagnosis: {
    severity: string;
    planName: string;
    title: string;
  } | null;
  completedAt: number | null;
};

type UserState = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clear: () => void;
};

export const useUserStore = create<UserState>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
