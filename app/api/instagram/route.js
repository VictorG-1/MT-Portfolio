import { getInstagramThumbnail } from '../../../utils/getInstagramThumbnail';

/**
 * Next.js API Route for fetching Instagram thumbnails server-side
 * This avoids CORS issues and rate limiting on the client
 */
export async function POST(request) {
  try {
    const { reelUrl } = await request.json();

    if (!reelUrl) {
      return Response.json(
        { error: 'reelUrl is required' },
        { status: 400 }
      );
    }

    const thumbnail = await getInstagramThumbnail(reelUrl);

    return Response.json({ thumbnail });
  } catch (error) {
    console.error('Error fetching Instagram thumbnail:', error);
    return Response.json(
      { error: 'Failed to fetch thumbnail', thumbnail: '/fallback.jpg' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for batch fetching (optional)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reelUrl = searchParams.get('url');

  if (!reelUrl) {
    return Response.json(
      { error: 'url parameter is required' },
      { status: 400 }
    );
  }

  try {
    const thumbnail = await getInstagramThumbnail(reelUrl);
    return Response.json({ thumbnail });
  } catch (error) {
    console.error('Error fetching Instagram thumbnail:', error);
    return Response.json(
      { error: 'Failed to fetch thumbnail', thumbnail: '/fallback.jpg' },
      { status: 500 }
    );
  }
}

