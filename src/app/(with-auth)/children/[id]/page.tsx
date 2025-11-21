"use client";

import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Edit
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { formatCategory, calculateChildAge } from "@/../amplify/shared/constants";

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
              <h1 className="text-3xl font-bold text-gray-800">{child.name}'s Profile</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {age} years old
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {completedActivities.length} activities completed
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
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
              <div>
                <p className="text-sm font-medium text-gray-700">Birthday</p>
                <p className="text-gray-900">{new Date(child.birthday).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Current Age</p>
                <p className="text-gray-900">{age} years old</p>
              </div>

              {child.interests && child.interests.length > 0 && (
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
              )}
            </CardContent>
          </Card>

          {/* Activity Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Activity Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.defaultFilter ? (
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