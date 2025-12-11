/**
 * Fetches Instagram Reel thumbnail URL
 * @param {string} reelUrl - Instagram Reel URL (e.g., "https://www.instagram.com/reel/XXXXXXX/")
 * @returns {Promise<string>} - Thumbnail URL or fallback
 */
export async function getInstagramThumbnail(reelUrl) {
  try {
    // Extract reel ID from URL
    const reelIdMatch = reelUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
    if (!reelIdMatch) {
      console.warn(`Invalid Instagram Reel URL: ${reelUrl}`);
      return '/fallback.jpg';
    }

    const reelId = reelIdMatch[1];
    
    // Try Instagram's embed endpoint first (more reliable)
    try {
      const embedUrl = `https://www.instagram.com/reel/${reelId}/embed/`;
      const embedResponse = await fetch(embedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (embedResponse.ok) {
        const embedHtml = await embedResponse.text();
        // Try to extract og:image from meta tags
        const ogImageMatch = embedHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (ogImageMatch && ogImageMatch[1]) {
          return ogImageMatch[1];
        }
      }
    } catch (embedError) {
      console.warn('Embed method failed, trying alternative:', embedError);
    }

    // Alternative: Try oEmbed endpoint
    try {
      const oEmbedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(reelUrl)}`;
      const oEmbedResponse = await fetch(oEmbedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        if (oEmbedData.thumbnail_url) {
          return oEmbedData.thumbnail_url;
        }
      }
    } catch (oEmbedError) {
      console.warn('oEmbed method failed:', oEmbedError);
    }

    // Fallback: Construct thumbnail URL pattern (may not always work)
    // Instagram sometimes uses this pattern for reel thumbnails
    const fallbackThumbnail = `https://instagram.com/p/${reelId}/media/?size=l`;
    
    return fallbackThumbnail;
  } catch (error) {
    console.error(`Error fetching thumbnail for ${reelUrl}:`, error);
    return '/fallback.jpg';
  }
}

/**
 * Batch fetch thumbnails with rate limiting
 * @param {string[]} reelUrls - Array of Instagram Reel URLs
 * @param {number} delay - Delay between requests in ms (default: 500)
 * @returns {Promise<Array<{url: string, thumbnail: string}>>}
 */
export async function getInstagramThumbnails(reelUrls, delay = 500) {
  const results = [];
  
  for (let i = 0; i < reelUrls.length; i++) {
    const reelUrl = reelUrls[i];
    try {
      const thumbnail = await getInstagramThumbnail(reelUrl);
      results.push({
        url: reelUrl,
        thumbnail: thumbnail,
      });
      
      // Rate limiting: wait between requests (except for last one)
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

