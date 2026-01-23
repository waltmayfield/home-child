import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import {
  ACTIVITY_CATEGORIES,
  SKILLS,
  DIFFICULTY_LEVELS,
  MESS_LEVELS,
  SUPERVISION_LEVELS,
  CHILD_ACTIVITY_STATES,
  CHILD_SEXES
} from '../shared/constants';
import test from 'node:test';

// Shared prompt components for AI generations
const TAXONOMY_REFERENCE = `For categories, use these values: ${ACTIVITY_CATEGORIES.join(', ')}. For skills, use these values: ${SKILLS.join(', ')}. For difficulty levels, use: ${DIFFICULTY_LEVELS.join(', ')}. For mess levels, use: ${MESS_LEVELS.join(', ')}. For supervision levels, use: ${SUPERVISION_LEVELS.join(', ')}.`;

// Multi-line system prompt kept outside the schema so it's readable and maintainable.
// Use safe punctuation: avoid lines that start with a token followed by a colon or leading hyphen lists.
const GENERATE_ACTIVITY_PROMPT = `You are a creative assistant that generates engaging, age-appropriate activities for children.
Use the provided childDescription (if any) to honor preferences, dislikes, and special notes.
${TAXONOMY_REFERENCE}
Create a complete activity with an engaging title and detailed description, 5-10 materials (be specific),
5-10 step-by-step instructions (clear and actionable), 2-5 setting requirements, and 2-5 relevant tags for discoverability.
Base the activity on the child's age, interests, and preferences and make it developmentally appropriate.
Make it fun, educational, and suitable for the child's stage.

IMPORTANT - If existingActivityTitles are provided, create something different and unique; avoid activities that are too similar to existing ones.

To increase variety and avoid near-duplicates -
• If 'existingActivityTitles' is provided, analyze those titles for repeated themes, objects, verbs, and categories. Prefer a central theme, category, or setting that is not represented among the most frequent themes.
• It is acceptable to use only a subset of the child's interests; prioritize one or two rather than combining them all.
• Do not reuse the same dominant objects or actions (for example, trucks, painting, singing) if those appear frequently in 'existingActivityTitles'. Instead choose different objects, materials, or learning goals.
• When feasible, pick a different category than the majority of existing activities (for example, choose Music or Science if most existing activities are Arts & Crafts).
• Vary the sensory/mess level and supervision requirements compared to existing activities to increase discoverability.
• Provide diversity in materials and instructions — prefer unique materials or a different primary action (build, sort, observe, move, tell, etc.).

In addition -
• Keep the title concise (around 6-10 words) and distinctive.
• At the end of the description, add a single sentence starting with How this differs - which explains concisely why this activity is distinct from the provided existingActivityTitles.
• If a userPrompt is provided, incorporate it but still follow the uniqueness guidance above.
`;
const schema = a.schema({

  Skills: a.enum(SKILLS),

  ActivityCatigories: a.enum(ACTIVITY_CATEGORIES),

  ActivityFilter: a.customType({
    categories: a.ref('ActivityCatigories').array(),
    skills: a.ref('Skills').array(),
    difficultyLevel: a.enum(DIFFICULTY_LEVELS),
    maxDuration: a.integer(), // in minutes
    messLevel: a.enum(MESS_LEVELS),
    supervisionLevel: a.enum(SUPERVISION_LEVELS),
    ageRangeOverride: a.customType({
      minAge: a.integer(),
      maxAge: a.integer(),
    }),
  }),

  Activity: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      materials: a.string().array(),
      instructions: a.string().array(),// Markdown formatted steps
      // Reference to the unified child activity relationship
      childActivities: a.hasMany('ChildActivity', 'activityID'),
      targetAgeRange: a.customType({
        minAge: a.integer().required(),
        maxAge: a.integer().required(),
      }),

      // Enhanced taxonomy fields
      category: a.ref('ActivityCatigories').required(),

      skillsTargeted: a.ref('Skills').array().required(),

      difficultyLevel: a.enum(DIFFICULTY_LEVELS),

      duration: a.customType({
        estimatedMinutes: a.integer().required(),
        flexible: a.boolean().required(), // Can be extended/shortened
      }),

      settingRequirements: a.string().array(),

      supervisionLevel: a.enum(SUPERVISION_LEVELS),

      messLevel: a.enum(MESS_LEVELS),

      tags: a.string().array(),

      //auto-generated fields
      owner: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated(), allow.guest()]),

  Child: a
    .model({
      name: a.string().required(),
      sex: a.enum(CHILD_SEXES),
      description: a.string(),
      birthday: a.date().required(),
      interests: a.string().array(),
      // Reference to the unified child activity relationship
      activities: a.hasMany('ChildActivity', 'childID'),

      // Default filter preferences for this child
      defaultFilter: a.ref('ActivityFilter'),
    })
    .authorization((allow) => [allow.owner()]),

  // Unified model for Child-Activity relationships in all states
  ChildActivity: a
    .model({
      // Core relationship fields
      childID: a.id().required(),
      child: a.belongsTo('Child', 'childID'),
      activityID: a.id().required(),
      activity: a.belongsTo('Activity', 'activityID'),

      // State management
      state: a.enum(CHILD_ACTIVITY_STATES),

      // Scheduling fields (required when state is 'scheduled' or 'in_progress')
      scheduledAt: a.date(),

      // Completion fields (required when state is 'completed')
      completedAt: a.date().required(),
      feedback: a.customType({
        rating: a.integer().required(),
        comments: a.string().required(),
      }),

      // General fields (applicable to all states)
      notes: a.string(),
    })
    .secondaryIndexes((index) => [
      index("state").sortKeys(["completedAt"]),
    ])
    .authorization((allow) => [allow.owner()]),

  generateDefaultFilterAndInterests: a.generation({
    aiModel: {
      resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0'
    },
    systemPrompt: `You are a helpful assistant that generates activity filters and interests based on a description of a child. ${TAXONOMY_REFERENCE} Generate 3-5 interests as strings and appropriate filter settings based on the child description.`,
  })
    .arguments({ description: a.string() })
    .returns(a.customType({
      defaultFilter: a.customType({
        categories: a.string().array(),
        skills: a.string().array(),
        difficultyLevel: a.string(),
        maxDuration: a.integer(),
        messLevel: a.string(),
        supervisionLevel: a.string(),
        ageRangeOverride: a.customType({
          minAge: a.integer(),
          maxAge: a.integer(),
        }),
      }),
      interests: a.string().array(),
    }))
    .authorization((allow) => allow.authenticated()),

  generateActivityForChild: a.generation({
    aiModel: {
      resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0'
    },
    // Use a short placeholder in the schema to avoid inlining long multi-line text into the generated SDL.
    // The full prompt is kept in `GENERATE_ACTIVITY_PROMPT` above for readability and editing.
    systemPrompt: GENERATE_ACTIVITY_PROMPT,
  })
    .arguments({ 
      childName: a.string(),
      childDescription: a.string(),
      childAge: a.integer(),
      childInterests: a.string().array(),
      preferredCategories: a.string().array(),
      preferredSkills: a.string().array(),
      maxDuration: a.integer(),
      messLevel: a.string(),
      supervisionLevel: a.string(),
      existingActivityTitles: a.string().array(),
      // Optional free-text prompt from the user to inspire the generation
      userPrompt: a.string()
    })
    .returns(a.customType({
      title: a.string(),
      description: a.string(),
      materials: a.string().array(),
      instructions: a.string().array(),
      category: a.string(),
      skillsTargeted: a.string().array(),
      difficultyLevel: a.string(),
      estimatedMinutes: a.integer(),
      durationFlexible: a.boolean(),
      minAge: a.integer(),
      maxAge: a.integer(),
      settingRequirements: a.string().array(),
      supervisionLevel: a.string(),
      messLevel: a.string(),
      tags: a.string().array()
    }))
    .authorization((allow) => allow.authenticated()),


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});