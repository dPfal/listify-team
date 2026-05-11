# Listify - Grocery List Manager (Team 20)

This project was developed as part of IFN636 Software Life Cycle Management Assessment 2.

Listify is a full-stack grocery list management web application designed to help users organize and manage grocery items efficiently.  
The system supports secure authentication, multiple grocery lists, profile management, intelligent item suggestions, and category-based organization to improve the overall shopping experience.

---

## Live Demo

Public URL:  
http://13.210.13.18/

---

## Features

### User Features
- User Registration and Login
- JWT-based Authentication and Authorization
- Create Multiple Grocery Lists
- Create, Read, Update, and Delete Grocery Items
- Mark Grocery Items as Completed
- Category-based Grocery Organization
- Intelligent Item Suggestions
- User Profile Management
- Update Username and Profile Information
- Responsive Mobile-first UI Design
- Protected User Dashboard

### Developer Features
- RESTful API Development
- Frontend and Backend Validation
- Middleware-based Route Protection
- API Testing
- Functional Testing
- CI/CD Pipeline using GitHub Actions
- Cloud Deployment using AWS EC2
- Process Management using PM2
- Reverse Proxy Configuration using Nginx
- GitHub Branching and Pull Request Workflow

---

## Demo Account

You can use the following demo account to test the system:

- Username: user1
- Password: user1234

This account contains sample grocery data for demonstration purposes.

---

## Tech Stack

### Frontend
- React
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### DevOps and Deployment
- AWS EC2
- PM2
- Nginx
- GitHub Actions

### Testing
- Mocha
- Chai
- Sinon

---

## System Architecture

- Frontend is developed using React and served through Nginx.
- Backend API is developed using Express.js and runs on port 5001.
- MongoDB is used for persistent data storage.
- PM2 is used to maintain backend process reliability.
- GitHub Actions automates testing and deployment workflows.

---

## Key Functionalities

### Grocery List Management
Users can create and manage multiple grocery lists for different purposes such as weekly shopping, meal preparation, or household supplies.

### Grocery Item Management
Users can add, update, delete, and organize grocery items within each list.

### Item Suggestion Feature
The system provides grocery item suggestions to improve user convenience and reduce repetitive input.

### User Profile Management
Users can manage their account information and personalize their profile settings securely.

### Authentication and Security
JWT authentication and protected backend middleware are used to secure user data and restrict unauthorized access.

---

## Team Collaboration

The project was developed collaboratively by Team 20 using Agile-inspired workflows and GitHub version control practices.

The team used:
- Feature branches
- Pull requests
- Code reviews
- Commit tracking
- GitHub Actions workflows

to support collaborative software development and continuous integration.

---

## CI/CD Pipeline

GitHub Actions is configured to:
- Install dependencies automatically
- Run backend automated tests
- Validate workflow execution
- Support deployment automation

The CI/CD pipeline helps improve reliability and maintain consistent software quality.

---

## Testing

### Functional Testing
- Authentication verification
- Multiple grocery list testing
- Grocery item CRUD testing
- Profile management testing
- Item completion workflow testing
- Item suggestion validation

### API Testing
- Endpoint validation
- HTTP response verification
- Error handling validation

### Automated Testing
- Unit testing using Mocha, Chai, and Sinon

---

## Future Improvements

Potential future improvements include:
- Shared grocery lists between users
- Real-time synchronization
- AI-powered shopping recommendations
- Barcode scanning support
- Push notifications
- Docker containerization
- HTTPS configuration
