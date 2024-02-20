import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Or any other level

from .sentry import init_sentry

init_sentry()


def handler(event=None, context=None):
    print("running gb_snapshot")
    from .gb_snapshot import gb_snapshot

    gb_snapshot()
    return "Completed!"


if __name__ == "__main__":
    handler()
