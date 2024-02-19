#

Trigger the Lambda from command line

`aws lambda invoke --function-name kilowatts-grid --payload '{}' test_output.txt` 

Continuous deployment while ignoring the file `test_output.txt`:

`cdk watch`