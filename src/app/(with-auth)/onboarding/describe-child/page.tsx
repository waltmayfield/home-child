"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Baby } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { useRouter } from 'next/navigation';

const client = generateClient<Schema>();

export default function DescribeChildPage() {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!childName || !childAge || !description) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate AI-powered filter and interests
      const result = await client.generations.generateDefaultFilterAndInterests({
        description: `Child named ${childName}, age ${childAge} years old. ${description}`
      });

      if (result.data) {
        // Store the result in localStorage for now, will later create child profile
        localStorage.setItem('onboarding-data', JSON.stringify({
          name: childName,
          age: parseInt(childAge),
          description,
          aiResult: result.data
        }));
        
        // Navigate to the result page
        router.push('/onboarding/create-profile');
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Baby className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-3xl text-gray-800">Tell Us About Your Child</CardTitle>
            <p className="text-gray-600 mt-2">
              Help us create the perfect activity recommendations for your little one
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Child's Name
                  </Label>
                  <Input
                    id="name"
                    value={childName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChildName(e.target.value)}
                    placeholder="Enter your child's name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Age (in years)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="18"
                    value={childAge}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChildAge(e.target.value)}
                    placeholder="Enter age"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Describe your situation or what you're looking for
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="Examples:
• 'It's going to rain all day and my kid doesn't like paint'
• 'I want to bake with my kid but don't want a big mess'
• 'Looking for quiet activities that help with focus'
• 'My child loves building things and being outdoors'"
                    rows={6}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || !childName || !childAge || !description}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    Get My Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}