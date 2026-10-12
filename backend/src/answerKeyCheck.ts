/**
 * A stored answer key has to cover the paper that was printed. If it does not,
 * a scan has nothing to compare most answers with and the score is wrong
 * without anyone being told (FLN #762). The check runs when the key is stored,
 * so an incomplete key is refused then rather than found at grading time.
 */
export interface AnswerKeyCounts {
  printedFields: number;
  questions: number;
  answerKey: number;
  answerRegions: number;
}

export function describeAnswerKey(key: { masterJson?: any; questions?: any[]; answerKey?: any[]; answerRegions?: any[] }): AnswerKeyCounts {
  return {
    printedFields: key.masterJson?.sets?.[0]?.questions?.length ?? 0,
    questions: key.questions?.length ?? 0,
    answerKey: key.answerKey?.length ?? 0,
    answerRegions: key.answerRegions?.length ?? 0,
  };
}

/** A key is usable when it has questions, an answer for each, and a region for each answer. */
export function answerKeyProblem(c: AnswerKeyCounts): string | null {
  if (c.questions === 0) return 'The stored key has no questions.';
  if (c.answerKey === 0) return 'The stored key has no answers.';
  if (c.answerRegions > 0 && c.answerKey !== c.answerRegions) {
    return `answerKey (${c.answerKey}) and answerRegions (${c.answerRegions}) differ.`;
  }
  if (c.printedFields > 0 && c.answerKey < c.printedFields) {
    return `The paper has ${c.printedFields} answer fields but the key has ${c.answerKey}.`;
  }
  return null;
}
