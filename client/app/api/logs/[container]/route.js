import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(req, { params }) {
  const { container } = params; // Get the container name from the URL (e.g., org1 or org2)

  // Map the container names to the Docker container names
  const containerMap = {
    org1: 'peer0.org1.example.com',
    org2: 'peer0.org2.example.com',
  };

  const containerName = containerMap[container];

  console.log(`Fetching logs for container: ${containerName}`);

  if (!containerName) {
    return NextResponse.json({ error: 'Invalid container name' }, { status: 400 });
  }

  try {
    // Fetch the Docker logs for the container using `docker logs`
    const logs = await getDockerLogs(containerName);

    console.log('Logs:', logs);

    return NextResponse.json({ container: container, logs: logs.split('\n') });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

// Function to get Docker logs using `docker logs` command
const getDockerLogs = (containerName) => {
  return new Promise((resolve, reject) => {
    const logStream = spawn('docker', ['logs', '--tail', '50', containerName]); // Fetch the last 1 log
    let logs = '';  // This will store both stdout and stderr logs

    // Append any data from stdout (standard output) to the logs string
    logStream.stdout.on('data', (data) => {
      logs += data.toString();  // Convert buffer to string and append to logs
    });

    // Append any data from stderr (standard error) to the logs string
    logStream.stderr.on('data', (data) => {
      logs += data.toString();  // Convert buffer to string and append to logs
    });

    // Once the stream is closed, resolve the Promise with the collected logs
    logStream.on('close', () => {
      resolve(logs);  // Resolve with all logs (including error messages if any)
    });

    // In case of an unexpected error with the child process, reject the promise
    logStream.on('error', (error) => {
      reject(`Failed to fetch logs: ${error.message}`);
    });
  });
};

