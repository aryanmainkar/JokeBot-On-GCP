# Joke Bot Application

## Project Overview

# This script sets up a Joke Bot application on Google Cloud Platform (GCP). 
# The application integrates DialogFlow, Firestore, and App Engine services.

## Purpose

# The Joke Bot responds to user queries with humor using DialogFlow for natural language processing 
# and Firestore for data storage. The script deploys the application on GCP's App Engine.

## URLs

DIALOGFLOW_URL="https://dialogflow.cloud.google.com/#/editAgent/iron-flash-397317/"
FIRESTORE_URL="https://console.firebase.google.com/project/iron-flash-397317/overview"
WEBPAGE_URL="https://iron-flash-397317.uc.r.appspot.com/"

## Deployment and Updates

# To update the Webpage:
gcloud auth login
gcloud app deploy

# To launch directly from the CLI:
gcloud app browse

## Requirements

# Ensure the following components are configured:
# - Compute Service: App Engine
# - Data Persistence: Firestore
# - Other Components: DialogFlow, Cloud Functions

## Usage

# The Joke Bot responds to user queries with humor, creating an entertaining and interactive user experience. 
# Configure and update intents in DialogFlow to enhance the bot's responses.
