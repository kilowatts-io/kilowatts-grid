import * as cdk from "aws-cdk-lib";
import { Cors, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { defineBackend } from "@aws-amplify/backend";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";


const backend = defineBackend({});

const stack = backend.createStack("KilowattsGridStack");

// const sentryDsn = process.env.SENTRY_DSN;
// if (!sentryDsn) {
//   throw new Error("SENTRY_DSN environment variable is required");
// }

// const sentryEnvironment = process.env.SENTRY_ENVIRONMENT;
// if (!sentryEnvironment) {
//   throw new Error("SENTRY_ENVIRONMENT environment variable is required");
// }

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

const s3Bucket = new s3.Bucket(stack, "GbSnapshotBucket")

// Define the Lambda function
const gbPointInTime = new lambda.Function(stack, "GbNow", {
  code,
  runtime: lambda.Runtime.PYTHON_3_11,
  functionName: 'gb-now-snapshot',
  environment: {
    // SENTRY_DSN: sentryDsn,
    // SENTRY_ENVIRONMENT: sentryEnvironment,
    BUCKET: s3Bucket.bucketName
  },
  // functionName: "gb-now",
  handler: "now.handler.handler",
  layers: [layers.pydantic, layers.requests, layers.sentry],
  memorySize: 1000,
  timeout: cdk.Duration.seconds(20),
});

s3Bucket.grantReadWrite(gbPointInTime)

// Create a new REST API
const kilowattsGridApi = new RestApi(stack, "KilowattsGridRestApi", {
  restApiName: "kilowattsGridApi",
  deployOptions: {
    cacheClusterEnabled: true, // Enable cache for the stage
    cacheClusterSize: "0.5", // 0.5 GB Cache
    cacheTtl: cdk.Duration.seconds(60) // Cache TTL set to 60 seconds,
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow

  },
});

const nowPath = kilowattsGridApi.root.addResource("now");
nowPath.addMethod("GET", new LambdaIntegration(gbPointInTime));

const nowUrl = kilowattsGridApi.url + nowPath.path;

new cdk.CfnOutput(stack, "NowUrl", {
  value:nowUrl
})

const fetcher = new lambda.Function(stack, "Fetcher", {
  runtime: lambda.Runtime.PYTHON_3_11,
  code,
  timeout: cdk.Duration.seconds(20),
  handler: "fetchers.now.handler",
  environment: {
    URL: nowUrl
  },
  layers: [layers.requests]
});

// add event rule that triggers the fetcher every minute
const rule = new events.Rule(stack, "FetcherTriggerRule", {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1))
});

// Bind the CloudWatch event rule to the Fetcher Lambda function
rule.addTarget(new targets.LambdaFunction(fetcher));

backend.addOutput({
  custom: {
    nowUrl,
    API: {
      [kilowattsGridApi.restApiName]: {
        endpoint: kilowattsGridApi.url,
        region: cdk.Stack.of(kilowattsGridApi).region,
      },
    },
  },
});