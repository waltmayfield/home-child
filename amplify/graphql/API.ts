/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GenerateDefaultFilterAndInterestsReturnType = {
  __typename: "GenerateDefaultFilterAndInterestsReturnType",
  defaultFilter?: GenerateDefaultFilterAndInterestsReturnTypeDefaultFilter | null,
  interests?: Array< string | null > | null,
};

export type GenerateDefaultFilterAndInterestsReturnTypeDefaultFilter = {
  __typename: "GenerateDefaultFilterAndInterestsReturnTypeDefaultFilter",
  ageRangeOverride?: GenerateDefaultFilterAndInterestsReturnTypeDefaultFilterAgeRangeOverride | null,
  categories?: Array< string | null > | null,
  difficultyLevel?: string | null,
  maxDuration?: number | null,
  messLevel?: string | null,
  skills?: Array< string | null > | null,
  supervisionLevel?: string | null,
};

export type GenerateDefaultFilterAndInterestsReturnTypeDefaultFilterAgeRangeOverride = {
  __typename: "GenerateDefaultFilterAndInterestsReturnTypeDefaultFilterAgeRangeOverride",
  maxAge?: number | null,
  minAge?: number | null,
};

export type Activity = {
  __typename: "Activity",
  category: ActivityCatigories,
  childActivities?: ModelChildActivityConnection | null,
  createdAt?: string | null,
  description: string,
  difficultyLevel?: ActivityDifficultyLevel | null,
  duration?: ActivityDuration | null,
  id: string,
  instructions?: Array< string | null > | null,
  materials?: Array< string | null > | null,
  messLevel?: ActivityMessLevel | null,
  owner?: string | null,
  settingRequirements?: Array< string | null > | null,
  skillsTargeted: Array< Skills | null >,
  supervisionLevel?: ActivitySupervisionLevel | null,
  tags?: Array< string | null > | null,
  targetAgeRange?: ActivityTargetAgeRange | null,
  title: string,
  updatedAt: string,
};

export enum ActivityCatigories {
  arts_crafts = "arts_crafts",
  building_construction = "building_construction",
  cooking_baking = "cooking_baking",
  dramatic_play = "dramatic_play",
  math_numbers = "math_numbers",
  music_dance = "music_dance",
  nature_exploration = "nature_exploration",
  outdoor_activities = "outdoor_activities",
  physical_exercise = "physical_exercise",
  reading_literacy = "reading_literacy",
  science_experiments = "science_experiments",
  sensory_play = "sensory_play",
}


export type ModelChildActivityConnection = {
  __typename: "ModelChildActivityConnection",
  items:  Array<ChildActivity | null >,
  nextToken?: string | null,
};

export type ChildActivity = {
  __typename: "ChildActivity",
  activity?: Activity | null,
  activityID: string,
  child?: Child | null,
  childID: string,
  completedAt: string,
  createdAt: string,
  feedback?: ChildActivityFeedback | null,
  id: string,
  notes?: string | null,
  owner?: string | null,
  scheduledAt?: string | null,
  state?: ChildActivityState | null,
  updatedAt: string,
};

export type Child = {
  __typename: "Child",
  activities?: ModelChildActivityConnection | null,
  birthday: string,
  createdAt: string,
  defaultFilter?: ActivityFilter | null,
  id: string,
  interests?: Array< string | null > | null,
  name: string,
  owner?: string | null,
  sex?: ChildSex | null,
  updatedAt: string,
};

export type ActivityFilter = {
  __typename: "ActivityFilter",
  ageRangeOverride?: ActivityFilterAgeRangeOverride | null,
  categories?: Array< ActivityCatigories | null > | null,
  difficultyLevel?: ActivityFilterDifficultyLevel | null,
  maxDuration?: number | null,
  messLevel?: ActivityFilterMessLevel | null,
  skills?: Array< Skills | null > | null,
  supervisionLevel?: ActivityFilterSupervisionLevel | null,
};

export type ActivityFilterAgeRangeOverride = {
  __typename: "ActivityFilterAgeRangeOverride",
  maxAge?: number | null,
  minAge?: number | null,
};

export enum ActivityFilterDifficultyLevel {
  advanced = "advanced",
  beginner = "beginner",
  intermediate = "intermediate",
}


export enum ActivityFilterMessLevel {
  high = "high",
  minimal = "minimal",
  moderate = "moderate",
  none = "none",
}


export enum Skills {
  collaboration = "collaboration",
  creativity = "creativity",
  critical_thinking = "critical_thinking",
  curiosity = "curiosity",
  fine_motor = "fine_motor",
  gross_motor = "gross_motor",
  independence = "independence",
  language_development = "language_development",
  problem_solving = "problem_solving",
  self_regulation = "self_regulation",
  sensory_processing = "sensory_processing",
  social_emotional = "social_emotional",
}


export enum ActivityFilterSupervisionLevel {
  active_supervision = "active_supervision",
  independent = "independent",
  minimal_supervision = "minimal_supervision",
  one_on_one_required = "one_on_one_required",
}


export enum ChildSex {
  female = "female",
  male = "male",
}


export type ChildActivityFeedback = {
  __typename: "ChildActivityFeedback",
  comments: string,
  rating: number,
};

export enum ChildActivityState {
  canceled = "canceled",
  completed = "completed",
  in_progress = "in_progress",
  scheduled = "scheduled",
}


export enum ActivityDifficultyLevel {
  advanced = "advanced",
  beginner = "beginner",
  intermediate = "intermediate",
}


export type ActivityDuration = {
  __typename: "ActivityDuration",
  estimatedMinutes: number,
  flexible: boolean,
};

export enum ActivityMessLevel {
  high = "high",
  minimal = "minimal",
  moderate = "moderate",
  none = "none",
}


export enum ActivitySupervisionLevel {
  active_supervision = "active_supervision",
  independent = "independent",
  minimal_supervision = "minimal_supervision",
  one_on_one_required = "one_on_one_required",
}


export type ActivityTargetAgeRange = {
  __typename: "ActivityTargetAgeRange",
  maxAge: number,
  minAge: number,
};

export type ModelActivityFilterInput = {
  and?: Array< ModelActivityFilterInput | null > | null,
  category?: ModelActivityCatigoriesInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  difficultyLevel?: ModelActivityDifficultyLevelInput | null,
  id?: ModelIDInput | null,
  instructions?: ModelStringInput | null,
  materials?: ModelStringInput | null,
  messLevel?: ModelActivityMessLevelInput | null,
  not?: ModelActivityFilterInput | null,
  or?: Array< ModelActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  settingRequirements?: ModelStringInput | null,
  skillsTargeted?: ModelSkillsInput | null,
  supervisionLevel?: ModelActivitySupervisionLevelInput | null,
  tags?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelActivityCatigoriesInput = {
  eq?: ActivityCatigories | null,
  ne?: ActivityCatigories | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelActivityDifficultyLevelInput = {
  eq?: ActivityDifficultyLevel | null,
  ne?: ActivityDifficultyLevel | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelActivityMessLevelInput = {
  eq?: ActivityMessLevel | null,
  ne?: ActivityMessLevel | null,
};

export type ModelSkillsInput = {
  eq?: Skills | null,
  ne?: Skills | null,
};

export type ModelActivitySupervisionLevelInput = {
  eq?: ActivitySupervisionLevel | null,
  ne?: ActivitySupervisionLevel | null,
};

export type ModelActivityConnection = {
  __typename: "ModelActivityConnection",
  items:  Array<Activity | null >,
  nextToken?: string | null,
};

export type ModelChildActivityFilterInput = {
  activityID?: ModelIDInput | null,
  and?: Array< ModelChildActivityFilterInput | null > | null,
  childID?: ModelIDInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelChildActivityFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelChildActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  scheduledAt?: ModelStringInput | null,
  state?: ModelChildActivityStateInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelChildActivityStateInput = {
  eq?: ChildActivityState | null,
  ne?: ChildActivityState | null,
};

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelChildFilterInput = {
  and?: Array< ModelChildFilterInput | null > | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  interests?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelChildFilterInput | null,
  or?: Array< ModelChildFilterInput | null > | null,
  owner?: ModelStringInput | null,
  sex?: ModelChildSexInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelChildSexInput = {
  eq?: ChildSex | null,
  ne?: ChildSex | null,
};

export type ModelChildConnection = {
  __typename: "ModelChildConnection",
  items:  Array<Child | null >,
  nextToken?: string | null,
};

export type ModelActivityConditionInput = {
  and?: Array< ModelActivityConditionInput | null > | null,
  category?: ModelActivityCatigoriesInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  difficultyLevel?: ModelActivityDifficultyLevelInput | null,
  instructions?: ModelStringInput | null,
  materials?: ModelStringInput | null,
  messLevel?: ModelActivityMessLevelInput | null,
  not?: ModelActivityConditionInput | null,
  or?: Array< ModelActivityConditionInput | null > | null,
  owner?: ModelStringInput | null,
  settingRequirements?: ModelStringInput | null,
  skillsTargeted?: ModelSkillsInput | null,
  supervisionLevel?: ModelActivitySupervisionLevelInput | null,
  tags?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateActivityInput = {
  category: ActivityCatigories,
  createdAt?: string | null,
  description: string,
  difficultyLevel?: ActivityDifficultyLevel | null,
  duration?: ActivityDurationInput | null,
  id?: string | null,
  instructions?: Array< string | null > | null,
  materials?: Array< string | null > | null,
  messLevel?: ActivityMessLevel | null,
  owner?: string | null,
  settingRequirements?: Array< string | null > | null,
  skillsTargeted: Array< Skills | null >,
  supervisionLevel?: ActivitySupervisionLevel | null,
  tags?: Array< string | null > | null,
  targetAgeRange?: ActivityTargetAgeRangeInput | null,
  title: string,
};

export type ActivityDurationInput = {
  estimatedMinutes: number,
  flexible: boolean,
};

export type ActivityTargetAgeRangeInput = {
  maxAge: number,
  minAge: number,
};

export type ModelChildConditionInput = {
  and?: Array< ModelChildConditionInput | null > | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  interests?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelChildConditionInput | null,
  or?: Array< ModelChildConditionInput | null > | null,
  owner?: ModelStringInput | null,
  sex?: ModelChildSexInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateChildInput = {
  birthday: string,
  defaultFilter?: ActivityFilterInput | null,
  id?: string | null,
  interests?: Array< string | null > | null,
  name: string,
  sex?: ChildSex | null,
};

export type ActivityFilterInput = {
  ageRangeOverride?: ActivityFilterAgeRangeOverrideInput | null,
  categories?: Array< ActivityCatigories | null > | null,
  difficultyLevel?: ActivityFilterDifficultyLevel | null,
  maxDuration?: number | null,
  messLevel?: ActivityFilterMessLevel | null,
  skills?: Array< Skills | null > | null,
  supervisionLevel?: ActivityFilterSupervisionLevel | null,
};

export type ActivityFilterAgeRangeOverrideInput = {
  maxAge?: number | null,
  minAge?: number | null,
};

export type ModelChildActivityConditionInput = {
  activityID?: ModelIDInput | null,
  and?: Array< ModelChildActivityConditionInput | null > | null,
  childID?: ModelIDInput | null,
  completedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelChildActivityConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelChildActivityConditionInput | null > | null,
  owner?: ModelStringInput | null,
  scheduledAt?: ModelStringInput | null,
  state?: ModelChildActivityStateInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateChildActivityInput = {
  activityID: string,
  childID: string,
  completedAt: string,
  feedback?: ChildActivityFeedbackInput | null,
  id?: string | null,
  notes?: string | null,
  scheduledAt?: string | null,
  state?: ChildActivityState | null,
};

export type ChildActivityFeedbackInput = {
  comments: string,
  rating: number,
};

export type DeleteActivityInput = {
  id: string,
};

export type DeleteChildInput = {
  id: string,
};

export type DeleteChildActivityInput = {
  id: string,
};

export type UpdateActivityInput = {
  category?: ActivityCatigories | null,
  createdAt?: string | null,
  description?: string | null,
  difficultyLevel?: ActivityDifficultyLevel | null,
  duration?: ActivityDurationInput | null,
  id: string,
  instructions?: Array< string | null > | null,
  materials?: Array< string | null > | null,
  messLevel?: ActivityMessLevel | null,
  owner?: string | null,
  settingRequirements?: Array< string | null > | null,
  skillsTargeted?: Array< Skills | null > | null,
  supervisionLevel?: ActivitySupervisionLevel | null,
  tags?: Array< string | null > | null,
  targetAgeRange?: ActivityTargetAgeRangeInput | null,
  title?: string | null,
};

export type UpdateChildInput = {
  birthday?: string | null,
  defaultFilter?: ActivityFilterInput | null,
  id: string,
  interests?: Array< string | null > | null,
  name?: string | null,
  sex?: ChildSex | null,
};

export type UpdateChildActivityInput = {
  activityID?: string | null,
  childID?: string | null,
  completedAt?: string | null,
  feedback?: ChildActivityFeedbackInput | null,
  id: string,
  notes?: string | null,
  scheduledAt?: string | null,
  state?: ChildActivityState | null,
};

export type ModelSubscriptionActivityFilterInput = {
  and?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  category?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  difficultyLevel?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  instructions?: ModelSubscriptionStringInput | null,
  materials?: ModelSubscriptionStringInput | null,
  messLevel?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  owner?: ModelSubscriptionStringInput | null,
  settingRequirements?: ModelSubscriptionStringInput | null,
  skillsTargeted?: ModelSubscriptionStringInput | null,
  supervisionLevel?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionChildFilterInput = {
  and?: Array< ModelSubscriptionChildFilterInput | null > | null,
  birthday?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  interests?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionChildFilterInput | null > | null,
  owner?: ModelStringInput | null,
  sex?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionChildActivityFilterInput = {
  activityID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionChildActivityFilterInput | null > | null,
  childID?: ModelSubscriptionIDInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionChildActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  scheduledAt?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GenerateDefaultFilterAndInterestsQueryVariables = {
  description?: string | null,
};

export type GenerateDefaultFilterAndInterestsQuery = {
  generateDefaultFilterAndInterests?:  {
    __typename: "GenerateDefaultFilterAndInterestsReturnType",
    defaultFilter?:  {
      __typename: "GenerateDefaultFilterAndInterestsReturnTypeDefaultFilter",
      categories?: Array< string | null > | null,
      difficultyLevel?: string | null,
      maxDuration?: number | null,
      messLevel?: string | null,
      skills?: Array< string | null > | null,
      supervisionLevel?: string | null,
    } | null,
    interests?: Array< string | null > | null,
  } | null,
};

export type GetActivityQueryVariables = {
  id: string,
};

export type GetActivityQuery = {
  getActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type GetChildQueryVariables = {
  id: string,
};

export type GetChildQuery = {
  getChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type GetChildActivityQueryVariables = {
  id: string,
};

export type GetChildActivityQuery = {
  getChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type ListActivitiesQueryVariables = {
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActivitiesQuery = {
  listActivities?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListChildActivitiesQueryVariables = {
  filter?: ModelChildActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChildActivitiesQuery = {
  listChildActivities?:  {
    __typename: "ModelChildActivityConnection",
    items:  Array< {
      __typename: "ChildActivity",
      activityID: string,
      childID: string,
      completedAt: string,
      createdAt: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      scheduledAt?: string | null,
      state?: ChildActivityState | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListChildActivityByStateAndCompletedAtQueryVariables = {
  completedAt?: ModelStringKeyConditionInput | null,
  filter?: ModelChildActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  state: ChildActivityState,
};

export type ListChildActivityByStateAndCompletedAtQuery = {
  listChildActivityByStateAndCompletedAt?:  {
    __typename: "ModelChildActivityConnection",
    items:  Array< {
      __typename: "ChildActivity",
      activityID: string,
      childID: string,
      completedAt: string,
      createdAt: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      scheduledAt?: string | null,
      state?: ChildActivityState | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListChildrenQueryVariables = {
  filter?: ModelChildFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChildrenQuery = {
  listChildren?:  {
    __typename: "ModelChildConnection",
    items:  Array< {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: CreateActivityInput,
};

export type CreateActivityMutation = {
  createActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type CreateChildMutationVariables = {
  condition?: ModelChildConditionInput | null,
  input: CreateChildInput,
};

export type CreateChildMutation = {
  createChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type CreateChildActivityMutationVariables = {
  condition?: ModelChildActivityConditionInput | null,
  input: CreateChildActivityInput,
};

export type CreateChildActivityMutation = {
  createChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type DeleteActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: DeleteActivityInput,
};

export type DeleteActivityMutation = {
  deleteActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type DeleteChildMutationVariables = {
  condition?: ModelChildConditionInput | null,
  input: DeleteChildInput,
};

export type DeleteChildMutation = {
  deleteChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type DeleteChildActivityMutationVariables = {
  condition?: ModelChildActivityConditionInput | null,
  input: DeleteChildActivityInput,
};

export type DeleteChildActivityMutation = {
  deleteChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type UpdateActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: UpdateActivityInput,
};

export type UpdateActivityMutation = {
  updateActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type UpdateChildMutationVariables = {
  condition?: ModelChildConditionInput | null,
  input: UpdateChildInput,
};

export type UpdateChildMutation = {
  updateChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type UpdateChildActivityMutationVariables = {
  condition?: ModelChildActivityConditionInput | null,
  input: UpdateChildActivityInput,
};

export type UpdateChildActivityMutation = {
  updateChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type OnCreateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnCreateActivitySubscription = {
  onCreateActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type OnCreateChildSubscriptionVariables = {
  filter?: ModelSubscriptionChildFilterInput | null,
  owner?: string | null,
};

export type OnCreateChildSubscription = {
  onCreateChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type OnCreateChildActivitySubscriptionVariables = {
  filter?: ModelSubscriptionChildActivityFilterInput | null,
  owner?: string | null,
};

export type OnCreateChildActivitySubscription = {
  onCreateChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnDeleteActivitySubscription = {
  onDeleteActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteChildSubscriptionVariables = {
  filter?: ModelSubscriptionChildFilterInput | null,
  owner?: string | null,
};

export type OnDeleteChildSubscription = {
  onDeleteChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteChildActivitySubscriptionVariables = {
  filter?: ModelSubscriptionChildActivityFilterInput | null,
  owner?: string | null,
};

export type OnDeleteChildActivitySubscription = {
  onDeleteChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnUpdateActivitySubscription = {
  onUpdateActivity?:  {
    __typename: "Activity",
    category: ActivityCatigories,
    childActivities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    description: string,
    difficultyLevel?: ActivityDifficultyLevel | null,
    duration?:  {
      __typename: "ActivityDuration",
      estimatedMinutes: number,
      flexible: boolean,
    } | null,
    id: string,
    instructions?: Array< string | null > | null,
    materials?: Array< string | null > | null,
    messLevel?: ActivityMessLevel | null,
    owner?: string | null,
    settingRequirements?: Array< string | null > | null,
    skillsTargeted: Array< Skills | null >,
    supervisionLevel?: ActivitySupervisionLevel | null,
    tags?: Array< string | null > | null,
    targetAgeRange?:  {
      __typename: "ActivityTargetAgeRange",
      maxAge: number,
      minAge: number,
    } | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateChildSubscriptionVariables = {
  filter?: ModelSubscriptionChildFilterInput | null,
  owner?: string | null,
};

export type OnUpdateChildSubscription = {
  onUpdateChild?:  {
    __typename: "Child",
    activities?:  {
      __typename: "ModelChildActivityConnection",
      nextToken?: string | null,
    } | null,
    birthday: string,
    createdAt: string,
    defaultFilter?:  {
      __typename: "ActivityFilter",
      categories?: Array< ActivityCatigories | null > | null,
      difficultyLevel?: ActivityFilterDifficultyLevel | null,
      maxDuration?: number | null,
      messLevel?: ActivityFilterMessLevel | null,
      skills?: Array< Skills | null > | null,
      supervisionLevel?: ActivityFilterSupervisionLevel | null,
    } | null,
    id: string,
    interests?: Array< string | null > | null,
    name: string,
    owner?: string | null,
    sex?: ChildSex | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateChildActivitySubscriptionVariables = {
  filter?: ModelSubscriptionChildActivityFilterInput | null,
  owner?: string | null,
};

export type OnUpdateChildActivitySubscription = {
  onUpdateChildActivity?:  {
    __typename: "ChildActivity",
    activity?:  {
      __typename: "Activity",
      category: ActivityCatigories,
      createdAt?: string | null,
      description: string,
      difficultyLevel?: ActivityDifficultyLevel | null,
      id: string,
      instructions?: Array< string | null > | null,
      materials?: Array< string | null > | null,
      messLevel?: ActivityMessLevel | null,
      owner?: string | null,
      settingRequirements?: Array< string | null > | null,
      skillsTargeted: Array< Skills | null >,
      supervisionLevel?: ActivitySupervisionLevel | null,
      tags?: Array< string | null > | null,
      title: string,
      updatedAt: string,
    } | null,
    activityID: string,
    child?:  {
      __typename: "Child",
      birthday: string,
      createdAt: string,
      id: string,
      interests?: Array< string | null > | null,
      name: string,
      owner?: string | null,
      sex?: ChildSex | null,
      updatedAt: string,
    } | null,
    childID: string,
    completedAt: string,
    createdAt: string,
    feedback?:  {
      __typename: "ChildActivityFeedback",
      comments: string,
      rating: number,
    } | null,
    id: string,
    notes?: string | null,
    owner?: string | null,
    scheduledAt?: string | null,
    state?: ChildActivityState | null,
    updatedAt: string,
  } | null,
};
