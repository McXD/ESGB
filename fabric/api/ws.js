const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');

// Setup Express server
const app = express();

// Setup WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Function to stream Docker logs
const streamLogs = (containerName, ws) => {
  const logStream = spawn('docker', ['logs', '-f', containerName]);

  // Send logs to WebSocket client
  logStream.stdout.on('data', (data) => {
    ws.send(`${containerName}: ${data}`);
  });

  // Handle errors
  logStream.stderr.on('data', (data) => {
    ws.send(`Error: ${data}`);
  });

  logStream.on('close', () => {
    ws.send(`${containerName} log stream closed`);
  });

  // Close the WebSocket when the client disconnects
  ws.on('close', () => {
    logStream.kill();
  });
};

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const container = req.url.split('/').pop();

  console.log(`WebSocket connected for ${container}`);

  if (container === 'org1') {
    streamLogs('peer0.org1.example.com', ws);
  } else if (container === 'org2') {
    streamLogs('peer0.org2.example.com', ws);
  }
});

// Upgrade HTTP requests to WebSocket connections
app.use((req, res, next) => {
  if (req.url.startsWith('/logs/')) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    next();
  }
});

// Start the server
app.listen(3002, () => {
  console.log('Server running on port 3002');
});
