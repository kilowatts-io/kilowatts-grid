import requests, os


def handler(event, context):
    url  = os.environ['URL']
    requests.get(url)
    