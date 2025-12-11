/**
 * Server-side version of getInstagramThumbnail
 * Optimized for Next.js Server Components and API Routes
 */

/**
 * Fetches Instagram Reel thumbnail URL (server-side)
 * @param {string} reelUrl - Instagram Reel URL
 * @returns {Promise<string>} - Thumbnail URL or fallback
 */
export async function getInstagramThumbnailServer(reelUrl) {
  try {
    // Extract reel ID from URL
    const reelIdMatch = reelUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
    if (!reelIdMatch) {
      console.warn(`Invalid Instagram Reel URL: ${reelUrl}`);
      return '/fallback.jpg';
    }

    const reelId = reelIdMatch[1];
    
    // Method 1: Try oEmbed API (most reliable)
    try {
      const oEmbedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(reelUrl)}`;
      const oEmbedResponse = await fetch(oEmbedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour (Next.js)
      });

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        if (oEmbedData.thumbnail_url) {
          return oEmbedData.thumbnail_url;
        }
      }
    } catch (oEmbedError) {
      console.warn('oEmbed method failed:', oEmbedError.message);
    }

    // Method 2: Try Instagram embed page
    try {
      const embedUrl = `https://www.instagram.com/reel/${reelId}/embed/`;
      const embedResponse = await fetch(embedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 3600 },
      });

      if (embedResponse.ok) {
        const embedHtml = await embedResponse.text();
        
        // Extract og:image
        const ogImageMatch = embedHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (ogImageMatch && ogImageMatch[1]) {
          return ogImageMatch[1];
        }
        
        // Try alternative meta tag
        const imageMatch = embedHtml.match(/<meta\s+name="image"\s+content="([^"]+)"/i);
        if (imageMatch && imageMatch[1]) {
          return imageMatch[1];
        }
      }
    } catch (embedError) {
      console.warn('Embed method failed:', embedError.message);
    }

    // Method 3: Construct thumbnail URL (Instagram pattern)
    // Note: This may not always work as Instagram changes their CDN structure
    const constructedUrl = `https://instagram.com/p/${reelId}/media/?size=l`;
    
    return constructedUrl;
  } catch (error) {
    console.error(`Error fetching thumbnail for ${reelUrl}:`, error);
    return '/fallback.jpg';
  }
}

/**
 * Batch fetch thumbnails server-side with rate limiting
 */
export async function getInstagramThumbnailsServer(reelUrls, delay = 500) {
  const results = [];
  
  for (let i = 0; i < reelUrls.length; i++) {
    const reelUrl = reelUrls[i];
    try {
      const thumbnail = await getInstagramThumbnailServer(reelUrl);
      results.push({
        url: reelUrl,
        thumbnail: thumbnail,
      });
      
      // Rate limiting
      if (i < reelUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Failed to fetch thumbnail for ${reelUrl}:`, error);
      results.push({
        url: reelUrl,
        thumbnail: '/fallback.jpg',
      });
    }
  }
  
  return results;
}

