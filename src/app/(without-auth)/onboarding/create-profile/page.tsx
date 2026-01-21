"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Sparkles, ArrowRight, Filter, Heart } from "lucide-react";
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

interface OnboardingData {
  name: string;
  age: number;
  description: string;
  aiResult: {
    defaultFilter: any;
    interests: string[];
  };
}

export default function CreateProfilePage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('onboarding-data');
    if (data) {
      setOnboardingData(JSON.parse(data));
    } else {
      // Redirect back if no data
      router.push('/onboarding/describe-child');
    }
  }, [router]);

  const handleCreateAccount = () => {
    // Create the child record in the backend, then redirect
    (async () => {
      if (!onboardingData) return;

      try {
        // Approximate birthday from age: keep today's month/day, subtract years
        const today = new Date();
        const birthYear = today.getFullYear() - (onboardingData.age || 0);
        const birthday = new Date(today);
        birthday.setFullYear(birthYear);
        const birthdayStr = birthday.toISOString().slice(0, 10); // YYYY-MM-DD

        const result = await client.models.Child.create({
          name: onboardingData.name,
          birthday: birthdayStr,
          description: onboardingData.description || undefined,
          interests: onboardingData.aiResult?.interests || [],
          defaultFilter: onboardingData.aiResult?.defaultFilter || undefined,
        });

        if (result.data) {
          // Store created child id locally for quick access
          localStorage.setItem('created-child-id', result.data.id);
        }

        router.push('/activities');
      } catch (error) {
        console.error('Error creating child during onboarding:', error);
        // Fallback: store profile locally and continue
        localStorage.setItem('child-profile-data', JSON.stringify(onboardingData));
        router.push('/activities');
      }
    })();
  };

  if (!onboardingData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </main>
    );
  }

  const { defaultFilter, interests } = onboardingData.aiResult;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Perfect! Here's What We Found for {onboardingData.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your description, we've created personalized activity preferences and interests
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Interests Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-2xl text-gray-800">Discovered Interests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interests?.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 bg-pink-100 text-pink-800">
                    {interest}
                  </Badge>
                )) || <p className="text-gray-500">No specific interests identified</p>}
              </div>
            </CardContent>
          </Card>

          {/* Activity Preferences Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-800">Activity Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {defaultFilter?.categories && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Preferred Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {defaultFilter.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {defaultFilter?.skills && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Target Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {defaultFilter.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {defaultFilter?.messLevel && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Mess Level: 
                    <span className="ml-2 font-normal capitalize">{defaultFilter.messLevel.replace('_', ' ')}</span>
                  </p>
                </div>
              )}

              {defaultFilter?.maxDuration && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Max Duration: 
                    <span className="ml-2 font-normal">{defaultFilter.maxDuration} minutes</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Profile Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Name:</strong> {onboardingData.name}<br/>
                <strong>Age:</strong> {onboardingData.age} years old<br/>
                <strong>Your Description:</strong> "{onboardingData.description}"
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={handleCreateAccount}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
          >
            Continue to Activities
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-4">
            <button 
              onClick={() => router.push('/onboarding/describe-child')} 
              className="text-gray-500 hover:text-gray-700"
            >
              ← Go back and modify
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}