Project Overview
The Streamify App allows users to upload, manage, and review on videos. It includes features like video details editing, video content management.

This README provides an overview of the application's features, setup instructions and technical design.

Project Architecture
The application follows a three-tier architecture:

Frontend (Client Side): Built with Nextron (Electron and Next.js), it handles the user interface, routing, and component rendering.
Backend (Server Side): Developed using ASP.NET Core, it manages API requests and database interactions.
Database: Postgres is used to store user data, videos and reviews.

Technologies Used

Frontend
Nextron (Electron and Next.js): For building the user interface and managing navigation.
Axios: For handling HTTP requests to the backend.
HTML/CSS: For structuring and styling the application.

Backend
ASP.NET Core: For building the API and handling server-side logic.
Entity Framework Core: To interact with the Microsoft SQL Server database.
Identity: For handling authentication and authorization.

Authentication
JWT-based Authentication: Users need to log in to perform actions like uploading videos or leaving reviews. Upon authentication, the JWT token is stored in local storage and passed with authorized requests.

Business Logic
Controllers: Manage incoming requests, validate data, and use Entity Framework Core for database interactions.

Database
Postgres (Online instance managed through pgAdmin app): Used to create the relational database that stores user details, videos, review, and replies.
Cloudinary: Videos are stored in Cloudinary, and their links are saved in the database.

Application Features
Video Management
Users can upload videos by dragging and dropping them.
Review can be added, updated, or deleted.
Users can upload videos with titles and descriptions.
Videos titles and descriptions can be edited by the user who posted them.
Videos can be viewed in detail along with associated review and metadata (such as the number of review).
Validation Messages
Various validation messages notify users about incorrect credentials or video upload requirements (e.g., video description should not exceed 250 characters).

Setting Up the Development Environment

Prerequisites
Node.js: For running the frontend Nextron application.

Setup Instructions
Clone the Repository
GitHub Repository: https://github.com/SeratiVilankulu/Nextron_Assessment.git

Backend Setup
dotnet ef database update
Start the backend:

1. Navigate into the Backend directory (File for backend: api).
2. Run command int terminal: dotnet watch run

Frontend Setup
Navigate into the Frontend directory (File for Frontend: api).
Install dependencies: npm install (for Frontend)
Start the Nextron development server: npm run dev

How the App Runs
Open the terminal and navigate to the frontend and backend directories.
Run the backend API (Swagger): dotnet watch run
Run the frontend: npm run dev

Login Details of registered users (You can use any of these user details to login)

Emily
emily123@test.com
Password123!

Thabang
mpilo345@test.com
P@ssword345&

Patric
pmicheals678@test.com
pAssw0rd678*

Linda
LMLousi910@test.com
Pa55word910@

Olivia
olivemarks@test.com
PA55w0rd5#