export type NodeId = string;

export type AnswerType = "single" | "multi" | "scale" | "slider";

export type ScaleConfig = {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
};

export type SliderConfig = {
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
};

export type MultiSelectConfig = {
  minSelect: number;
  maxSelect: number;
};

export type DialogueNode = {
  id: NodeId;
  type: "question" | "break" | "loader" | "result";
  answerType?: AnswerType;
  scene: {
    dialogue: string;
    subtext?: string;
    mood?: "neutral" | "concerned" | "encouraging" | "dramatic";
  };
  answers?: DialogueAnswer[];
  scaleConfig?: ScaleConfig;
  sliderConfig?: SliderConfig;
  multiSelectConfig?: MultiSelectConfig;
  /** Auto-advance delay for break/loader nodes */
  autoAdvanceMs?: number;
  /** Loading steps for loader nodes */
  loaderSteps?: LoaderStep[];
  /** XP reward for completing this node */
  xpReward?: number;
  /** Default next node (for non-question types) */
  nextNodeId?: NodeId;
};

export type DialogueAnswer = {
  id: string;
  text: string;
  emoji?: string;
  icon?: string;
  nextNodeId: NodeId;
  value?: number;
  /** Tags for personalization scoring */
  tags?: string[];
  /** Score contribution per dimension */
  score?: Record<string, number>;
};

export type LoaderStep = {
  label: string;
  durationMs: number;
};

export type DialogueTree = {
  id: string;
  topicId: string;
  version: string;
  startNodeId: NodeId;
  nodes: Record<NodeId, DialogueNode>;
};

export type ScoringDimension = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export type ResultTemplate = {
  id: string;
  condition: {
    dimension: string;
    operator: ">=" | "<=" | ">" | "<" | "==";
    value: number;
  }[];
  severity: "mild" | "moderate" | "severe";
  title: string;
  description: string;
  planName: string;
  stats: { label: string; dimension: string; icon: string; inverted?: boolean }[];
};

export type ScoringRules = {
  dimensions: ScoringDimension[];
  resultTemplates: ResultTemplate[];
};
