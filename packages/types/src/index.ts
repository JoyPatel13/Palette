// ─── Color System ───────────────────────────────────────────────────────────

/** The six gaming personality color axes. */
export const COLOR_NAMES = [
  "crimson",
  "cobalt",
  "emerald",
  "violet",
  "amber",
  "onyx",
] as const;

export type ColorName = (typeof COLOR_NAMES)[number];

/**
 * A 6-element vector representing a user's gaming personality blend.
 * Each value is between 0 and 1, and the vector is normalized (sums to 1.0).
 * Index order follows COLOR_NAMES: [crimson, cobalt, emerald, violet, amber, onyx]
 */
export type ColorVector = [number, number, number, number, number, number];

// ─── Quiz ───────────────────────────────────────────────────────────────────

/** Weight adjustments an answer applies to each color axis. Partial — only non-zero axes need to be specified. */
export type ColorWeightMap = Partial<Record<ColorName, number>>;

export interface QuizAnswerOption {
  id: string;
  text: string;
  weights: ColorWeightMap;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizAnswerOption[];
}

/** A user's selected answer for a single quiz question. */
export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

/** The full set of answers submitted for a quiz. */
export interface QuizSubmission {
  answers: QuizAnswer[];
}

/** The computed result after scoring a quiz submission. */
export interface QuizResult {
  vector: ColorVector;
  primaryColor: ColorName;
  secondaryColor: ColorName;
}

// ─── Games ──────────────────────────────────────────────────────────────────

export interface GameCard {
  id: string;
  rawgId: number;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  genres: string[];
  tags: string[];
  tagVector: ColorVector;
  releaseDate: string | null;
  rating: number | null;
}

// ─── Swipe ──────────────────────────────────────────────────────────────────

export type SwipeAction = "LIKE" | "DISLIKE" | "SUPERLIKE";

export interface SwipePayload {
  gameId: string;
  action: SwipeAction;
}

// ─── User Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  colorVector: ColorVector | null;
  primaryColor: ColorName | null;
  secondaryColor: ColorName | null;
}
