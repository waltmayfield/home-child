"use client";

import React, { useEffect, useState, use } from 'react';
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ChefHat, ArrowLeft, AlertTriangle, Palette } from "lucide-react";
import Link from "next/link";
import { formatCategory, formatDifficulty, getMessLevelColor } from "@/../amplify/shared/constants";

const client = generateClient<Schema>();

type Activity = Schema["Activity"]["type"];

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching activity with ID:", resolvedParams.id);
    fetchActivity();
  }, [resolvedParams.id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Activity.get({ id: resolvedParams.id });
      if (data) {
        setActivity(data);
      } else {
        setError('Activity not found');
      }
    } catch (err) {
      setError('Failed to fetch activity details');
      console.error('Error fetching activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cooking_baking':
        return <ChefHat className="w-5 h-5" />;
      case 'arts_crafts':
        return <Palette className="w-5 h-5" />;
      case 'science_experiments':
        return <Star className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getSupervisionIcon = (level: string) => {
    switch (level) {
      case 'independent':
        return '🎯';
      case 'minimal_supervision':
        return '👀';
      case 'active_supervision':
        return '👥';
      case 'one_on_one_required':
        return '🤝';
      default:
        return '👥';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/activities">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Button>
          </Link>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto py-8">
        <Link href="/activities">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchActivity} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/activities">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getCategoryIcon(activity.category)}
                  <CardTitle className="text-2xl">{activity.title}</CardTitle>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge variant="secondary">
                    {formatCategory(activity.category)}
                  </Badge>
                  {activity.difficultyLevel && (
                    <Badge 
                      variant={
                        activity.difficultyLevel === 'beginner' ? 'default' :
                        activity.difficultyLevel === 'intermediate' ? 'secondary' : 'destructive'
                      }
                    >
                      {formatDifficulty(activity.difficultyLevel)}
                    </Badge>
                  )}
                  {activity.messLevel && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMessLevelColor(activity.messLevel)}`}>
                      Mess Level: {activity.messLevel.charAt(0).toUpperCase() + activity.messLevel.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Info Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {activity.duration && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{activity.duration.estimatedMinutes} minutes</p>
                    <p className="text-sm text-gray-500">
                      {activity.duration.flexible ? 'Flexible timing' : 'Fixed duration'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activity.targetAgeRange && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Ages {activity.targetAgeRange.minAge}-{activity.targetAgeRange.maxAge}</p>
                    <p className="text-sm text-gray-500">Target age range</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activity.supervisionLevel && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getSupervisionIcon(activity.supervisionLevel)}</span>
                  <div>
                    <p className="font-medium">{activity.supervisionLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-sm text-gray-500">Supervision needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Materials */}
        {activity.materials && activity.materials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Materials Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-2">
                {activity.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {activity.instructions && activity.instructions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {activity.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Skills & Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills Targeted */}
          {activity.skillsTargeted && activity.skillsTargeted.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills Targeted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {activity.skillsTargeted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setting Requirements */}
          {activity.settingRequirements && activity.settingRequirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setting Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {activity.settingRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {activity.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}