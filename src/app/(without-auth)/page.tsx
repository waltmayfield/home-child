"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Search, LogIn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated and redirect
    const checkAuth = async () => {
      try {
        // Check if we have any auth tokens or user session
        const hasSession = localStorage.getItem('amplify-signin-user') || 
                          document.cookie.includes('CognitoIdentityServiceProvider');
        
        if (hasSession) {
          // User might be authenticated, redirect to activities
          window.location.href = '/activities';
          return;
        }
      } catch (error) {
        console.log('No existing session found');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Find Perfect Activities for Your Child
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover age-appropriate activities tailored to your child's interests and development needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Suggested Activities Option */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Browse Suggested Activities</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Jump right in with our curated collection of activities sorted by age and category
              </p>
              <Link href="/onboarding/browse-activities">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Browsing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Custom Recommendations Option */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-purple-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Get Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Tell us about your child and situation to get AI-powered activity recommendations
              </p>
              <Link href="/onboarding/describe-child">
                <Button size="lg" variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                  Describe Your Child
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Already have an account?
          </p>
          <Link href="/activities">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </Button>
          </Link>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-2">
              New to our app? Start with the options above to explore activities and create your first child profile.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}