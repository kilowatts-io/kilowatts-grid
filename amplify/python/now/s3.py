import boto3
import os
import json

def get_bucket():
    return os.getenv("BUCKET")

def write_to_s3(body:str, key):
    s3 = boto3.client("s3")
    bucket = get_bucket()
    s3.put_object(Bucket=bucket, Key=key, Body=body)
    
def read_from_s3(key):
    s3 = boto3.client("s3")
    bucket = get_bucket()
    response = s3.get_object(Bucket=bucket, Key=key)
    return json.loads(response["Body"].read().decode("utf-8"))