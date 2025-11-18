import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Child: a
    .model({
      name: a.string(),
      sex: a.enum(['male','female']),
      birthday: a.date(),
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
