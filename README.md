# Chat Application

## Description
A real-time chat application built using Node.js, Express, Socket.IO, and MongoDB. This application allows multiple users to join chat rooms and exchange messages in real-time, with messages stored in a MongoDB database.

## Features
- Real-time messaging with Socket.IO
- Multiple chat rooms
- User notifications for joining and leaving chat rooms
- MongoDB for message persistence

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/chat_app.git
    cd chat_app
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/chatapp
    ```

## Configuration
- **PORT**: The port number where the server will run.
- **MONGODB_URI**: The MongoDB connection string.

## Usage

### Running the Server
1. Start the server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000` to use the chat application.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
