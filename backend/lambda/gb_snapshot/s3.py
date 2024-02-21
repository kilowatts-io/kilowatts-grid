# write the output to the s3 bucket
import boto3, os, logging
from .ptypes import GbGridSnapshot, SummaryOutput

s3 = boto3.client("s3")
bucket = os.environ["BUCKET_NAME"]


def write_s3_json(snapshot: GbGridSnapshot):
    s3.put_object(
        Body=snapshot.model_dump_json(), Bucket=bucket, Key="gb/snapshot.json"
    )


def write_summary_output(summary_output: SummaryOutput):
    Body = summary_output.model_dump_json()
    size_mb = len(Body) / 1024 / 1024
    logging.info(
        f"file_size: {round(size_mb, 3)} mb writing to s3://{bucket}/gb/summary_output.json"
    )
    s3.put_object(
        Body=Body,
        Bucket=bucket,
        Key="gb/summary_output.json",
        CacheControl="max-age=180",
    )
    logging.info("wrote summary output to s3")
