import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  Skills: a.enum([
    'creativity', 'critical_thinking', 'fine_motor', 'gross_motor', 
    'social_emotional', 'language_development', 'problem_solving', 
    'sensory_processing', 'self_regulation', 'collaboration', 
    'independence', 'curiosity'
  ]),

  ActivityCatigories: a.enum([
    'arts_crafts', 'science_experiments', 'outdoor_activities', 
    'cooking_baking', 'reading_literacy', 'math_numbers', 
    'music_dance', 'physical_exercise', 'building_construction',
    'dramatic_play', 'sensory_play', 'nature_exploration'
  ]),

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
      
      difficultyLevel: a.enum(['beginner', 'intermediate', 'advanced']),
      
      duration: a.customType({
        estimatedMinutes: a.integer().required(),
        flexible: a.boolean().required(), // Can be extended/shortened
      }),
      
      settingRequirements: a.string().array(),
      
      supervisionLevel: a.enum([
        'independent', 'minimal_supervision', 'active_supervision', 
        'one_on_one_required'
      ]),
      
      messLevel: a.enum(['none', 'minimal', 'moderate', 'high']),
      
      tags: a.string().array(),

      //auto-generated fields
      owner: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated(), allow.guest()]),

  Child: a
    .model({
      name: a.string().required(),
      sex: a.enum(['male','female']),
      birthday: a.date().required(),
      interests: a.string().array(),
      // Reference to the unified child activity relationship
      activities: a.hasMany('ChildActivity', 'childID'),
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
      state: a.enum(['scheduled', 'in_progress', 'completed', 'canceled']),
      
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

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
