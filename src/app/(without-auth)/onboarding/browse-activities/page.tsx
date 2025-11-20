"use client";

import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";

const client = generateClient<Schema>();
type Activity = Schema["Activity"]["type"];

export default function BrowseActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const result = await client.models.Activity.list({
        limit: 20
      });
      if (result.data) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivitySelection = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleContinue = () => {
    if (selectedActivities.length > 0) {
      localStorage.setItem('selected-activities', JSON.stringify(selectedActivities));
      // Navigate to sign up page or create account flow
      window.location.href = '/onboarding/create-account';
    } else {
      alert('Please select at least one activity to continue');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Browse Our Activity Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select activities that interest you to help us understand your preferences
          </p>
          {selectedActivities.length > 0 && (
            <p className="mt-4 text-blue-600 font-medium">
              {selectedActivities.length} activities selected
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activities.map((activity) => (
            <Card 
              key={activity.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedActivities.includes(activity.id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleActivitySelection(activity.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
                  {selectedActivities.includes(activity.id) && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {activity.category.replace('_', ' ')}
                  </Badge>
                  {activity.skillsTargeted?.slice(0, 2).map((skill) => skill && (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration?.estimatedMinutes || 0}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Ages {activity.targetAgeRange?.minAge || 0}-{activity.targetAgeRange?.maxAge || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button 
            onClick={handleContinue}
            disabled={selectedActivities.length === 0}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Continue with {selectedActivities.length} activities
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back to start
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}