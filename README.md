# MongoDB Fundamentals - Week 1

## Setup Instructions

Before you begin this assignment, please make sure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - This is included with MongoDB Community Edition
3. **Node.js** - [Download here](https://nodejs.org/)

### Node.js Package Setup

Once you have Node.js installed, run the following commands in your assignment directory:

```bash
# Initialize a package.json file
npm init -y

# Install the MongoDB Node.js driver
npm install mongodb
```

## Assignment Overview

This week focuses on MongoDB fundamentals including:
- Creating and connecting to MongoDB databases
- CRUD operations (Create, Read, Update, Delete)
- MongoDB queries and filters
- Aggregation pipelines
- Indexing for performance

## Submission

Complete all the exercises in this assignment and push your code to GitHub using the provided GitHub Classroom link.

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install MongoDB locally or set up a MongoDB Atlas account
4. Run the provided `insert_books.js` script to populate your database
5. Complete the tasks in the assignment document

## Files Included

- `Week1-Assignment.md`: Detailed assignment instructions
- `insert_books.js`: Script to populate your MongoDB database with sample book data

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)

  # HOW TO RUN MY REPO
  ## Clone the Repository

  ```
  git clone <YOUR_REPO_URL>
  cd <YOUR_REPO_NAME>
  ```
  ##Dependencies
  - make sure you have mongodb package is installed (npm install mongodb)
  ``` bash
  npm install
  ```
  ## Insert Sample Data
  ``` bash
  node insert_books.js
  ```

  ## Run Queries
  ``` bash
  node queries.js
  ```
  This will execute all queries including:

    - CRUD operations

    - Advanced queries (filtering, projection, sorting, pagination)

    - Aggregation pipelines (average price, most prolific author, decade grouping)

    - Index creation and performance explanation
  # ✅ Outcome

  After running the scripts, you will have:

    - A functioning MongoDB database with a books collection

    - Sample documents for testing queries

    - Queries demonstrating CRUD, filtering, sorting, projection, aggregation, and indexing

    - Verified performance improvements using indexes
