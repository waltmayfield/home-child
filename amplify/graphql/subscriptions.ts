/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateActivity = /* GraphQL */ `subscription OnCreateActivity($filter: ModelSubscriptionActivityFilterInput) {
  onCreateActivity(filter: $filter) {
    category
    childActivities {
      nextToken
      __typename
    }
    createdAt
    description
    difficultyLevel
    duration {
      estimatedMinutes
      flexible
      __typename
    }
    id
    instructions
    materials
    messLevel
    owner
    settingRequirements
    skillsTargeted
    supervisionLevel
    tags
    targetAgeRange {
      maxAge
      minAge
      __typename
    }
    title
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateActivitySubscriptionVariables,
  APITypes.OnCreateActivitySubscription
>;
export const onCreateChild = /* GraphQL */ `subscription OnCreateChild(
  $filter: ModelSubscriptionChildFilterInput
  $owner: String
) {
  onCreateChild(filter: $filter, owner: $owner) {
    activities {
      nextToken
      __typename
    }
    birthday
    createdAt
    id
    interests
    name
    owner
    sex
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateChildSubscriptionVariables,
  APITypes.OnCreateChildSubscription
>;
export const onCreateChildActivity = /* GraphQL */ `subscription OnCreateChildActivity(
  $filter: ModelSubscriptionChildActivityFilterInput
  $owner: String
) {
  onCreateChildActivity(filter: $filter, owner: $owner) {
    activity {
      category
      createdAt
      description
      difficultyLevel
      id
      instructions
      materials
      messLevel
      owner
      settingRequirements
      skillsTargeted
      supervisionLevel
      tags
      title
      updatedAt
      __typename
    }
    activityID
    child {
      birthday
      createdAt
      id
      interests
      name
      owner
      sex
      updatedAt
      __typename
    }
    childID
    completedAt
    createdAt
    feedback {
      comments
      rating
      __typename
    }
    id
    notes
    owner
    scheduledAt
    state
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateChildActivitySubscriptionVariables,
  APITypes.OnCreateChildActivitySubscription
>;
export const onDeleteActivity = /* GraphQL */ `subscription OnDeleteActivity($filter: ModelSubscriptionActivityFilterInput) {
  onDeleteActivity(filter: $filter) {
    category
    childActivities {
      nextToken
      __typename
    }
    createdAt
    description
    difficultyLevel
    duration {
      estimatedMinutes
      flexible
      __typename
    }
    id
    instructions
    materials
    messLevel
    owner
    settingRequirements
    skillsTargeted
    supervisionLevel
    tags
    targetAgeRange {
      maxAge
      minAge
      __typename
    }
    title
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteActivitySubscriptionVariables,
  APITypes.OnDeleteActivitySubscription
>;
export const onDeleteChild = /* GraphQL */ `subscription OnDeleteChild(
  $filter: ModelSubscriptionChildFilterInput
  $owner: String
) {
  onDeleteChild(filter: $filter, owner: $owner) {
    activities {
      nextToken
      __typename
    }
    birthday
    createdAt
    id
    interests
    name
    owner
    sex
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteChildSubscriptionVariables,
  APITypes.OnDeleteChildSubscription
>;
export const onDeleteChildActivity = /* GraphQL */ `subscription OnDeleteChildActivity(
  $filter: ModelSubscriptionChildActivityFilterInput
  $owner: String
) {
  onDeleteChildActivity(filter: $filter, owner: $owner) {
    activity {
      category
      createdAt
      description
      difficultyLevel
      id
      instructions
      materials
      messLevel
      owner
      settingRequirements
      skillsTargeted
      supervisionLevel
      tags
      title
      updatedAt
      __typename
    }
    activityID
    child {
      birthday
      createdAt
      id
      interests
      name
      owner
      sex
      updatedAt
      __typename
    }
    childID
    completedAt
    createdAt
    feedback {
      comments
      rating
      __typename
    }
    id
    notes
    owner
    scheduledAt
    state
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteChildActivitySubscriptionVariables,
  APITypes.OnDeleteChildActivitySubscription
>;
export const onUpdateActivity = /* GraphQL */ `subscription OnUpdateActivity($filter: ModelSubscriptionActivityFilterInput) {
  onUpdateActivity(filter: $filter) {
    category
    childActivities {
      nextToken
      __typename
    }
    createdAt
    description
    difficultyLevel
    duration {
      estimatedMinutes
      flexible
      __typename
    }
    id
    instructions
    materials
    messLevel
    owner
    settingRequirements
    skillsTargeted
    supervisionLevel
    tags
    targetAgeRange {
      maxAge
      minAge
      __typename
    }
    title
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateActivitySubscriptionVariables,
  APITypes.OnUpdateActivitySubscription
>;
export const onUpdateChild = /* GraphQL */ `subscription OnUpdateChild(
  $filter: ModelSubscriptionChildFilterInput
  $owner: String
) {
  onUpdateChild(filter: $filter, owner: $owner) {
    activities {
      nextToken
      __typename
    }
    birthday
    createdAt
    id
    interests
    name
    owner
    sex
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateChildSubscriptionVariables,
  APITypes.OnUpdateChildSubscription
>;
export const onUpdateChildActivity = /* GraphQL */ `subscription OnUpdateChildActivity(
  $filter: ModelSubscriptionChildActivityFilterInput
  $owner: String
) {
  onUpdateChildActivity(filter: $filter, owner: $owner) {
    activity {
      category
      createdAt
      description
      difficultyLevel
      id
      instructions
      materials
      messLevel
      owner
      settingRequirements
      skillsTargeted
      supervisionLevel
      tags
      title
      updatedAt
      __typename
    }
    activityID
    child {
      birthday
      createdAt
      id
      interests
      name
      owner
      sex
      updatedAt
      __typename
    }
    childID
    completedAt
    createdAt
    feedback {
      comments
      rating
      __typename
    }
    id
    notes
    owner
    scheduledAt
    state
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateChildActivitySubscriptionVariables,
  APITypes.OnUpdateChildActivitySubscription
>;
