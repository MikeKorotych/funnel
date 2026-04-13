import type { DialogueTree, DialogueNode, DialogueAnswer, NodeId } from "./types";

export function getNode(tree: DialogueTree, nodeId: NodeId): DialogueNode | null {
  return tree.nodes[nodeId] ?? null;
}

export function getStartNode(tree: DialogueTree): DialogueNode {
  const node = tree.nodes[tree.startNodeId];
  if (!node) throw new Error(`Start node "${tree.startNodeId}" not found in tree "${tree.id}"`);
  return node;
}

export function getNextNodeId(
  node: DialogueNode,
  selectedAnswer?: DialogueAnswer,
): NodeId | null {
  if (node.type === "question" && selectedAnswer) {
    return selectedAnswer.nextNodeId;
  }
  return node.nextNodeId ?? null;
}

export function getAnswer(
  node: DialogueNode,
  answerId: string,
): DialogueAnswer | null {
  return node.answers?.find((a) => a.id === answerId) ?? null;
}

export function countQuestionNodes(tree: DialogueTree): number {
  return Object.values(tree.nodes).filter((n) => n.type === "question").length;
}

export function getAnsweredQuestionCount(
  tree: DialogueTree,
  history: NodeId[],
): number {
  return history.filter((id) => tree.nodes[id]?.type === "question").length;
}
