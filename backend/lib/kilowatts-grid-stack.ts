import * as cdk from "aws-cdk-lib";
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

    const bucket = new s3.Bucket(this, "KilowattsGridBucket", {});

    // output the name of the bucket
    new cdk.CfnOutput(this, "KilowattsGridBucketName", {
      value: bucket.bucketName
    });

    const distribution = new cloudfront.Distribution(
      this,
      "KilowattsGridDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS // Enforce HTTPS
        }
      }
    );

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName
    });

    const handler = new lambda.Function(this, "GbSnapshotHandler", {
      runtime: lambda.Runtime.PYTHON_3_11,
      functionName: "gb-snapshot",
      code: lambda.Code.fromAsset("lambda"),
      handler: "gb_snapshot.handler.handler",
      timeout: cdk.Duration.seconds(45),
      memorySize: 512,
      environment: {
        BUCKET_NAME: bucket.bucketName
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
