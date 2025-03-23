Here's a step-by-step guide to installing and running this media streaming app on your PC:
Step 1: Install Node.js
If you don't already have Node.js installed:

Download it from nodejs.org
Choose the LTS (Long Term Support) version
Run the installer and follow the prompts

Step 2: Create a project folder

Create a new folder on your PC where you want to store the application
Open a command prompt or terminal
Navigate to your project folder:
Copycd path/to/your/folder

Step 3: Set up the project

Initialize a new Node.js project:
npm init -y

Install the required packages:
npm install express cors multer react react-dom


Step 4: Set up a bundler (required for React)

Install webpack and babel:
npm install webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react --save-dev

Step 5: Build and run the application

Build the React frontend:
npm run build

Start the server:
npm start

The server should start and output a message like: "Media streaming server running on port 3000"

Step 6: Access the application

Open a web browser on your PC and navigate to:
http://localhost:3000

To access from your iPhone:

Make sure your iPhone is connected to the same WiFi network as your PC
Find your PC's IP address by running ipconfig (Windows) or ifconfig (Mac/Linux) in terminal
On your iPhone, open Safari and navigate to:
http://[your-pc-ip-address]:3000

Step 7: Creating the uploads folder
The server will create an uploads folder automatically when it starts, but you can also create it manually in your project root folder if needed.
That's it! You should now have a working media streaming app that you can use to stream videos and audio from your PC to your iPhone over your local network.
