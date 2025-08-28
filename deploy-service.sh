#!/bin/bash

SERVICE_NAME=${1:-js-player}
REGION=${2:-us-central1}

gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated
