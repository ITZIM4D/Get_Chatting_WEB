# Get Chatting (Web)
This project is a web-based chat application that enables real-time messaging using Node.js, React.js, and Socket.IO.

## Table of Contents
-[Prerequisites](#prerequisites)
-[Installation and Running](#installation-and-running)
-[Features](#features)
-[Tech Stack](#tech-stack)

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/)

## Installation and Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ITZIM4D/Get_Chatting_WEB
   cd get-chatting-web
   ```

2. **Make .env file**
   The environment variables you need to fill in are:
   ```bash
   DATABASE_URL=postgres://chatuser:@localhost:5432/chatdb
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   ```

3. **Build the docker image:**
   ```bash
   docker-compose build
   ```

4. **Start the service:**
   ```bash
   docker-compose up
   ```
   ##### Or run in detached mode:
   ```bash
   docker-compose up -d
   ```

5. **Open your browser and go to:**
   ```bash 
   http://localhost:5173
   ```

Make sure you have [Node.js](https://nodejs.org/) installed either through the link or through your package manager of choice.

## Features
- Logging in and out as a user
- Global Chat between users
- Registering as a user
- Creating chat rooms
- Switching between chat rooms


## Tech Stack
- **Frontend:** React.js  
- **Backend:** Node.js, Socket\.IO  
- **Database:** PostgreSQL  
- **Containerization:** Docker  
