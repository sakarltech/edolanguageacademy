/**
 * Curriculum structure for all three course levels
 * Each module maps to specific weeks and contains learning content
 */

export interface Module {
  moduleNumber: number;
  title: string;
  weeks: number[]; // Array of week numbers this module covers
  description: string;
  learningOutcomes: string[];
}

export interface CurriculumLevel {
  level: "beginner" | "intermediary" | "proficient";
  totalWeeks: number;
  modules: Module[];
}

export const BEGINNER_CURRICULUM: CurriculumLevel = {
  level: "beginner",
  totalWeeks: 8,
  modules: [
    {
      moduleNumber: 1,
      title: "Introduction to Edo Alphabet and Basic Sounds",
      weeks: [1, 2],
      description:
        "Master the fundamentals of Edo phonetics and alphabet. Learn proper pronunciation and basic sound patterns.",
      learningOutcomes: [
        "Recognize and pronounce all Edo alphabet letters",
        "Understand basic sound combinations",
        "Practice proper pronunciation techniques",
        "Build foundation for reading Edo text",
      ],
    },
    {
      moduleNumber: 2,
      title: "Numbers in Edo (1–30)",
      weeks: [3],
      description:
        "Learn to count from 1 to 30 in Edo. Understand number formation patterns and practice using numbers in context.",
      learningOutcomes: [
        "Count from 1 to 30 fluently in Edo",
        "Understand number formation patterns",
        "Use numbers in basic sentences",
        "Apply numbers in everyday situations",
      ],
    },
    {
      moduleNumber: 3,
      title: "Basic Greetings and Responses",
      weeks: [4],
      description:
        "Master essential greetings for different times of day and social contexts. Learn appropriate responses and cultural etiquette.",
      learningOutcomes: [
        "Greet people appropriately in various contexts",
        "Respond to greetings with proper phrases",
        "Understand cultural nuances of Edo greetings",
        "Practice conversational exchanges",
      ],
    },
    {
      moduleNumber: 4,
      title: "Basic Vocabulary in Edo",
      weeks: [5, 6],
      description:
        "Build your essential Edo vocabulary covering everyday objects, family members, common actions, and basic descriptive words.",
      learningOutcomes: [
        "Identify common household items in Edo",
        "Name family members and relationships",
        "Use basic action verbs in sentences",
        "Describe objects using simple adjectives",
      ],
    },
  ],
};

export const INTERMEDIARY_CURRICULUM: CurriculumLevel = {
  level: "intermediary",
  totalWeeks: 8,
  modules: [
    {
      moduleNumber: 1,
      title: "Advanced Alphabets and Pronunciations",
      weeks: [1],
      description:
        "Deepen your understanding of Edo phonetics with advanced pronunciation techniques, tone patterns, and complex sound combinations.",
      learningOutcomes: [
        "Master advanced pronunciation techniques",
        "Understand and apply tone patterns correctly",
        "Recognize subtle sound distinctions",
        "Improve accent and fluency",
      ],
    },
    {
      moduleNumber: 2,
      title: "Numbers in Edo (31–60)",
      weeks: [2],
      description:
        "Expand your number knowledge from 31 to 60. Learn higher number patterns and practice using them in practical contexts.",
      learningOutcomes: [
        "Count from 31 to 60 fluently",
        "Understand higher number formation rules",
        "Use numbers in complex sentences",
        "Apply numbers in real-world scenarios",
      ],
    },
    {
      moduleNumber: 3,
      title: "Sentence Formulation",
      weeks: [3, 4],
      description:
        "Learn to construct proper Edo sentences with correct grammar, word order, and sentence structure. Practice forming questions and statements.",
      learningOutcomes: [
        "Construct grammatically correct sentences",
        "Understand Edo sentence structure and word order",
        "Form questions and negative statements",
        "Express ideas clearly in complete sentences",
      ],
    },
    {
      moduleNumber: 4,
      title: "Introduction to Edo History and Proverbs",
      weeks: [5, 6],
      description:
        "Explore the rich cultural heritage of the Edo people through historical context and traditional proverbs. Understand the wisdom embedded in Edo sayings.",
      learningOutcomes: [
        "Understand key aspects of Edo history",
        "Learn and interpret traditional Edo proverbs",
        "Appreciate cultural context of the language",
        "Use proverbs appropriately in conversation",
      ],
    },
  ],
};

export const PROFICIENT_CURRICULUM: CurriculumLevel = {
  level: "proficient",
  totalWeeks: 8,
  modules: [
    {
      moduleNumber: 1,
      title: "Advanced Grammar and Complex Sentences",
      weeks: [1],
      description:
        "Master advanced grammatical structures, complex sentence formation, and sophisticated language patterns for fluent communication.",
      learningOutcomes: [
        "Use advanced grammatical structures correctly",
        "Form complex and compound sentences",
        "Express nuanced ideas and opinions",
        "Demonstrate near-native fluency",
      ],
    },
    {
      moduleNumber: 2,
      title: "Cultural Expressions and Idioms",
      weeks: [2],
      description:
        "Learn authentic Edo idioms, expressions, and cultural phrases that native speakers use in everyday conversation.",
      learningOutcomes: [
        "Understand and use common Edo idioms",
        "Recognize cultural expressions in context",
        "Communicate more naturally and authentically",
        "Appreciate linguistic nuances",
      ],
    },
    {
      moduleNumber: 3,
      title: "Advanced Conversation and Storytelling",
      weeks: [3, 4],
      description:
        "Develop advanced conversational skills and learn the art of storytelling in Edo. Practice extended dialogue and narrative techniques.",
      learningOutcomes: [
        "Engage in extended conversations confidently",
        "Tell stories and narratives in Edo",
        "Use appropriate discourse markers",
        "Maintain fluent dialogue on various topics",
      ],
    },
    {
      moduleNumber: 4,
      title: "Edo Literature and Advanced Cultural Studies",
      weeks: [5, 6],
      description:
        "Explore Edo literature, poetry, and advanced cultural concepts. Achieve mastery-level understanding of the language and culture.",
      learningOutcomes: [
        "Read and analyze Edo literary texts",
        "Understand advanced cultural concepts",
        "Appreciate Edo poetry and oral traditions",
        "Achieve cultural and linguistic mastery",
      ],
    },
  ],
};

export const ALL_CURRICULA = {
  beginner: BEGINNER_CURRICULUM,
  intermediary: INTERMEDIARY_CURRICULUM,
  proficient: PROFICIENT_CURRICULUM,
};

/**
 * Get module information for a specific week and level
 */
export function getModuleForWeek(
  level: "beginner" | "intermediary" | "proficient",
  week: number
): Module | undefined {
  const curriculum = ALL_CURRICULA[level];
  return curriculum.modules.find((module) => module.weeks.includes(week));
}

/**
 * Get all modules for a specific level
 */
export function getModulesForLevel(
  level: "beginner" | "intermediary" | "proficient"
): Module[] {
  return ALL_CURRICULA[level].modules;
}
