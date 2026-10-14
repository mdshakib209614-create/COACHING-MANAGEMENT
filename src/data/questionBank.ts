import { QuestionItem } from '../types';
import { physicsQuestions } from './questions/physicsQuestions';
import { chemistryQuestions } from './questions/chemistryQuestions';
import { mathQuestions } from './questions/mathQuestions';
import { higherMathQuestions } from './questions/higherMathQuestions';
import { biologyQuestions } from './questions/biologyQuestions';
import { ictQuestions } from './questions/ictQuestions';

import { physicsCQQuestions } from './cq/physicsCQ';
import { chemistryCQQuestions } from './cq/chemistryCQ';
import { mathCQQuestions } from './cq/mathCQ';
import { higherMathCQQuestions } from './cq/higherMathCQ';
import { biologyCQQuestions } from './cq/biologyCQ';
import { ictCQQuestions } from './cq/ictCQ';
import { allShortQuestions } from './shortQuestions';
import { generateSubjectQuestions } from './questionGenerator';

// Generate 1000+ MCQs per subject
export const allPhysicsQuestions = generateSubjectQuestions('পদার্থবিজ্ঞান', physicsQuestions, 1000);
export const allChemistryQuestions = generateSubjectQuestions('রসায়ন', chemistryQuestions, 1000);
export const allMathQuestions = generateSubjectQuestions('সাধারণ গণিত', mathQuestions, 1000);
export const allHigherMathQuestions = generateSubjectQuestions('উচ্চতর গণিত', higherMathQuestions, 1000);
export const allBiologyQuestions = generateSubjectQuestions('জীববিজ্ঞান', biologyQuestions, 1000);
export const allIctQuestions = generateSubjectQuestions('তথ্য ও যোগাযোগ প্রযুক্তি', ictQuestions, 1000);

export const initialQuestionBank: QuestionItem[] = [
  ...allPhysicsQuestions,
  ...physicsCQQuestions,
  ...allChemistryQuestions,
  ...chemistryCQQuestions,
  ...allMathQuestions,
  ...mathCQQuestions,
  ...allHigherMathQuestions,
  ...higherMathCQQuestions,
  ...allBiologyQuestions,
  ...biologyCQQuestions,
  ...allIctQuestions,
  ...ictCQQuestions,
  ...allShortQuestions
];

export { subjectsList, chaptersBySubject } from './chaptersData';
