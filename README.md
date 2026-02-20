# Dynamo CRUD API

A fully serverless REST API built on AWS Lambda and DynamoDB, deployed automatically via GitHub Actions. Supports complete Create, Read, Update, and Delete operations for posts.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20.x |
| Compute | AWS Lambda |
| Database | AWS DynamoDB |
| API Gateway | AWS API Gateway (HTTP) |
| IaC | Serverless Framework |
| CI/CD | GitHub Actions |
| Notifications | Slack Webhooks |

## Architecture

```
Client → API Gateway → Lambda Functions → DynamoDB
                            ↓
                     GitHub Actions (CI/CD)
                            ↓
                     Slack (Notifications)
```

Each Lambda function is assigned its own minimal IAM role (principle of least privilege).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/posts` | Retrieve all posts |
| `GET` | `/post/{postId}` | Retrieve a single post by ID |
| `POST` | `/post` | Create a new post |
| `PUT` | `/post/{postId}` | Update an existing post |
| `DELETE` | `/post/{postId}` | Delete a post |

All endpoints return JSON and have CORS enabled.

### Response Format

```json
{
  "message": "descriptive message",
  "data": {}
}
```

## Project Structure

```
dynamo-crud-api/
├── .github/
│   └── workflows/
│       └── main.yml        # CI/CD pipeline
├── api.js                  # Lambda handler functions
├── db.js                   # DynamoDB client initialization
├── serverless.yml          # Serverless Framework config (infra + routes)
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Serverless Framework CLI](https://www.serverless.com/framework/docs/getting-started)
- AWS account with appropriate permissions

### Install Dependencies

```bash
npm install
```

### Deploy Manually

```bash
npm install -g serverless

export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

serverless deploy --stage dev --region us-east-1
```

## CI/CD Pipeline

Every push to `main` triggers an automated GitHub Actions workflow:

1. Checkout code
2. Set up Node.js 20 with npm caching
3. Install dependencies (`npm ci`)
4. Deploy via Serverless Framework
5. Send a Slack notification (success or failure) with commit info, actor, and deployment duration

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `SLACK_WEBHOOK_URL` | Incoming webhook URL for Slack notifications |

## Infrastructure Details

- **DynamoDB Table**: Configured via `serverless.yml`
- **Primary Key**: `postId` (String)
- **Billing**: On-demand (pay-per-request)
- **Lambda Memory**: 128 MB
- **Lambda Timeout**: 10 seconds
- **Region**: Configured via `serverless.yml`
