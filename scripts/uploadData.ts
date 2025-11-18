import {getConfiguredAmplifyClient, setAmplifyEnvVars} from '../utils/amplifyUtils';
import { Skills, ActivityCatigories } from '../amplify/graphql/API'
import { createActivity } from '../amplify/graphql/mutations'

// Use this client to upload data from the data directory. First import the .jsonl file, and then for each entry, use the api

const run = async () => {
  const envResult =  await setAmplifyEnvVars();
  if (!envResult.success) {
    console.error('Failed to set Amplify environment variables:', envResult.error);
    process.exit(1);
  }

  const amplifyClient = getConfiguredAmplifyClient();

  const activityInput = {
    title: "Sample Activity",
    description: "This is a sample activity description.",
    category: "arts_crafts",
    skillsTargeted: ["creativity", "fine_motor"]
  }
  // Example operation: List some data (replace with actual operation)
  amplifyClient.graphql({
    query: createActivity,
    variables: {
        input: activityInput
    }
  })
};