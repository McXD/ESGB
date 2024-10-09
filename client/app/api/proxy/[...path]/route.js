import { NextResponse } from 'next/server';

// check environment variable to determine if we are in development or production
const hostname = process.env.NODE_ENV === 'production' ? 'esgb-api-server' : 'localhost';

console.log('hostname:', hostname);

export async function GET(req) {
  const [_, path] = req.url.split('proxy');
  const backendUrl = `http://${hostname}:3001${path}`;

  console.log(`Fetching data from: ${backendUrl}`);

  try {
    const response = await fetch(backendUrl);
    const data = await response.json();

    console.log('Data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from blockchain backend:', error);
    return NextResponse.json({ error: 'Failed to fetch from blockchain backend' }, { status: 500 });
  }
}


export async function POST(req, { params }) {
  const { path } = params;
  const body = await req.json();  // Get the body from the frontend request

  // Construct the URL to the blockchain backend
  const url = `http://${hostname}:3001/${path.join('/')}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Failed to post to blockchain backend' }, { status: 500 });
  }
}
