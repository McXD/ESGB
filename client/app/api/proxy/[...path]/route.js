import { NextResponse } from 'next/server';

export async function GET(req) {
  const [_, path] = req.url.split('proxy');
  const backendUrl = `http://host.docker.internal:3001${path}`;

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
  const url = `http://host.docker.internal:3001/${path.join('/')}`;

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
