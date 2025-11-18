import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  Activity: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      materials: a.string().array(),
      instructions: a.string().array(),// Markdown formatted steps
      completedActivities: a.hasMany('CompletedActivity', 'activityID'),
      scheduledActivities: a.hasMany('ScheduledActivity', 'activityID'),
      targetAgeRange: a.customType({
        minAge: a.integer().required(),
        maxAge: a.integer().required(),
      }),
      tags: a.string().array(),
    })
    .authorization((allow) => [allow.authenticated(), allow.guest()]),

  CompletedActivity: a
    .model({
      activityID: a.id().required(),
      activity: a.belongsTo('Activity', 'activityID'),
      completedAt: a.date().required(),
      feedback: a.customType({
        rating: a.integer().required(),
        comments: a.string().required(),
      }),
      // Reference to the join table for many-to-many with Child
      children: a.hasMany('ChildCompletedActivity', 'completedActivityID'),
    })
    .authorization((allow) => [allow.owner()]),

  Child: a
    .model({
      name: a.string().required(),
      sex: a.enum(['male','female']),
      birthday: a.date().required(),
      interests: a.string().array(),
      // Reference to scheduled activities
      scheduledActivities: a.hasMany('ScheduledActivity', 'childID'),
      // Reference to the join table for many-to-many with CompletedActivity
      completedActivities: a.hasMany('ChildCompletedActivity', 'childID'),
    })
    .authorization((allow) => [allow.owner()]),

  // Join table for many-to-many relationship between Child and CompletedActivity
  ChildCompletedActivity: a
    .model({
      // Reference fields to both ends of the many-to-many relationship
      childID: a.id().required(),
      completedActivityID: a.id().required(),
      // Relationship fields to both ends using their respective reference fields
      child: a.belongsTo('Child', 'childID'),
      completedActivity: a.belongsTo('CompletedActivity', 'completedActivityID'),
      // Additional fields specific to this relationship
      participationLevel: a.enum(['full', 'partial', 'observer']),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Renamed from ChildActivity to ScheduledActivity to better reflect its purpose
  ScheduledActivity: a
    .model({
      childID: a.id().required(),
      child: a.belongsTo('Child', 'childID'),
      activityID: a.id().required(),
      activity: a.belongsTo('Activity', 'activityID'),
      scheduledAt: a.date().required(),
      status: a.enum(['scheduled','completed','canceled']),
    })
    .authorization((allow) => [allow.owner()]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
