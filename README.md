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

## Architecture Decisions

### Event-Driven Approach
We chose an event-driven architecture with Kafka as the backbone for several reasons:
- **Decoupling**: The producer of activity logs (client applications) is completely decoupled from the consumer (our processing service)
- **Scalability**: Kafka provides horizontal scalability to handle high throughput of events
- **Reliability**: Events are persisted in Kafka, ensuring no data loss even during service outages
- **Asynchronous Processing**: Activity logging doesn't block the main user flow

### Domain-Driven Design
The implementation follows DDD principles to maintain a clean separation of concerns:
- **Domain Layer**: Contains the core business logic and entity definitions, free from technical details
- **Application Layer**: Orchestrates use cases by coordinating domain objects and services
- **Infrastructure Layer**: Implements technical concerns like database access and message handling
- **Interface Layer**: Provides external access through REST APIs and Kafka consumers

### Technology Choices
- **MongoDB**: Selected for its flexible schema, which is ideal for activity logs that may have varying metadata structures. Implemented with proper indexing for efficient queries.
- **Kafka**: Used for reliable event streaming, allowing the system to handle spikes in activity and providing a buffer during processing service outages.
- **Express.js**: Provides a lightweight and flexible REST API framework with robust middleware support for validation and error handling.
- **Node.js**: Offers excellent performance for I/O-bound operations typical in a microservice that primarily deals with network and database operations.

### Resilience Patterns
- **Circuit Breakers**: Implemented to prevent cascading failures when dependent services are unavailable
- **Graceful Degradation**: The system continues to function (accepting API requests) even when Kafka is unavailable
- **Retry Mechanisms**: Failed Kafka message processing is retried with exponential backoff
- **Error Handling**: Comprehensive error handling across all layers with proper logging

### Deployment Strategy
- **Docker Containerization**: Ensures consistent environments across development and production
- **Kubernetes Orchestration**: Provides automated scaling, self-healing, and zero-downtime deployments
- **Infrastructure as Code**: All deployment configurations are version-controlled alongside the application code

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