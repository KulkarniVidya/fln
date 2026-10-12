import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeAnswerKey, answerKeyProblem } from '../src/answerKeyCheck';

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ question_id: `q${i + 1}`, answer: String(i) }));

test('the stub key from the issue (1 question, 38 printed fields) is refused', () => {
  const c = describeAnswerKey({
    masterJson: { sets: [{ questions: items(38) }] },
    questions: items(1), answerKey: items(1), answerRegions: [],
  });
  assert.deepEqual(c, { printedFields: 38, questions: 1, answerKey: 1, answerRegions: 0 });
  assert.match(answerKeyProblem(c)!, /38 answer fields but the key has 1/);
});

test('a key with no questions or no answers is refused', () => {
  assert.match(answerKeyProblem({ printedFields: 0, questions: 0, answerKey: 0, answerRegions: 0 })!, /no questions/);
  assert.match(answerKeyProblem({ printedFields: 0, questions: 3, answerKey: 0, answerRegions: 0 })!, /no answers/);
});

test('answerKey and answerRegions that differ are refused', () => {
  assert.match(answerKeyProblem({ printedFields: 0, questions: 10, answerKey: 10, answerRegions: 9 })!, /differ/);
});

test('a 10-question key with 10 answers and 10 regions is accepted', () => {
  const c = describeAnswerKey({ masterJson: { sets: [{ questions: items(10) }] }, questions: items(10), answerKey: items(10), answerRegions: items(10) });
  assert.equal(answerKeyProblem(c), null);
});

test('a key with no layout information and no regions is accepted', () => {
  assert.equal(answerKeyProblem(describeAnswerKey({ questions: items(5), answerKey: items(5) })), null);
});

test('missing fields count as zero', () => {
  assert.deepEqual(describeAnswerKey({}), { printedFields: 0, questions: 0, answerKey: 0, answerRegions: 0 });
});
