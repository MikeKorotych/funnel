export const EVENTS = {
  FUNNEL_STARTED: "funnel_started",
  QUIZ_QUESTION_ANSWERED: "quiz_question_answered",
  QUIZ_COMPLETED: "quiz_completed",
  RESULTS_VIEWED: "results_viewed",
  SALE_VIEWED: "sale_viewed",
  SALE_TIER_SELECTED: "sale_tier_selected",
  PURCHASE_INITIATED: "purchase_initiated",
  PURCHASE_COMPLETED: "purchase_completed",
  APP_REDIRECT: "app_redirect",
  QUIZ_BACK: "quiz_back",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
