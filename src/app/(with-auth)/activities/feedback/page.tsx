"use client";

import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Clock,
  Users,
  MessageSquare,
  Check 
} from "lucide-react";
import { useRouter } from 'next/navigation';

const client = generateClient<Schema>();

type Activity = Schema["Activity"]["type"];
type Child = Schema["Child"]["type"];

interface FeedbackData {
  childId: string;
  activityIds: string[];
}

interface ActivityFeedback {
  activityId: string;
  rating: number; // 1-5 scale (1=disliked, 5=loved)
  comments: string;
}

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [child, setChild] = useState<Child | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityFeedback, setActivityFeedback] = useState<ActivityFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('selected-activities-for-feedback');
    if (storedData) {
      const data: FeedbackData = JSON.parse(storedData);
      setFeedbackData(data);
      fetchData(data);
    } else {
      router.push('/activities');
    }
  }, [router]);

  const fetchData = async (data: FeedbackData) => {
    try {
      setLoading(true);
      
      // Fetch child data
      const childResult = await client.models.Child.get({ id: data.childId });
      if (childResult.data) {
        setChild(childResult.data);
      }

      // Fetch activities
      const activityPromises = data.activityIds.map(id => 
        client.models.Activity.get({ id })
      );
      const activityResults = await Promise.all(activityPromises);
      const fetchedActivities = activityResults
        .map(result => result.data)
        .filter(Boolean) as Activity[];
      
      setActivities(fetchedActivities);
      
      // Initialize feedback array
      const initialFeedback = data.activityIds.map(id => ({
        activityId: id,
        rating: 0,
        comments: ''
      }));
      setActivityFeedback(initialFeedback);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentActivity = activities[currentActivityIndex];
  const currentFeedback = activityFeedback[currentActivityIndex];

  const updateCurrentFeedback = (updates: Partial<ActivityFeedback>) => {
    setActivityFeedback(prev => 
      prev.map((feedback, index) => 
        index === currentActivityIndex 
          ? { ...feedback, ...updates }
          : feedback
      )
    );
  };

  const setRating = (rating: number) => {
    updateCurrentFeedback({ rating });
  };

  const setComments = (comments: string) => {
    updateCurrentFeedback({ comments });
  };

  const goToNext = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      submitFeedback();
    }
  };

  const goToPrevious = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    }
  };

  const submitFeedback = async () => {
    if (!child || !feedbackData) return;
    
    setSubmitting(true);
    
    try {
      // Create ChildActivity records for each feedback
      const promises = activityFeedback.map(async (feedback) => {
        if (feedback.rating > 0) { // Only submit if rating was provided
          await client.models.ChildActivity.create({
            childID: child.id,
            activityID: feedback.activityId,
            state: 'completed',
            completedAt: new Date().toISOString().split('T')[0],
            feedback: {
              rating: feedback.rating,
              comments: feedback.comments || ''
            },
            notes: `User provided feedback: ${feedback.rating}/5 stars. ${feedback.comments}`
          });
        }
      });
      
      await Promise.all(promises);
      
      // Clear localStorage
      localStorage.removeItem('selected-activities-for-feedback');
      
      // Navigate to success page or back to activities
      router.push('/activities?feedback=success');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (!currentActivity || !child) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No activities found</h2>
          <Button onClick={() => router.push('/activities')}>
            Back to Activities
          </Button>
        </div>
      </main>
    );
  }

  const progress = ((currentActivityIndex + 1) / activities.length) * 100;
  const isLastActivity = currentActivityIndex === activities.length - 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Activity Feedback for {child.name}
          </h1>
          <p className="text-gray-600">
            Help us learn what {child.name} enjoyed!
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentActivityIndex + 1} of {activities.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{currentActivity.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentActivity.duration?.estimatedMinutes || 0} minutes
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Ages {currentActivity.targetAgeRange?.minAge || 0}-{currentActivity.targetAgeRange?.maxAge || 0}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{currentActivity.description}</p>
            
            {/* Skills Targeted */}
            {currentActivity.skillsTargeted && currentActivity.skillsTargeted.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Skills Targeted:</p>
                <div className="flex gap-2 flex-wrap">
                  {currentActivity.skillsTargeted.map((skill, index) => skill && (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  How much did {child.name} enjoy this activity?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    variant={currentFeedback?.rating === 1 ? "destructive" : "outline"}
                    size="lg"
                    onClick={() => setRating(1)}
                    className="flex flex-col items-center gap-2 h-20 w-20"
                  >
                    <ThumbsDown className="w-6 h-6" />
                    <span className="text-xs">Disliked</span>
                  </Button>
                  <Button
                    variant={currentFeedback?.rating === 2 ? "secondary" : "outline"}
                    size="lg"
                    onClick={() => setRating(2)}
                    className="flex flex-col items-center gap-2 h-20 w-20"
                  >
                    <span className="text-2xl">😐</span>
                    <span className="text-xs">Okay</span>
                  </Button>
                  <Button
                    variant={currentFeedback?.rating === 3 ? "default" : "outline"}
                    size="lg"
                    onClick={() => setRating(3)}
                    className="flex flex-col items-center gap-2 h-20 w-20"
                  >
                    <span className="text-2xl">🙂</span>
                    <span className="text-xs">Good</span>
                  </Button>
                  <Button
                    variant={currentFeedback?.rating === 4 ? "default" : "outline"}
                    size="lg"
                    onClick={() => setRating(4)}
                    className="flex flex-col items-center gap-2 h-20 w-20 bg-green-100 hover:bg-green-200"
                  >
                    <ThumbsUp className="w-6 h-6" />
                    <span className="text-xs">Liked</span>
                  </Button>
                  <Button
                    variant={currentFeedback?.rating === 5 ? "default" : "outline"}
                    size="lg"
                    onClick={() => setRating(5)}
                    className="flex flex-col items-center gap-2 h-20 w-20 bg-red-100 hover:bg-red-200"
                  >
                    <Heart className="w-6 h-6 fill-current" />
                    <span className="text-xs">Loved</span>
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Additional Comments (Optional)
                </h3>
                <Textarea
                  placeholder="Tell us more about how this activity went. What did your child enjoy most? Any challenges?"
                  value={currentFeedback?.comments || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentActivityIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {activityFeedback.filter(f => f.rating > 0).length} of {activities.length} completed
            </p>
          </div>

          <Button
            onClick={goToNext}
            disabled={currentFeedback?.rating === 0}
            className="flex items-center gap-2"
          >
            {isLastActivity ? (
              submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Feedback
                  <Check className="w-4 h-4" />
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/activities')}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip feedback and return to activities
          </Button>
        </div>
      </div>
    </main>
  );
}