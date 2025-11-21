/**
 * Shared constants for activity data across frontend and backend
 * These constants ensure consistency between the data schema and UI components
 */

export const ACTIVITY_CATEGORIES = [
  'arts_crafts',
  'science_experiments', 
  'outdoor_activities',
  'cooking_baking',
  'reading_literacy',
  'math_numbers',
  'music_dance',
  'physical_exercise',
  'building_construction',
  'dramatic_play',
  'sensory_play',
  'nature_exploration'
] as const;

export const SKILLS = [
  'creativity',
  'critical_thinking',
  'fine_motor',
  'gross_motor',
  'social_emotional',
  'language_development',
  'problem_solving',
  'sensory_processing',
  'self_regulation',
  'collaboration',
  'independence',
  'curiosity'
] as const;

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

export const MESS_LEVELS = [
  'none',
  'minimal',
  'moderate',
  'high'
] as const;

export const SUPERVISION_LEVELS = [
  'independent',
  'minimal_supervision',
  'active_supervision',
  'one_on_one_required'
] as const;

export const CHILD_ACTIVITY_STATES = [
  'scheduled',
  'in_progress',
  'completed',
  'canceled'
] as const;

export const CHILD_SEXES = [
  'male',
  'female'
] as const;

// Type definitions for TypeScript
export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number];
export type Skill = typeof SKILLS[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type MessLevel = typeof MESS_LEVELS[number];
export type SupervisionLevel = typeof SUPERVISION_LEVELS[number];
export type ChildActivityState = typeof CHILD_ACTIVITY_STATES[number];
export type ChildSex = typeof CHILD_SEXES[number];

// Default filter types for Child model
export interface DefaultChildFilter {
  categories?: ActivityCategory[];
  skills?: Skill[];
  difficultyLevel?: DifficultyLevel;
  maxDuration?: number; // in minutes
  messLevel?: MessLevel;
  supervisionLevel?: SupervisionLevel;
  ageRangeOverride?: {
    minAge?: number;
    maxAge?: number;
  };
}

// Frontend filter interface (extends default with additional frontend-only fields)
export interface ActivityFilters extends Omit<DefaultChildFilter, 'categories'> {
  category?: ActivityCategory; // Single category for UI filters
  categories?: ActivityCategory[]; // Multiple categories from defaults
  difficultyLevel?: DifficultyLevel;
  minAge?: number;
  maxAge?: number;
  searchTerm?: string;
}

// Helper functions for formatting
export const formatCategory = (category: string): string => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatDifficulty = (difficulty: string): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

export const formatSupervisionLevel = (level: string): string => {
  return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatSkill = (skill: string): string => {
  return skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getMessLevelColor = (messLevel: string): string => {
  switch (messLevel) {
    case 'none':
      return 'bg-green-100 text-green-800';
    case 'minimal':
      return 'bg-blue-100 text-blue-800';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Utility functions for working with child default filters
export const calculateChildAge = (birthday: string): number => {
  // Add time component to avoid timezone issues
  const birthDate = new Date(birthday + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const createDefaultFilterFromChild = (child: {
  birthday: string;
  interests?: string[] | null;
  defaultFilter?: DefaultChildFilter | null;
}): ActivityFilters => {
  const age = calculateChildAge(child.birthday);
  
  // Start with child's saved default filter or empty filter
  const baseFilter: ActivityFilters = {};
  
  if (child.defaultFilter) {
    // Map from DefaultChildFilter to ActivityFilters
    baseFilter.categories = child.defaultFilter.categories;
    baseFilter.skills = child.defaultFilter.skills;
    baseFilter.difficultyLevel = child.defaultFilter.difficultyLevel;
    baseFilter.maxDuration = child.defaultFilter.maxDuration;
    baseFilter.messLevel = child.defaultFilter.messLevel;
    baseFilter.supervisionLevel = child.defaultFilter.supervisionLevel;
    
    // Handle age range override
    if (child.defaultFilter.ageRangeOverride?.minAge || child.defaultFilter.ageRangeOverride?.maxAge) {
      baseFilter.minAge = child.defaultFilter.ageRangeOverride.minAge;
      baseFilter.maxAge = child.defaultFilter.ageRangeOverride.maxAge;
    }
  }
  
  // Apply age-based defaults if no age override is set
  if (!baseFilter.minAge && !baseFilter.maxAge) {
    baseFilter.minAge = Math.max(0, age - 1); // Allow activities 1 year below
    baseFilter.maxAge = age + 2; // Allow activities 2 years above
  }
  
  return baseFilter;
};

export const mergeWithChildDefaults = (
  currentFilters: ActivityFilters,
  childDefaults: ActivityFilters
): ActivityFilters => {
  return {
    ...childDefaults,
    ...currentFilters,
    // Preserve search term from current filters
    searchTerm: currentFilters.searchTerm,
  };
};