---
title: "Executive AI Assistant (EAIA)"
description: "An open-source AI agent that replicates key tasks of an executive assistant, from triaging emails to scheduling meetings."
image: "assets/images/eaia.png"
author: "Your Name"
date: "Jan 20, 2024"
image: "assets/images/aiassistance.jpg"
tags: ["AI Assistant", "Open Source", "Productivity"]
category: "AI Apps"
---

# Executive AI Assistant (EAIA)

The **Executive AI Assistant (EAIA)** is an open-source project designed to handle the routine tasks of an executive assistant. By leveraging advanced language models, EAIA can organize email inboxes, schedule meetings, and help respond to messages, freeing up time for more strategic work. The project provides a configuration-driven approach, making it easier for you to tailor EAIA to your specific workflow and preferences.

## Key Features

### Automated Email Management
EAIA can monitor your inbox, triage incoming messages based on your custom rules, and even draft response emails.

### Calendar Integration
EAIA suggests meeting times and coordinates schedules by integrating with your Google Calendar preferences.

### Configurable Tone & Style
Customize the tone for outgoing messages, from formal to friendly, ensuring your communications match your personal or company brand.

### Extensibility & Customization
The project's codebase includes separate logic for reflection, triage, and rewriting, allowing you to modify or extend components to fit your specific needs.

## Getting Started

### 1. Environment Setup
- Fork and clone the [Executive AI Assistant GitHub repo]
- Create and activate a Python virtual environment
- Install dependencies:

```bash
pip install -e .
```

### 2. Configure Credentials
- Export your OpenAI or Anthropic API keys
- Enable the Gmail API, download client credentials, and run a setup script to generate the required tokens

### 3. Local Development
- Launch the development server:

```bash
langgraph dev
```

- In a new terminal window, run the ingest script to process your recent emails:

```bash
python scripts/run_ingest.py --minutes-since 120 --rerun 1 --early 0
```

### 4. Production & Cron Jobs
- Deploy EAIA to LangGraph Cloud with your GitHub repo
- Configure environment variables for your keys and tokens
- Set up a cron job to periodically ingest new emails in the background

## Resources

### GitHub Repository
The [Executive AI Assistant repo](https://github.com/langchain-ai/executive-ai-assistant) has the full source code, instructions, and updates.

### Documentation
The project's documentation (included in the repo) walks you through environment setup, credentials, and configuration.

## Tutorials

### Local Testing
Try running EAIA in local mode to confirm everything works and to experiment with the triage logic or rewriting features before deploying.

### Cloud Deployment
Deploy EAIA on [LangGraph Cloud] to maintain a persistent service that can handle email ingestion around the clock.

---

Whether you're a busy professional seeking to automate tedious scheduling and email tasks or an enthusiast looking to experiment with cutting-edge AI automation, EAIA provides a flexible, open-source platform to streamline your daily workflow. Give it a try and customize it to fit your needs!