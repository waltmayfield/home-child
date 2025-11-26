import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import {
  aws_iam as iam
} from 'aws-cdk-lib'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});



// at the bottom of ./amplify/backend.ts
// note: you ideally should not attach the 'AmazonBedrockFullAccess' policy to ALL of your IAM roles! your actual target function is like 'GenerationBedrockDat<small hash>'
Object.values(backend.data.node.findAll()).forEach(construct => {
  if (construct instanceof iam.Role) {
    construct.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          "bedrock:InvokeModel*",
          // "bedrock:InvokeModelWithResponseStream"
        ],
        resources: [
          `arn:aws:bedrock:*::foundation-model/*`,
          `arn:aws:bedrock:*:${backend.stack.account}:inference-profile/*`,
        ],
        })
    )

    console.log('Added Bedrock invoke permissions to role:', construct.node.path);
    // role.addManagedPolicy(
    //   iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockFullAccess')
    // );
  }
});