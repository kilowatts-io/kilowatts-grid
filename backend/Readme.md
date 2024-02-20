# Backend


# Lambda Function: GbSnapshotHandler

Each minute, this function is fired by the eventRule, which in turn:

1. Queries BM API for the latest MELS, PN and BOALFs
2. Queries the National Grid Embedded API for the latest embedded wind/solar forecast
3. Interpolates a snapshot for the next minute
4. Outputs this to S3.

Trigger the Lambda from command line

`aws lambda invoke --function-name kilowatts-grid --payload '{}' test_output.txt` 

Continuous deployment while ignoring the file `test_output.txt`:

`cdk watch`