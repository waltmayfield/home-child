/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createActivity = /* GraphQL */ `mutation CreateActivity(
  $condition: ModelActivityConditionInput
  $input: CreateActivityInput!
) {
  createActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateActivityMutationVariables,
  APITypes.CreateActivityMutation
>;
export const createChild = /* GraphQL */ `mutation CreateChild(
  $condition: ModelChildConditionInput
  $input: CreateChildInput!
) {
  createChild(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateChildMutationVariables,
  APITypes.CreateChildMutation
>;
export const createChildActivity = /* GraphQL */ `mutation CreateChildActivity(
  $condition: ModelChildActivityConditionInput
  $input: CreateChildActivityInput!
) {
  createChildActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateChildActivityMutationVariables,
  APITypes.CreateChildActivityMutation
>;
export const deleteActivity = /* GraphQL */ `mutation DeleteActivity(
  $condition: ModelActivityConditionInput
  $input: DeleteActivityInput!
) {
  deleteActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteActivityMutationVariables,
  APITypes.DeleteActivityMutation
>;
export const deleteChild = /* GraphQL */ `mutation DeleteChild(
  $condition: ModelChildConditionInput
  $input: DeleteChildInput!
) {
  deleteChild(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteChildMutationVariables,
  APITypes.DeleteChildMutation
>;
export const deleteChildActivity = /* GraphQL */ `mutation DeleteChildActivity(
  $condition: ModelChildActivityConditionInput
  $input: DeleteChildActivityInput!
) {
  deleteChildActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteChildActivityMutationVariables,
  APITypes.DeleteChildActivityMutation
>;
export const updateActivity = /* GraphQL */ `mutation UpdateActivity(
  $condition: ModelActivityConditionInput
  $input: UpdateActivityInput!
) {
  updateActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateActivityMutationVariables,
  APITypes.UpdateActivityMutation
>;
export const updateChild = /* GraphQL */ `mutation UpdateChild(
  $condition: ModelChildConditionInput
  $input: UpdateChildInput!
) {
  updateChild(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateChildMutationVariables,
  APITypes.UpdateChildMutation
>;
export const updateChildActivity = /* GraphQL */ `mutation UpdateChildActivity(
  $condition: ModelChildActivityConditionInput
  $input: UpdateChildActivityInput!
) {
  updateChildActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateChildActivityMutationVariables,
  APITypes.UpdateChildActivityMutation
>;
