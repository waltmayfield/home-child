"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ChefHat, Filter, X, Search, Sliders } from "lucide-react";
import Link from "next/link";
import { 
  ACTIVITY_CATEGORIES, 
  SKILLS, 
  DIFFICULTY_LEVELS, 
  MESS_LEVELS, 
  SUPERVISION_LEVELS,
  formatCategory,
  formatDifficulty,
  type ActivityCategory,
  type Skill,
  type DifficultyLevel,
  type MessLevel,
  type SupervisionLevel
} from "@/../amplify/shared/constants";

const client = generateClient<Schema>();

type Activity = Schema["Activity"]["type"];

// Filter interfaces
interface ActivityFilters {
  category?: ActivityCategory;
  difficulty?: DifficultyLevel;
  minAge?: number;
  maxAge?: number;
  maxDuration?: number;
  messLevel?: MessLevel;
  supervisionLevel?: SupervisionLevel;
  skills?: Skill[];
  searchTerm?: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ActivityFilters>({});

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // Fetch more activities to enable better filtering
      const { data } = await client.models.Activity.list({
        limit: 100 // Increased limit for better filtering experience
      });
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on current filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(searchLower);
        const matchesDescription = activity.description.toLowerCase().includes(searchLower);
        const matchesTags = activity.tags?.some(tag => 
          tag?.toLowerCase().includes(searchLower)
        );
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (filters.category && activity.category !== filters.category) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && activity.difficultyLevel !== filters.difficulty) {
        return false;
      }

      // Age range filter
      if (filters.minAge !== undefined || filters.maxAge !== undefined) {
        if (!activity.targetAgeRange) return false;
        
        if (filters.minAge !== undefined && activity.targetAgeRange.maxAge < filters.minAge) {
          return false;
        }
        
        if (filters.maxAge !== undefined && activity.targetAgeRange.minAge > filters.maxAge) {
          return false;
        }
      }

      // Duration filter
      if (filters.maxDuration && activity.duration && 
          activity.duration.estimatedMinutes > filters.maxDuration) {
        return false;
      }

      // Mess level filter
      if (filters.messLevel && activity.messLevel !== filters.messLevel) {
        return false;
      }

      // Supervision level filter
      if (filters.supervisionLevel && activity.supervisionLevel !== filters.supervisionLevel) {
        return false;
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some((skill: Skill) =>
          activity.skillsTargeted?.includes(skill as any)
        );
        if (!hasMatchingSkill) {
          return false;
        }
      }

      return true;
    });
  }, [activities, filters]);

  const updateFilter = (key: keyof ActivityFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (value !== undefined && value !== '' && 
        (Array.isArray(value) ? value.length > 0 : true)) {
      return count + 1;
    }
    return count;
  }, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cooking_baking':
        return <ChefHat className="w-4 h-4" />;
      case 'arts_crafts':
        return <Star className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Activities</h1>
        <div className="mb-6">
          <div className="h-10 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchActivities} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activities</h1>
        <p className="text-gray-600">Discover fun and educational activities for children</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchTerm || ''}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {ACTIVITY_CATEGORIES.map((category: ActivityCategory) => (
                      <option key={category} value={category}>
                        {formatCategory(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty || ''}
                    onChange={(e) => updateFilter('difficulty', e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    {DIFFICULTY_LEVELS.map((difficulty: DifficultyLevel) => (
                      <option key={difficulty} value={difficulty}>
                        {formatDifficulty(difficulty)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mess Level Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mess Level</label>
                  <select
                    value={filters.messLevel || ''}
                    onChange={(e) => updateFilter('messLevel', e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Mess Level</option>
                    {MESS_LEVELS.map((level: MessLevel) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Range Filters */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Age</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={filters.minAge || ''}
                    onChange={(e) => updateFilter('minAge', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Any age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Maximum Age</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={filters.maxAge || ''}
                    onChange={(e) => updateFilter('maxAge', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Any age"
                  />
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Max Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={filters.maxDuration || ''}
                    onChange={(e) => updateFilter('maxDuration', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Any duration"
                  />
                </div>
              </div>

              {/* Supervision Level Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Supervision Level</label>
                <select
                  value={filters.supervisionLevel || ''}
                  onChange={(e) => updateFilter('supervisionLevel', e.target.value || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Supervision Level</option>
                  {SUPERVISION_LEVELS.map((level: SupervisionLevel) => (
                    <option key={level} value={level}>
                      {level.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Skills Targeted</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SKILLS.map((skill: Skill) => (
                    <label key={skill} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.skills?.includes(skill) || false}
                        onChange={(e) => {
                          const currentSkills = filters.skills || [];
                          if (e.target.checked) {
                            updateFilter('skills', [...currentSkills, skill]);
                          } else {
                            updateFilter('skills', currentSkills.filter(s => s !== skill));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {formatCategory(filters.category)}
                <button onClick={() => updateFilter('category', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.difficulty && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {formatDifficulty(filters.difficulty)}
                <button onClick={() => updateFilter('difficulty', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.minAge !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min Age: {filters.minAge}
                <button onClick={() => updateFilter('minAge', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.maxAge !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max Age: {filters.maxAge}
                <button onClick={() => updateFilter('maxAge', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.maxDuration && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: {filters.maxDuration}min
                <button onClick={() => updateFilter('maxDuration', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.skills && filters.skills.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.skills.length} skill{filters.skills.length > 1 ? 's' : ''}
                <button onClick={() => updateFilter('skills', [])}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 text-lg">{activity.title}</CardTitle>
                {getCategoryIcon(activity.category)}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {formatCategory(activity.category)}
                </Badge>
                {activity.difficultyLevel && (
                  <Badge 
                    variant={
                      activity.difficultyLevel === 'beginner' ? 'default' :
                      activity.difficultyLevel === 'intermediate' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {formatDifficulty(activity.difficultyLevel)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {activity.description}
              </p>
              
              <div className="space-y-2">
                {activity.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration.estimatedMinutes} minutes</span>
                    {activity.duration.flexible && (
                      <span className="text-xs">(flexible)</span>
                    )}
                  </div>
                )}
                
                {activity.targetAgeRange && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Ages {activity.targetAgeRange.minAge}-{activity.targetAgeRange.maxAge}</span>
                  </div>
                )}
              </div>

              {activity.skillsTargeted && activity.skillsTargeted.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Skills Targeted:</p>
                  <div className="flex gap-1 flex-wrap">
                    {activity.skillsTargeted.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill?.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {activity.skillsTargeted.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{activity.skillsTargeted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Link href={`/activities/${activity.id}`}>
                <Button className="w-full mt-4" variant="outline">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No activities match your filters' : 'No activities found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results.' 
              : 'Check back later for new activities!'
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

