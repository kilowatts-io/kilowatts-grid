import logging, os

# Customize the logging format to include the timestamp
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger()
# try to get log level from env and default to info
log_level = os.getenv("LOG_LEVEL")
if not log_level:
    log_level = logging.INFO

logger.setLevel(log_level)
