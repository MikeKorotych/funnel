import type { TopicConfig } from "./types";
import { phoneAddictionTopic } from "./phone-addiction";

const topics: Record<string, TopicConfig> = {
  "phone-addiction": phoneAddictionTopic,
};

export const DEFAULT_TOPIC_ID = "phone-addiction";

export function getTopic(id: string): TopicConfig | null {
  return topics[id] ?? null;
}

export function getTopicIds(): string[] {
  return Object.keys(topics);
}

export type { TopicConfig };
