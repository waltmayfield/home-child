"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users, Star, ChefHat, Filter, X, Search, Sliders, Baby, Plus, Check } from "lucide-react";
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
  type SupervisionLevel,
  type ActivityFilters,
  createDefaultFilterFromChild,
  mergeWithChildDefaults
} from "@/../amplify/shared/constants";

const client = generateClient<Schema>();

type Activity = Schema["Activity"]["type"];
type Child = Schema["Child"]["type"];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showChildSelection, setShowChildSelection] = useState(false);
  const [filters, setFilters] = useState<ActivityFilters>({});
  
  // Child creation modal state
  const [newChildName, setNewChildName] = useState('');
  const [newChildBirthday, setNewChildBirthday] = useState('');
  const [newChildDescription, setNewChildDescription] = useState('');
  const [creatingChild, setCreatingChild] = useState(false);
  
  // Activity generation state
  const [generatingActivity, setGeneratingActivity] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Apply default filters when a child is selected
    if (selectedChild) {
      // Convert schema types to constants types
      const defaultFilter: any = selectedChild.defaultFilter ? {
        categories: selectedChild.defaultFilter.categories?.filter((cat: any) => ACTIVITY_CATEGORIES.includes(cat)),
        skills: selectedChild.defaultFilter.skills?.filter((skill: any) => SKILLS.includes(skill)),
        difficultyLevel: (selectedChild.defaultFilter.difficultyLevel && DIFFICULTY_LEVELS.includes(selectedChild.defaultFilter.difficultyLevel as any)) 
          ? selectedChild.defaultFilter.difficultyLevel 
          : 'beginner',
        maxDuration: selectedChild.defaultFilter.maxDuration,
        messLevel: (selectedChild.defaultFilter.messLevel && MESS_LEVELS.includes(selectedChild.defaultFilter.messLevel as any)) 
          ? selectedChild.defaultFilter.messLevel 
          : 'moderate',
        supervisionLevel: (selectedChild.defaultFilter.supervisionLevel && SUPERVISION_LEVELS.includes(selectedChild.defaultFilter.supervisionLevel as any)) 
          ? selectedChild.defaultFilter.supervisionLevel 
          : 'minimal_supervision',
        ageRangeOverride: selectedChild.defaultFilter.ageRangeOverride
      } : null;

      const childForFilter = {
        birthday: selectedChild.birthday,
        interests: selectedChild.interests?.filter((interest): interest is string => interest !== null),
        defaultFilter: defaultFilter
      };
      const childDefaults = createDefaultFilterFromChild(childForFilter);
      // Apply child defaults directly, don't merge with existing filters
      setFilters(childDefaults);
    }
  }, [selectedChild]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch activities and children in parallel
      const [activitiesResult, childrenResult] = await Promise.all([
        client.models.Activity.list({ limit: 100 }),
        client.models.Child.list()
      ]);
      
      if (activitiesResult.data) {
        setActivities(activitiesResult.data);
      }
      
      if (childrenResult.data) {
        setChildren(childrenResult.data);
        // Auto-select first child if available
        if (childrenResult.data.length > 0) {
          setSelectedChild(childrenResult.data[0]);
        }
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort activities based on current filters with relevance scoring
  const filteredActivities = useMemo(() => {
    // Calculate relevance score for each activity
    const activitiesWithScores = activities.map((activity) => {
      let score = 0;
      let matchCount = 0;
      let totalCriteria = 0;

      // Search term filter - this is a hard filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(searchLower);
        const matchesDescription = activity.description.toLowerCase().includes(searchLower);
        const matchesTags = activity.tags?.some(tag => 
          tag?.toLowerCase().includes(searchLower)
        );
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return { activity, score: -1 }; // Exclude if search term doesn't match
        }
        score += 100; // Boost for search term match
      }

      // Category filter - soft filter with scoring
      if (filters.categories && filters.categories.length > 0) {
        totalCriteria++;
        if (filters.categories.includes(activity.category as ActivityCategory)) {
          score += 20;
          matchCount++;
        }
      }

      // Difficulty filter - soft filter
      if (filters.difficultyLevel) {
        totalCriteria++;
        if (activity.difficultyLevel === filters.difficultyLevel) {
          score += 15;
          matchCount++;
        }
      }

      // Age range filter - soft filter with partial matching
      if (filters.minAge !== undefined || filters.maxAge !== undefined) {
        totalCriteria++;
        if (activity.targetAgeRange) {
          const ageOverlap = !(
            (filters.minAge !== undefined && activity.targetAgeRange.maxAge < filters.minAge) ||
            (filters.maxAge !== undefined && activity.targetAgeRange.minAge > filters.maxAge)
          );
          if (ageOverlap) {
            score += 15;
            matchCount++;
          }
        }
      }

      // Duration filter - soft filter
      if (filters.maxDuration && activity.duration) {
        totalCriteria++;
        if (activity.duration.estimatedMinutes <= filters.maxDuration) {
          score += 10;
          matchCount++;
        } else if (activity.duration.estimatedMinutes <= filters.maxDuration * 1.5) {
          // Partial credit if within 50% of max duration
          score += 5;
        }
      }

      // Mess level filter - soft filter
      if (filters.messLevel) {
        totalCriteria++;
        if (activity.messLevel === filters.messLevel) {
          score += 10;
          matchCount++;
        }
      }

      // Supervision level filter - soft filter
      if (filters.supervisionLevel) {
        totalCriteria++;
        if (activity.supervisionLevel === filters.supervisionLevel) {
          score += 10;
          matchCount++;
        }
      }

      // Skills filter - soft filter with partial matching
      if (filters.skills && filters.skills.length > 0) {
        totalCriteria++;
        const matchingSkills = filters.skills.filter((skill: Skill) =>
          activity.skillsTargeted?.includes(skill as any)
        ).length;
        if (matchingSkills > 0) {
          score += 15 * (matchingSkills / filters.skills.length);
          matchCount++;
        }
      }

      // Boost score for newer activities (recently created)
      if (activity.createdAt) {
        const ageInDays = (Date.now() - new Date(activity.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays < 1) {
          score += 30; // Strong boost for activities created in last 24 hours
        } else if (ageInDays < 7) {
          score += 10; // Moderate boost for activities created in last week
        }
      }

      // Calculate match percentage for tie-breaking
      const matchPercentage = totalCriteria > 0 ? matchCount / totalCriteria : 1;
      score += matchPercentage * 5;

      return { activity, score };
    });

    // Filter out hard exclusions (score < 0) and sort by score
    return activitiesWithScores
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(({ activity }) => activity);
  }, [activities, filters]);

  const updateFilter = (key: keyof ActivityFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    // Clear all filters completely - don't reset to child defaults
    setFilters({});
  };

  const toggleActivitySelection = (activityId: string) => {
    if (!selectedChild) return;
    
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const createChild = async () => {
    if (!newChildName || !newChildBirthday) {
      alert('Please fill in name and birthday');
      return;
    }
    
    setCreatingChild(true);

    // const generateRecipeResult = await client.generations.generateRecipe({
    //   description: newChildDescription
    // });

    // console.log('Recipe generation result:', generateRecipeResult);
    
    try {
      let defaultFilter: any = {
        messLevel: 'moderate',
        maxDuration: 60,
        difficultyLevel: 'beginner',
        supervisionLevel: 'minimal_supervision'
      };
      let interests: string[] = [];

      // If description is provided, use AI to generate filter and interests
      if (newChildDescription.trim()) {
        try {
          const age = Math.floor((new Date().getTime() - new Date(newChildBirthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          const aiResult = await client.generations.generateDefaultFilterAndInterests({
            description: `Child named ${newChildName}, age ${age} years old. ${newChildDescription}`
          });

          console.log('AI generation result:', aiResult);

          if (aiResult.data) {

            console.log('AI generation result:', aiResult);

            // Convert the AI result to the proper format
            const aiFilter = aiResult.data.defaultFilter as any;
            const aiInterests = aiResult.data.interests as any;
            
            // Validate and use AI-generated values with proper fallbacks
            defaultFilter = {
              categories: aiFilter?.categories?.filter((cat: any) => ACTIVITY_CATEGORIES.includes(cat)),
              skills: aiFilter?.skills?.filter((skill: any) => SKILLS.includes(skill)),
              difficultyLevel: DIFFICULTY_LEVELS.includes(aiFilter?.difficultyLevel) ? aiFilter.difficultyLevel : 'beginner',
              maxDuration: aiFilter?.maxDuration || 60,
              messLevel: MESS_LEVELS.includes(aiFilter?.messLevel) ? aiFilter.messLevel : 'moderate',
              supervisionLevel: SUPERVISION_LEVELS.includes(aiFilter?.supervisionLevel) ? aiFilter.supervisionLevel : 'minimal_supervision',
              ageRangeOverride: aiFilter?.ageRangeOverride
            };
            interests = aiInterests?.filter((interest: any): interest is string => 
              typeof interest === 'string' && interest.length > 0
            ) || [];
          }
        } catch (aiError) {
          console.error('AI generation failed, using defaults:', aiError);
          // Continue with default values
        }
      }
      
      const result = await client.models.Child.create({
        name: newChildName,
        birthday: newChildBirthday,
        interests: interests,
        defaultFilter: defaultFilter
      });

      console.log('Created child result:', result);
      
      if (result.data) {
        setChildren(prev => [...prev, result.data!]);
        setSelectedChild(result.data);
        setShowChildSelection(false);
        setNewChildName('');
        setNewChildBirthday('');
        setNewChildDescription('');
        
        // Show success message
        if (newChildDescription.trim()) {
          // Use a simple alert for now, could be replaced with a toast notification
          setTimeout(() => {
            alert(`✨ Child profile created with AI-generated preferences!\n\nInterests: ${interests.join(', ') || 'None detected'}\nFilters: Applied based on description`);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error creating child:', error);
      alert('Failed to create child profile. Please try again.');
    } finally {
      setCreatingChild(false);
    }
  };

  const generateActivityForChild = async () => {
    if (!selectedChild) {
      alert('Please select a child first');
      return;
    }
    
    setGeneratingActivity(true);
    
    try {
      // Calculate child's age
      const age = Math.floor((new Date().getTime() - new Date(selectedChild.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      // Get child's preferences from their default filter
      const childFilter = selectedChild.defaultFilter;
      const preferredCategories = (childFilter?.categories?.filter(Boolean) || []).map(c => String(c));
      const preferredSkills = (childFilter?.skills?.filter(Boolean) || []).map(s => String(s));
      const maxDuration = childFilter?.maxDuration || 60;
      const messLevel = String(childFilter?.messLevel || 'moderate');
      const supervisionLevel = String(childFilter?.supervisionLevel || 'minimal_supervision');
      
      // Get existing activity titles (first 20) to avoid duplicates
      const existingActivityTitles = activities.slice(0, 20).map(a => a.title);
      
      console.log('Generating activity with params:', {
        childName: selectedChild.name,
        childAge: age,
        childInterests: (selectedChild.interests?.filter(Boolean) || []).map(i => String(i)),
        preferredCategories,
        preferredSkills,
        maxDuration,
        messLevel,
        supervisionLevel,
        existingActivityTitles
      });
      
      // Call AI generation
      const aiResult = await client.generations.generateActivityForChild({
        childName: selectedChild.name,
        childAge: age,
        childInterests: (selectedChild.interests?.filter(Boolean) || []).map(i => String(i)),
        preferredCategories,
        preferredSkills,
        maxDuration,
        messLevel,
        supervisionLevel,
        existingActivityTitles
      });
      
      console.log('AI generation result:', aiResult);
      
      if (aiResult.data) {
        const generatedActivity = aiResult.data;
        
        // Validate and create the activity
        const activityData: any = {
          title: generatedActivity.title || 'Generated Activity',
          description: generatedActivity.description || '',
          materials: generatedActivity.materials || [],
          instructions: generatedActivity.instructions || [],
          category: ACTIVITY_CATEGORIES.includes(generatedActivity.category as any) 
            ? generatedActivity.category 
            : 'arts_crafts',
          skillsTargeted: generatedActivity.skillsTargeted?.filter((skill: any) => SKILLS.includes(skill)) || ['creativity'],
          difficultyLevel: DIFFICULTY_LEVELS.includes(generatedActivity.difficultyLevel as any) 
            ? generatedActivity.difficultyLevel 
            : 'beginner',
          duration: {
            estimatedMinutes: generatedActivity.estimatedMinutes || 30,
            flexible: generatedActivity.durationFlexible ?? true
          },
          targetAgeRange: {
            minAge: generatedActivity.minAge || Math.max(1, age - 1),
            maxAge: generatedActivity.maxAge || (age + 2)
          },
          settingRequirements: generatedActivity.settingRequirements || [],
          supervisionLevel: SUPERVISION_LEVELS.includes(generatedActivity.supervisionLevel as any) 
            ? generatedActivity.supervisionLevel 
            : 'minimal_supervision',
          messLevel: MESS_LEVELS.includes(generatedActivity.messLevel as any) 
            ? generatedActivity.messLevel 
            : 'moderate',
          tags: generatedActivity.tags || []
        };
        
        console.log('Creating activity with data:', activityData);
        
        // Create the activity in the database
        const result = await client.models.Activity.create(activityData);
        
        console.log('Created activity result:', result);
        
        if (result.data) {
          // Add to local activities list
          setActivities(prev => [result.data!, ...prev]);
          
          // Show success message
          alert(`✨ Activity created: "${result.data.title}"\n\nThe activity has been added to your list!`);
        }
      }
    } catch (error) {
      console.error('Error generating activity:', error);
      alert('Failed to generate activity. Please try again.');
    } finally {
      setGeneratingActivity(false);
    }
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
          <Button onClick={fetchData} variant="outline">
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

      {/* Child Selection */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Select Child
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {children.length > 0 ? (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {children.map((child) => (
                      <Button
                        key={child.id}
                        variant={selectedChild?.id === child.id ? "default" : "outline"}
                        onClick={() => setSelectedChild(child)}
                        className="flex items-center gap-2"
                      >
                        {selectedChild?.id === child.id && <Check className="w-4 h-4" />}
                        {child.name}
                        <span className="text-xs opacity-70">
                          ({Math.floor((new Date().getTime() - new Date(child.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}y)
                        </span>
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChildSelection(!showChildSelection)}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Child
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">No children found. Create your first child profile to get started.</p>
                  <Button
                    onClick={() => setShowChildSelection(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Child Profile
                  </Button>
                </div>
              )}
            </div>
            
            {selectedChild && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-blue-800">
                    <strong>Showing activities for {selectedChild.name}</strong>
                    {selectedChild.interests && selectedChild.interests.length > 0 && (
                      <>
                        {' • Interests: '}
                        {selectedChild.interests.filter(Boolean).join(', ')}
                      </>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateActivityForChild}
                      disabled={generatingActivity}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      {generatingActivity ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4" />
                          Generate Activity
                        </>
                      )}
                    </Button>
                    <Link href={`/children/${selectedChild.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Child Creation Modal */}
      {showChildSelection && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Create New Child Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="childName">Child's Name</Label>
                <Input
                  id="childName"
                  value={newChildName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildName(e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>
              
              <div>
                <Label htmlFor="childBirthday">Birthday</Label>
                <Input
                  id="childBirthday"
                  type="date"
                  value={newChildBirthday}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildBirthday(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="childDescription">
                  Describe your child (optional)
                  <span className="text-xs text-gray-500 ml-2">
                    This helps us create better activity recommendations
                  </span>
                </Label>
                <Textarea
                  id="childDescription"
                  value={newChildDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewChildDescription(e.target.value)}
                  placeholder="Tell us about your child's interests, personality, preferences, or any specific needs..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Examples: "Loves building things and being outdoors", "Prefers quiet activities, doesn't like messy play", "Very creative, enjoys art and music"
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={createChild}
                  disabled={creatingChild || !newChildName || !newChildBirthday}
                  className="flex items-center gap-2"
                >
                  {creatingChild ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {newChildDescription.trim() ? 'Creating with AI...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Profile
                      {newChildDescription.trim() && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-1">
                          +AI
                        </span>
                      )}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChildSelection(false);
                    setNewChildName('');
                    setNewChildBirthday('');
                    setNewChildDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Selection Mode */}
      {selectedChild && (
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedActivities.length > 0 
                      ? `${selectedActivities.length} activities selected` 
                      : 'Select activities to provide feedback'}
                  </span>
                </div>
                {selectedActivities.length > 0 && (
                  <Button 
                    onClick={() => {
                      // Navigate to feedback page
                      localStorage.setItem('selected-activities-for-feedback', JSON.stringify({
                        childId: selectedChild.id,
                        activityIds: selectedActivities
                      }));
                      window.location.href = '/activities/feedback';
                    }}
                    className="flex items-center gap-2"
                  >
                    Provide Feedback ({selectedActivities.length})
                    <Star className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              {/* Categories and Skills - Full width row */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Categories</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {ACTIVITY_CATEGORIES.map((category: ActivityCategory) => {
                      const currentCategories = filters.categories || [];
                      const isSelected = currentCategories.includes(category);
                      return (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFilter('categories', [...currentCategories, category]);
                              } else {
                                updateFilter('categories', currentCategories.filter(c => c !== category));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{formatCategory(category)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Skills Targeted</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {SKILLS.map((skill: Skill) => {
                      const currentSkills = filters.skills || [];
                      const isSelected = currentSkills.includes(skill);
                      return (
                        <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFilter('skills', [...currentSkills, skill]);
                              } else {
                                updateFilter('skills', currentSkills.filter(s => s !== skill));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Other filters */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={filters.difficultyLevel || ''}
                    onChange={(e) => updateFilter('difficultyLevel', e.target.value || undefined)}
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
            </CardContent>
          </Card>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.categories && filters.categories.length > 0 && filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {formatCategory(category)}
                <button onClick={() => updateFilter('categories', filters.categories!.filter(c => c !== category))}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.difficultyLevel && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {formatDifficulty(filters.difficultyLevel)}
                <button onClick={() => updateFilter('difficultyLevel', undefined)}>
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
        {filteredActivities.map((activity) => {
          const isSelected = selectedActivities.includes(activity.id);
          return (
            <Card 
              key={activity.id} 
              className={`h-full transition-all duration-200 ${
                selectedChild 
                  ? `cursor-pointer hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`
                  : 'hover:shadow-lg'
              }`}
              onClick={selectedChild ? () => toggleActivitySelection(activity.id) : undefined}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 text-lg">{activity.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(activity.category)}
                    {isSelected && selectedChild && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
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

                <div className="flex gap-2">
                  <Link href={`/activities/${activity.id}`} className="flex-1">
                    <Button className="w-full" variant="outline" onClick={(e) => e.stopPropagation()}>
                      View Details
                    </Button>
                  </Link>
                  {selectedChild && (
                    <Button
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActivitySelection(activity.id);
                      }}
                      className="px-3"
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
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

