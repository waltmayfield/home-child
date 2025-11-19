import {getConfiguredAmplifyClient, setAmplifyEnvVars} from '../utils/amplifyUtils';
import { Skills, ActivityCatigories, CreateActivityInput } from '../amplify/graphql/API'
import { createActivity } from '../amplify/graphql/mutations'
import * as fs from 'fs';
import * as path from 'path';

// Type guard to validate activity data
function isValidActivityData(data: any): data is CreateActivityInput {
  return (
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    Object.values(ActivityCatigories).includes(data.category) &&
    Array.isArray(data.skillsTargeted) &&
    data.skillsTargeted.every((skill: any) => Object.values(Skills).includes(skill))
  );
}

// Helper function to map string values to enum values
function mapToActivityInput(rawData: any): CreateActivityInput {
  return {
    title: rawData.title,
    description: rawData.description,
    category: ActivityCatigories[rawData.category as keyof typeof ActivityCatigories],
    skillsTargeted: rawData.skillsTargeted?.map((skill: string) => 
      Skills[skill as keyof typeof Skills]
    ),
    // Add other optional fields as needed
    materials: rawData.materials,
    instructions: rawData.instructions,
    difficultyLevel: rawData.difficultyLevel,
    duration: rawData.duration ? {
      estimatedMinutes: rawData.duration.estimatedMinutes,
      flexible: rawData.duration.flexible
    } : undefined,
    messLevel: rawData.messLevel,
    supervisionLevel: rawData.supervisionLevel,
    settingRequirements: rawData.settingRequirements,
    targetAgeRange: rawData.targetAgeRange ? {
      minAge: rawData.targetAgeRange.minAge,
      maxAge: rawData.targetAgeRange.maxAge
    } : (rawData.ageRangeMin && rawData.ageRangeMax ? {
      minAge: rawData.ageRangeMin,
      maxAge: rawData.ageRangeMax
    } : undefined),
    tags: rawData.tags
  };
}

const run = async () => {
  const envResult = await setAmplifyEnvVars();
  if (!envResult.success) {
    console.error('Failed to set Amplify environment variables:', envResult.error);
    process.exit(1);
  }

  const amplifyClient = getConfiguredAmplifyClient();

  try {
    // Read the JSONL file
    const dataPath = path.join(__dirname, '../data/Activity.jsonl');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    console.log(`Processing ${lines.length} activities...`);

    for (const line of lines) {
      try {
        const rawData = JSON.parse(line);
        
        // Map raw data to proper enum types
        const activityInput = mapToActivityInput(rawData);
        
        // Validate the mapped data
        if (!isValidActivityData(activityInput)) {
          console.error('Invalid activity data:', rawData);
          continue;
        }

        // Upload the activity
        const result = await amplifyClient.graphql({
          query: createActivity,
          variables: {
            input: activityInput
          }
        });

        console.log('Successfully created activity:', result.data?.createActivity?.title);
      } catch (parseError) {
        console.error('Error parsing line:', line, parseError);
      }
    }
  } catch (error) {
    console.error('Error reading or processing file:', error);
  }
};

run().catch(console.error);