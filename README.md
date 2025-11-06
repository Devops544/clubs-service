# 🏢 Clubs Service

A comprehensive GraphQL API service for managing clubs, amenities, resources, location contacts, and working hours calendars.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Clubs Service provides a complete GraphQL API for managing:

- **Clubs** - Core club information, settings, and configurations
- **Amenities** - Club facilities and services (restaurant, wifi, bar, etc.)
- **Resources** - Court bookings, equipment, and facilities
- **Location Contacts** - Address, phone, social media links
- **Working Hours** - Calendar management and availability

### Key Features

- ✅ **GraphQL API** with full type safety
- ✅ **Multi-field Filtering** with advanced search capabilities
- ✅ **PostgreSQL Database** with TypeORM
- ✅ **Automatic Schema Generation**
- ✅ **Comprehensive Validation**
- ✅ **RESTful Error Handling**
- ✅ **Real-time Logging**

## 🔧 Prerequisites

Before running the service, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **PostgreSQL** (v12 or higher)
- **Git** for version control

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: macOS, Linux, or Windows

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Tournated-Backend/apps/clubs-service
```

### 2. Install Dependencies

Using **pnpm** (recommended):

```bash
pnpm install
```

Or using **npm**:

```bash
npm install
```

### 3. Install Global Dependencies

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Install TypeORM CLI globally
npm install -g typeorm
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=clubs_service

# Application Configuration
PORT=3001
NODE_ENV=development

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash

```

#### Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database:

````sql
CREATE DATABASE clubs_service;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE clubs_service TO your_username;

### Development Mode

```bash
# Start the service in watch mode
npm run start:dev

# Or using NestJS CLI
nest start --watch
````

### Production Mode

````bash
# Build the application
npm run build

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the service
pm2 start dist/main.js --name clubs-service

# Monitor the service
pm2 monit

# View logs
pm2 logs clubs-service
````

## 📚 API Documentation

### GraphQL Playground

Once the service is running, access the GraphQL Playground at:

```
http://localhost:3001/graphql
```

### API Documentation

Comprehensive API documentation is available in:

- **`API_DOCUMENTATION.md`** - Complete API reference with examples

### Quick Start Examples

#### 1. Create a Club

```graphql
mutation CreateClub($input: CreateClubSetupInput!) {
  createClub(input: $input) {
    id
    generalInfo {
      title
      typeOfClub
    }
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "generalInfo": {
      "title": "My Tennis Club",
      "description": "Premium tennis facility",
      "typeOfClub": "TENNIS",
      "sports": ["TENNIS"],
      "additionalServices": ["RESTAURANT", "WIFI"],
      "isPartOfChain": false
    }
  }
}
```

#### 2. Search Clubs

```graphql
query SearchClubs($input: ClubMultiFieldQueryInput!) {
  searchClubs(input: $input) {
    id
    generalInfo {
      title
      typeOfClub
    }
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "filters": [
      {
        "field": "generalInfo",
        "value": "Tennis",
        "operator": "CONTAINS"
      }
    ],
    "relations": []
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Integration Tests

```bash
# Run integration tests
npm run test:e2e
```

### Manual Testing with cURL

```bash
# Test service health
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name } } }"}'

# Test club creation
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateClub($input: CreateClubSetupInput!) { createClub(input: $input) { id generalInfo { title } } }",
    "variables": {
      "input": {
        "generalInfo": {
          "title": "Test Club",
          "typeOfClub": "TENNIS"
        }
      }
    }
  }'
```

## 🛠️ Development

### Project Structure

```
src/
├── modules/
│   ├── club/                 # Club management
│   │   ├── entities/         # Club entity definitions
│   │   ├── dto/             # Data transfer objects
│   │   ├── club.resolver.ts  # GraphQL resolvers
│   │   └── club.service.ts   # Business logic
│   ├── resources/            # Resources and amenities
│   ├── contact-details/      # Location contacts
│   └── working-hours/        # Working hours calendar
├── common/                   # Shared utilities
├── main.ts                   # Application entry point
└── app.module.ts            # Root module
```

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start with debugging enabled

# Building
npm run build              # Build the application
npm run build:watch        # Build in watch mode

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run schema:drop        # Drop database schema
npm run schema:sync        # Sync database schema

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run integration tests

# Linting
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
```

### Code Style

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **NestJS** conventions

### Adding New Features

1. **Create Entity**: Define your database entity
2. **Create DTOs**: Define input/output types
3. **Create Service**: Implement business logic
4. **Create Resolver**: Define GraphQL operations
5. **Update Module**: Register new components
6. **Add Tests**: Write unit and integration tests

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use kill-port utility
npx kill-port 3001
```

#### 2. Database Connection Issues

```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Test connection
psql -h localhost -U your_username -d clubs_service
```

#### 3. Migration Issues

```bash
# Reset database
npm run schema:drop
npm run migration:run

# Or manually drop and recreate
psql -h localhost -U your_username -c "DROP DATABASE clubs_service;"
psql -h localhost -U your_username -c "CREATE DATABASE clubs_service;"
```

#### 4. Dependency Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Debug Mode

```bash
# Start with debugging enabled
npm run start:debug

# Attach debugger on port 9229
# Use VS Code debugger or Chrome DevTools
```

### Logs

```bash
# View application logs
tail -f logs/application.log

# View error logs
tail -f logs/error.log

# View all logs
tail -f logs/*.log
```

## 📊 Monitoring

### Health Check

```bash
# Check service health
curl http://localhost:3001/health

# Check GraphQL endpoint
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name } } }"}'
```

### Performance Monitoring

- **Response Times**: Monitor GraphQL query performance
- **Database Queries**: Check TypeORM query logs
- **Memory Usage**: Monitor Node.js memory consumption
- **Error Rates**: Track error frequency and types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check `API_DOCUMENTATION.md`
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

---

## 🚀 Quick Start Checklist

- [ ] Install Node.js and PostgreSQL
- [ ] Clone the repository
- [ ] Install dependencies: `pnpm install`
- [ ] Configure environment variables
- [ ] Set up the database
- [ ] Run migrations: `npm run migration:run`
- [ ] Start the service: `npm run start:dev`
- [ ] Open GraphQL Playground: `http://localhost:3001/graphql`
- [ ] Test with the provided examples

---

_Last Updated: September 26, 2025_  
_Version: 1.0.0_
