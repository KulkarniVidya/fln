/**
 * Fixed shape of each kind of paper (#593): how many questions it has and
 * where its questions come from. Kept on the backend so the frontend reads it
 * on "Generate" instead of carrying its own numbers.
 *
 * The counts are placeholders inside the 8 to 10 range the Balvatika plan
 * gives; the real figures are a pedagogy decision and change only here.
 * `levelScope` names a rule rather than a list of levels, because the levels
 * depend on the child (their class band or their current level):
 *   - 'class-band':     every level of the child's class band
 *   - 'current-level':  the child's current level and the one below it
 */
export type PaperType = 'diagnostic' | 'midline' | 'endline' | 'personalized';
export type PaperLevelScope = 'class-band' | 'current-level';

export interface PaperTypeConfig {
  paperType: PaperType;
  questionCount: number;
  levelScope: PaperLevelScope;
  /** Only questions from approved templates may be drawn (#451 gate). */
  approvedTemplatesOnly: boolean;
}

export const PAPER_TYPE_CONFIG: Readonly<Record<PaperType, PaperTypeConfig>> = {
  diagnostic:   { paperType: 'diagnostic',   questionCount: 10, levelScope: 'class-band',    approvedTemplatesOnly: true },
  midline:      { paperType: 'midline',      questionCount: 10, levelScope: 'class-band',    approvedTemplatesOnly: true },
  endline:      { paperType: 'endline',      questionCount: 10, levelScope: 'class-band',    approvedTemplatesOnly: true },
  personalized: { paperType: 'personalized', questionCount: 8,  levelScope: 'current-level', approvedTemplatesOnly: true },
};

export function getPaperTypeConfig(type: string): PaperTypeConfig | undefined {
  return Object.prototype.hasOwnProperty.call(PAPER_TYPE_CONFIG, type)
    ? PAPER_TYPE_CONFIG[type as PaperType]
    : undefined;
}
