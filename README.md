# Activity Log Microservice

A scalable event-driven microservice using Node.js and Kafka for real-time processing of user activity logs, following Domain-Driven Design principles.

## Features

- Process user activity logs in real-time with Kafka
- Store processed logs in MongoDB with proper indexing
- Expose a REST API for retrieving logs with pagination and filtering
- Containerized with Docker and deployable with Kubernetes
- Follows DDD (Domain-Driven Design) principles

## Architecture

This microservice follows a DDD-based layered architecture:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Orchestration of use cases
- **Infrastructure Layer**: Technical implementations (Kafka, MongoDB)
- **Interface Layer**: API endpoints and Kafka consumers

## Prerequisites

- Node.js 18+
- MongoDB
- Apache Kafka
- Docker and Docker Compose (for local development)
- Kubernetes (for deployment)

## Local Development

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/activity_logs

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=activity-log-service
KAFKA_CONSUMER_GROUP=activity-log-consumers
KAFKA_TOPIC=activity-logs

# Logging
LOG_LEVEL=info
```

### Running with Docker Compose

The easiest way to run the service locally is using Docker Compose:

```bash
docker-compose up
```

This will start:
- The microservice
- MongoDB database
- Zookeeper
- Kafka broker

### Running without Docker

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure MongoDB and Kafka are running.

3. Start the service:
   ```bash
   npm run dev
   ```

## API Endpoints

### Create Activity Log
```
POST /api/v1/activity-logs
```

Request body:
```json
{
  "userId": "user123",
  "action": "login",
  "resourceType": "account",
  "resourceId": "acc123",
  "metadata": {
    "browser": "Chrome",
    "location": "New York"
  }
}
```

### Get Activity Logs
```
GET /api/v1/activity-logs?userId=user123&action=login&limit=10&skip=0
```

Query parameters:
- `userId`: Filter by user ID
- `action`: Filter by action type
- `resourceType`: Filter by resource type
- `resourceId`: Filter by resource ID
- `status`: Filter by status (`pending`, `processed`, `failed`)
- `dateFrom`: Filter from date (ISO format)
- `dateTo`: Filter to date (ISO format)
- `limit`: Number of results per page (default: 20, max: 100)
- `skip`: Number of results to skip (for pagination)
- `sortBy`: Field to sort by (`createdAt`, `action`, `status`)
- `sortDir`: Sort direction (`asc` or `desc`)

### Get Activity Log by ID
```
GET /api/v1/activity-logs/:id
```

## Deployment

### Kubernetes Deployment

The `/deployment` directory contains Kubernetes manifests for deploying the service to a Kubernetes cluster.

1. Create a Kubernetes secret for MongoDB connection:

```bash
kubectl create secret generic activity-log-secrets \
  --from-literal=MONGODB_URI=mongodb://mongodb-service:27017/activity_logs
```

2. Apply the Kubernetes manifests:

```bash
kubectl apply -f deployment/mongodb/
kubectl apply -f deployment/kafka/
kubectl apply -f deployment/service/
kubectl apply -f deployment/ingress.yaml
```

## Project Structure

```
/src
  /domain              # Domain layer - business rules and entities
  /application         # Application layer - orchestration
  /infrastructure      # Infrastructure layer - technical details
  /interfaces          # Interface layer - API endpoints
  /shared              # Shared utilities and constants
/deployment            # Kubernetes manifests
/docker                # Docker configurations
```

## License

MIT 