//This page displays the first 5 activities

"use client";

import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ChefHat } from "lucide-react";

const client = generateClient<Schema>();

type Activity = Schema["Activity"]["type"];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Activity.list({
        limit: 5
      });
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDifficulty = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Activities</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
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

              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600">Check back later for new activities!</p>
        </div>
      )}
    </div>
  );
}

