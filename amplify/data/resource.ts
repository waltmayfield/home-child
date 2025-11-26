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
    // aiModel: a.ai.model('Claude Sonnet 4'),
    aiModel: {
      resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0'
    },
    systemPrompt: `You are a helpful assistant that generates activity filters and interests based on a description of a child. 
    
    For categories, use these values: ${ACTIVITY_CATEGORIES.join(', ')}.
    For skills, use these values: ${SKILLS.join(', ')}.
    For difficulty levels, use: beginner, intermediate, advanced.
    For mess levels, use: none, minimal, moderate, high.
    For supervision levels, use: independent, minimal_supervision, moderate_supervision, close_supervision.
    
    Generate 3-5 interests as strings and appropriate filter settings based on the child description.`,
  })
    .arguments({ description: a.string() })
    .returns(a.customType({
      // test: a.string()
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

  //   generateRecipe: a.generation({
  //   aiModel: {
  //     resourcePath: 'us.anthropic.claude-3-5-sonnet-20241022-v2:0'
  //   },
  //   // aiModel: a.ai.model('Claude 3 Haiku'),
  //   systemPrompt: 'You are a helpful assistant that generates recipes.',
  // })
  //   .arguments({ description: a.string() })
  //   .returns(
  //     a.customType({
  //       name: a.string(),
  //       ingredients: a.string().array(),
  //       instructions: a.string(),
  //     })
  //   )
  //   .authorization((allow) => allow.authenticated())

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
