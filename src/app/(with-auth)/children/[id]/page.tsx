"use client";

import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { updateChild } from "@/../amplify/graphql/mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Baby, 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  Clock, 
  Filter,
  Activity,
  MessageSquare,
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { formatCategory, formatSkill, calculateChildAge, ACTIVITY_CATEGORIES, SKILLS } from "@/../amplify/shared/constants";

const client = generateClient<Schema>();

type Child = Schema["Child"]["type"];
type ChildActivity = Schema["ChildActivity"]["type"];
type Activity = Schema["Activity"]["type"];

interface ChildActivityWithDetails {
  childActivity: ChildActivity;
  activity?: Activity | null;
}

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;
  
  const [child, setChild] = useState<Child | null>(null);
  const [childActivities, setChildActivities] = useState<ChildActivityWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInterests, setEditedInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [editedFilter, setEditedFilter] = useState<any>({});
  const [editedName, setEditedName] = useState('');
  const [editedBirthday, setEditedBirthday] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      
      // Fetch child details
      const childResult = await client.models.Child.get({ id: childId });
      if (!childResult.data) {
        setError('Child not found');
        return;
      }
      setChild(childResult.data);

      // Fetch child activities with activity details
      const activitiesResult = await client.models.ChildActivity.list({
        filter: { childID: { eq: childId } }
      });

      if (activitiesResult.data) {
        // Fetch activity details for each child activity
        const activitiesWithDetails = await Promise.all(
          activitiesResult.data.map(async (childActivity) => {
            try {
              const activityResult = await client.models.Activity.get({ 
                id: childActivity.activityID 
              });
              return {
                childActivity,
                activity: activityResult.data
              };
            } catch (error) {
              console.error('Error fetching activity details:', error);
              return {
                childActivity,
                activity: undefined
              };
            }
          })
        );
        setChildActivities(activitiesWithDetails);
      }

    } catch (error) {
      console.error('Error fetching child data:', error);
      setError('Failed to load child data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!child) return;

    // Basic validation
    if (!editedName.trim()) {
      setError('Name is required');
      return;
    }

    if (!editedBirthday) {
      setError('Birthday is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Update child with new interests and default filter
      const updatedChild = await client.models.Child.update({
        id: child.id,
        name: editedName.trim(),
        birthday: editedBirthday,
        interests: editedInterests,
        defaultFilter: editedFilter
      });

      if (updatedChild.data) {
        setChild(updatedChild.data);
        setIsEditing(false);
        // Show success message or toast here if needed
      }
    } catch (error) {
      console.error('Error updating child profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedInterests((child?.interests || []).filter((interest): interest is string => Boolean(interest)));
    setEditedFilter(child?.defaultFilter || {});
    setEditedName(child?.name || '');
    setEditedBirthday(child?.birthday || '');
    setNewInterest('');
    setIsEditing(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editedInterests.includes(newInterest.trim())) {
      setEditedInterests([...editedInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditedInterests(editedInterests.filter(i => i !== interest));
  };

  const startEditing = () => {
    setEditedInterests((child?.interests || []).filter((interest): interest is string => Boolean(interest)));
    setEditedFilter(child?.defaultFilter || {});
    setEditedName(child?.name || '');
    // Ensure date format is YYYY-MM-DD for date input
    setEditedBirthday(child?.birthday || '');
    setIsEditing(true);
  };

  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading child profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !child) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Child not found'}</p>
          <Button onClick={() => router.push('/activities')}>
            Back to Activities
          </Button>
        </div>
      </main>
    );
  }

  const age = calculateChildAge(child.birthday);
  const completedActivities = childActivities.filter(ca => ca.childActivity.state === 'completed');
  const averageRating = completedActivities.length > 0 
    ? completedActivities.reduce((sum, ca) => sum + (ca.childActivity.feedback?.rating || 0), 0) / completedActivities.length
    : 0;

  // Group activities by rating for insights
  const activityStats = {
    loved: completedActivities.filter(ca => ca.childActivity.feedback?.rating === 5).length,
    liked: completedActivities.filter(ca => ca.childActivity.feedback?.rating === 4).length,
    neutral: completedActivities.filter(ca => ca.childActivity.feedback?.rating === 3).length,
    disliked: completedActivities.filter(ca => (ca.childActivity.feedback?.rating || 0) < 3).length,
  };

  // Get most recent activities
  const recentActivities = completedActivities
    .sort((a, b) => new Date(b.childActivity.updatedAt).getTime() - new Date(a.childActivity.updatedAt).getTime())
    .slice(0, 5);

  // Get favorite categories
  const categoryFrequency: Record<string, number> = {};
  completedActivities.forEach(ca => {
    if (ca.activity?.category) {
      categoryFrequency[ca.activity.category] = (categoryFrequency[ca.activity.category] || 0) + 1;
    }
  });

  const favoriteCategories = Object.entries(categoryFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <main className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => router.push('/activities')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Baby className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditing ? editedName || child.name : child.name}'s Profile
                {isEditing && <span className="text-sm text-gray-500 ml-2">(editing)</span>}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {isEditing && editedBirthday ? calculateChildAge(editedBirthday) : calculateChildAge(child.birthday)} years old
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {completedActivities.length} activities completed
                </div>
              </div>
            </div>
          </div>
          
          {!isEditing ? (
            <Button variant="outline" className="flex items-center gap-2" onClick={startEditing}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveProfile}
                disabled={saving || !editedName.trim() || !editedBirthday}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Loved Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-500">{activityStats.loved}</span>
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">{completedActivities.length}</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {completedActivities.filter(ca => 
                  new Date(ca.childActivity.updatedAt).getMonth() === new Date().getMonth()
                ).length}
              </span>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Child Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{child.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Birthday</p>
                    <p className="text-gray-900">{new Date(child.birthday + 'T00:00:00').toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Age</p>
                    <p className="text-gray-900">{calculateChildAge(child.birthday)} years old</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="childName" className="text-sm font-medium text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="childName"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="mt-1"
                      placeholder="Enter child's name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="childBirthday" className="text-sm font-medium text-gray-700">
                      Birthday
                    </Label>
                    <Input
                      id="childBirthday"
                      type="date"
                      value={editedBirthday}
                      onChange={(e) => setEditedBirthday(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Age</p>
                    <p className="text-gray-900">
                      {editedBirthday ? calculateChildAge(editedBirthday) : calculateChildAge(child.birthday)} years old
                    </p>
                  </div>
                </>
              )}

              {!isEditing ? (
                child.interests && child.interests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {child.interests.filter(Boolean).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {editedInterests.map((interest, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          <span>{interest}</span>
                          <button
                            onClick={() => handleRemoveInterest(interest)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {editedInterests.length === 0 && (
                        <p className="text-gray-500 text-xs">No interests added</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Add new interest..."
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInterest();
                          }
                        }}
                        className="flex-1 text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddInterest}
                        disabled={!newInterest.trim()}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Activity Preferences
                {child.interests && child.interests.length > 0 && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    AI Enhanced
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                child.defaultFilter ? (
                  <div className="space-y-3">
                    {child.defaultFilter.categories && child.defaultFilter.categories.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Preferred Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {child.defaultFilter.categories.filter(Boolean).map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {formatCategory(category!)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {child.defaultFilter.skills && child.defaultFilter.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Target Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {child.defaultFilter.skills.filter(Boolean).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {formatSkill(skill!)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {child.defaultFilter.messLevel && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Mess Level Preference</p>
                        <p className="text-gray-900 capitalize">{child.defaultFilter.messLevel.replace('_', ' ')}</p>
                      </div>
                    )}

                    {child.defaultFilter.maxDuration && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Max Activity Duration</p>
                        <p className="text-gray-900">{child.defaultFilter.maxDuration} minutes</p>
                      </div>
                    )}

                    {child.defaultFilter.difficultyLevel && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Difficulty Level</p>
                        <p className="text-gray-900 capitalize">{child.defaultFilter.difficultyLevel}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No specific preferences set</p>
                )
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Preferred Categories
                    </Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {ACTIVITY_CATEGORIES.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedFilter.categories?.includes(category) || false}
                            onChange={(e) => {
                              const categories = editedFilter.categories || [];
                              if (e.target.checked) {
                                setEditedFilter({
                                  ...editedFilter,
                                  categories: [...categories, category]
                                });
                              } else {
                                setEditedFilter({
                                  ...editedFilter,
                                  categories: categories.filter((c: any) => c !== category)
                                });
                              }
                            }}
                            className="rounded text-xs"
                          />
                          <span className="text-xs">{formatCategory(category)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Target Skills
                    </Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {SKILLS.map(skill => (
                        <label key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedFilter.skills?.includes(skill) || false}
                            onChange={(e) => {
                              const skills = editedFilter.skills || [];
                              if (e.target.checked) {
                                setEditedFilter({
                                  ...editedFilter,
                                  skills: [...skills, skill]
                                });
                              } else {
                                setEditedFilter({
                                  ...editedFilter,
                                  skills: skills.filter((s: any) => s !== skill)
                                });
                              }
                            }}
                            className="rounded text-xs"
                          />
                          <span className="text-xs">{formatSkill(skill)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="messLevel" className="text-sm font-medium text-gray-700">
                      Mess Level Preference
                    </Label>
                    <select
                      id="messLevel"
                      value={editedFilter.messLevel || ''}
                      onChange={(e) => setEditedFilter({ ...editedFilter, messLevel: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                    >
                      <option value="">No preference</option>
                      <option value="NO_MESS">No Mess</option>
                      <option value="LOW_MESS">Low Mess</option>
                      <option value="MEDIUM_MESS">Medium Mess</option>
                      <option value="HIGH_MESS">High Mess</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="maxDuration" className="text-sm font-medium text-gray-700">
                      Max Duration (minutes)
                    </Label>
                    <select
                      id="maxDuration"
                      value={editedFilter.maxDuration || ''}
                      onChange={(e) => setEditedFilter({ ...editedFilter, maxDuration: parseInt(e.target.value) || undefined })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                    >
                      <option value="">No preference</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="difficultyLevel" className="text-sm font-medium text-gray-700">
                      Difficulty Level
                    </Label>
                    <select
                      id="difficultyLevel"
                      value={editedFilter.difficultyLevel || ''}
                      onChange={(e) => setEditedFilter({ ...editedFilter, difficultyLevel: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                    >
                      <option value="">No preference</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorite Categories */}
          {favoriteCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Favorite Activity Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {favoriteCategories.map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{formatCategory(category)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count} activities
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity History */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((item) => (
                    <div key={item.childActivity.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {item.activity?.title || 'Unknown Activity'}
                        </h4>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (item.childActivity.feedback?.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {item.activity?.category && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {formatCategory(item.activity.category)}
                        </Badge>
                      )}
                      
                      {item.childActivity.feedback?.comments && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageSquare className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">Feedback:</span>
                          </div>
                          <p className="text-xs text-gray-700 italic">
                            "{item.childActivity.feedback.comments}"
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.childActivity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No activities completed yet</p>
              )}
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Activity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-sm">Loved</span>
                  </div>
                  <span className="font-medium">{activityStats.loved}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">Liked</span>
                  </div>
                  <span className="font-medium">{activityStats.liked}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Neutral</span>
                  </div>
                  <span className="font-medium">{activityStats.neutral}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Disliked</span>
                  </div>
                  <span className="font-medium">{activityStats.disliked}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Link href="/activities">
          <Button className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Find More Activities
          </Button>
        </Link>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          View All Activity History
        </Button>
      </div>
    </main>
  );
}