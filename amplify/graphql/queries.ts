/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const generateDefaultFilterAndInterests = /* GraphQL */ `query GenerateDefaultFilterAndInterests($description: String) {
  generateDefaultFilterAndInterests(description: $description) {
    defaultFilter {
      categories
      difficultyLevel
      maxDuration
      messLevel
      skills
      supervisionLevel
      __typename
    }
    interests
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GenerateDefaultFilterAndInterestsQueryVariables,
  APITypes.GenerateDefaultFilterAndInterestsQuery
>;
export const getActivity = /* GraphQL */ `query GetActivity($id: ID!) {
  getActivity(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetActivityQueryVariables,
  APITypes.GetActivityQuery
>;
export const getChild = /* GraphQL */ `query GetChild($id: ID!) {
  getChild(id: $id) {
    activities {
      nextToken
      __typename
    }
    birthday
    createdAt
    defaultFilter {
      categories
      difficultyLevel
      maxDuration
      messLevel
      skills
      supervisionLevel
      __typename
    }
    id
    interests
    name
    owner
    sex
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetChildQueryVariables, APITypes.GetChildQuery>;
export const getChildActivity = /* GraphQL */ `query GetChildActivity($id: ID!) {
  getChildActivity(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetChildActivityQueryVariables,
  APITypes.GetChildActivityQuery
>;
export const listActivities = /* GraphQL */ `query ListActivities(
  $filter: ModelActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActivitiesQueryVariables,
  APITypes.ListActivitiesQuery
>;
export const listChildActivities = /* GraphQL */ `query ListChildActivities(
  $filter: ModelChildActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listChildActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      activityID
      childID
      completedAt
      createdAt
      id
      notes
      owner
      scheduledAt
      state
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChildActivitiesQueryVariables,
  APITypes.ListChildActivitiesQuery
>;
export const listChildActivityByStateAndCompletedAt = /* GraphQL */ `query ListChildActivityByStateAndCompletedAt(
  $completedAt: ModelStringKeyConditionInput
  $filter: ModelChildActivityFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $state: ChildActivityState!
) {
  listChildActivityByStateAndCompletedAt(
    completedAt: $completedAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    state: $state
  ) {
    items {
      activityID
      childID
      completedAt
      createdAt
      id
      notes
      owner
      scheduledAt
      state
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChildActivityByStateAndCompletedAtQueryVariables,
  APITypes.ListChildActivityByStateAndCompletedAtQuery
>;
export const listChildren = /* GraphQL */ `query ListChildren(
  $filter: ModelChildFilterInput
  $limit: Int
  $nextToken: String
) {
  listChildren(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChildrenQueryVariables,
  APITypes.ListChildrenQuery
>;
