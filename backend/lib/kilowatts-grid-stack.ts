import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class KilowattsGridStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "KilowattsGridBucket", {
      cors: [
        {
          allowedOrigins: [
            "https://gb.kilowatts.io",
            "https://gb-preview.kilowatts.io",
            "http://localhost:19006"
          ],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedHeaders: ["*"]
        }
      ]
    });

    new cdk.CfnOutput(this, "KilowattsGridBucketName", {
      value: bucket.bucketName
    });

    const certificateArn = process.env.ACM_CERTIFICATE_ARN;
    if (!certificateArn)
      throw new Error("ACM_CERTIFICATE_ARN environment variable is required");

    const cdnDomainName = process.env.CDN_DOMAIN_NAME;
    if (!cdnDomainName)
      throw new Error("CDN_DOMAIN_NAME environment variable is required");

    const distribution = new cloudfront.Distribution(
      this,
      "KilowattsGridDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          originRequestPolicy: new cloudfront.OriginRequestPolicy(
            this,
            "KilowattsGridDistributionRequestPolicy",
            {
              headerBehavior:
                cloudfront.OriginRequestHeaderBehavior.allowList("Origin")
            }
          ),
          cachePolicy: new cloudfront.CachePolicy(this, "CachePolicy", {
            cachePolicyName: "CorsCachePolicy",
            headerBehavior: cloudfront.CacheHeaderBehavior.allowList("Origin")
          })
        },

        domainNames: [cdnDomainName],
        certificate: acm.Certificate.fromCertificateArn(
          this,
          "KilowattsGridCertificate",
          certificateArn
        )
      }
    );

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName
    });

    const sentryDsn = process.env.SENTRY_DSN;
    if (!sentryDsn)
      throw new Error("SENTRY_DSN environment variable is required");

    const sentryEnvironment = process.env.SENTRY_ENVIRONMENT;
    if (!sentryEnvironment)
      throw new Error("SENTRY_ENVIRONMENT environment variable is required");

    const handler = new lambda.Function(this, "GbSnapshotHandler", {
      runtime: lambda.Runtime.PYTHON_3_11,
      functionName: "gb-snapshot",
      code: lambda.Code.fromAsset("lambda"),
      handler: "gb_snapshot.handler.handler",
      timeout: cdk.Duration.seconds(60),
      memorySize: 512,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        SENTRY_DSN: sentryDsn,
        SENTRY_ENVIRONMENT: sentryEnvironment
      },
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "GbSnapshotPydanticLayer",
          "arn:aws:lambda:eu-west-2:770693421928:layer:Klayers-p311-pydantic:4"
        ),
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "GbSnapshotPandasLayer",
          "arn:aws:lambda:eu-west-2:770693421928:layer:Klayers-p311-pandas:7"
        ),
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "GbSnapshotRequestsLayer",
          "arn:aws:lambda:eu-west-2:770693421928:layer:Klayers-p311-requests:5"
        ),
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "GbSnapshotSentryLayer",
          "arn:aws:lambda:eu-west-2:943013980633:layer:SentryPythonServerlessSDK:93"
        )
      ]
    });
    bucket.grantWrite(handler);

    const eventRule = new events.Rule(this, "scheduleRule", {
      schedule: events.Schedule.cron({ minute: "*" })
    });
    eventRule.addTarget(new targets.LambdaFunction(handler));
  }
}
