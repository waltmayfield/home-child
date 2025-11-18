import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  Activity: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      
    })
    .authorization((allow) => [allow.authenticated(), allow.guest()]),

  CompletedActivity: a
    .model({
      activityID: a.id().required(),
      completedAt: a.date().required(),
      feedback: a.customType({
        rating: a.integer().required(),
        comments: a.string().required(),
      })
    })
    .authorization((allow) => [allow.owner()]),

  Child: a
    .model({
      name: a.string().required(),
      sex: a.enum(['male','female']),
      birthday: a.date().required(),
      interests: a.string().array(),

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
