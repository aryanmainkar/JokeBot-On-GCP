# Joke Bot Application

## Project Overview

This project sets up a Joke Bot application on Google Cloud Platform (GCP), integrating DialogFlow, Firestore, and App Engine services.

## Purpose

The Joke Bot responds to user queries with humor using DialogFlow for natural language processing and Firestore for data storage. The script deploys the application on GCP's App Engine.

## URLs

- **DialogFlow:** [DialogFlow Agent](https://dialogflow.cloud.google.com/#/editAgent/iron-flash-397317/)
- **Firestore:** [Firestore Project](https://console.firebase.google.com/project/iron-flash-397317/overview)
- **Webpage:** [Live Webpage](https://iron-flash-397317.uc.r.appspot.com/)

## Deployment and Updates

To update the Webpage:

gcloud auth login
gcloud app deploy

## To launch the application directly from the command line, use the following command:
gcloud app browse

## Requirements
Ensure the following components are configured:

Compute Service: App Engine
Data Persistence: Firestore
Other Components: DialogFlow, Cloud Functions

## Usage
The Joke Bot responds to user queries with humor, creating an entertaining and interactive user experience. Configure and update intents in DialogFlow to enhance the bot's responses
