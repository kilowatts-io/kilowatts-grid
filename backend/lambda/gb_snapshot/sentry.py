import sentry_sdk, os
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration


def init_sentry():
    sentry_sdk.init(
        dsn=os.environ["SENTRY_DSN"],
        integrations=[AwsLambdaIntegration(timeout_warning=True)],
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment=os.environ["SENTRY_ENVIRONMENT"],
    )
