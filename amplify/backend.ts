import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { defineBackend } from "@aws-amplify/backend";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import dotenv from "dotenv";

dotenv.config();

const backend = defineBackend({});
const stack = backend.createStack("KilowattsGridStack");

const sentryDsn = process.env.SENTRY_BACKEND_DSN;
if (!sentryDsn) {
  throw new Error("SENTRY_DSN environment variable is required");
}

const sentryEnvironment = process.env.SENTRY_ENVIRONMENT;
if (!sentryEnvironment) {
  throw new Error("SENTRY_BACKEND_DSN environment variable is required");
}

const layers = {
  pydantic: lambda.LayerVersion.fromLayerVersionArn(
    stack,
    "GbSnapshotPydanticLayer",
    "arn:aws:lambda:eu-west-2:770693421928:layer:Klayers-p311-pydantic:10"
  ),
  requests: lambda.LayerVersion.fromLayerVersionArn(
    stack,
    "GbSnapshotRequestsLayer",
    "arn:aws:lambda:eu-west-2:770693421928:layer:Klayers-p311-requests:11"
  ),
  sentry: lambda.LayerVersion.fromLayerVersionArn(
    stack,
    "GbSnapshotSentryLayer",
    "arn:aws:lambda:eu-west-2:943013980633:layer:SentryPythonServerlessSDK:93"
  ),
};

const code = lambda.Code.fromAsset("amplify/python")

// Unable to build the Amplify backend definition.
// Caused By: Error: Cannot use 'publicReadAccess' property on a bucket without allowing bucket-level public access through 'blockPublicAccess' property.
//     at new Bucket (/Users/ben/kilowattsgrid/node_modules/aws-cdk-lib/aws-s3/lib/bucket.js:1:23551)

const s3Bucket = new s3.Bucket(stack, "GbSnapshotBucket", {
  publicReadAccess: true,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // Disable public access block to allow public read access
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  lifecycleRules: [
    {
      expiration: cdk.Duration.days(1), // Objects will be deleted after 24 hours
    },
  ],
  cors: [
    {
      allowedMethods: [s3.HttpMethods.GET], // Allow GET requests
      allowedOrigins: ['*'], // Allow access from any origin
      allowedHeaders: ['*'], // Allow any headers
    },
  ],
});

const nowKey = `now.json`;
const nowUrl = `https://${s3Bucket.bucketRegionalDomainName}/${nowKey}`;

// Define the Lambda function
const gbPointInTime = new lambda.Function(stack, "GbNow", {
  code,
  runtime: lambda.Runtime.PYTHON_3_11,
  environment: {
    SENTRY_DSN: sentryDsn,
    SENTRY_ENVIRONMENT: sentryEnvironment,
    BUCKET: s3Bucket.bucketName,
    NOW_KEY: nowKey,
  },
  handler: "now.handler.handler",
  layers: [layers.pydantic, layers.requests, layers.sentry],
  memorySize: 1000,
  timeout: cdk.Duration.seconds(20),
});

s3Bucket.grantReadWrite(gbPointInTime)


new cdk.CfnOutput(stack, "NowUrl", {
  value:nowUrl
})


const rule = new events.Rule(stack, "FetcherTriggerRule", {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1))
});

rule.addTarget(new targets.LambdaFunction(gbPointInTime));

backend.addOutput({
  custom: {
    nowUrl
  },
});