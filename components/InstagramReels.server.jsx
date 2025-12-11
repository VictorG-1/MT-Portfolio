/**
 * Server Component version of InstagramReels
 * Fetches thumbnails server-side for better performance and no CORS issues
 * 
 * Usage: import InstagramReelsServer from '@/components/InstagramReels.server';
 */

import { getInstagramThumbnailsServer } from '../utils/getInstagramThumbnail.server';
import InstagramReelsClient from './InstagramReels.client';

/**
 * Server Component that fetches thumbnails and passes to client component
 * 
 * @param {Object} props
 * @param {string[]} props.reelUrls - Array of Instagram Reel URLs
 * @param {number} props.columns - Number of columns
 * @param {string} props.fallbackImage - Fallback image path
 */
export default async function InstagramReelsServer({ 
  reelUrls = [], 
  columns = null,
  fallbackImage = '/fallback.jpg' 
}) {
  if (!reelUrls || reelUrls.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        <p>No reels to display</p>
      </div>
    );
  }

  // Fetch thumbnails server-side
  let thumbnails = [];
  try {
    thumbnails = await getInstagramThumbnailsServer(reelUrls, 600);
    
    // Replace fallback paths
    thumbnails = thumbnails.map(result => ({
      ...result,
      thumbnail: result.thumbnail === '/fallback.jpg' ? fallbackImage : result.thumbnail,
    }));
  } catch (error) {
    console.error('Error fetching Instagram thumbnails:', error);
    // Set fallback thumbnails
    thumbnails = reelUrls.map(url => ({
      url,
      thumbnail: fallbackImage,
    }));
  }

  // Pass to client component for interactivity
  return (
    <InstagramReelsClient 
      thumbnails={thumbnails}
      columns={columns}
      fallbackImage={fallbackImage}
    />
  );
}

