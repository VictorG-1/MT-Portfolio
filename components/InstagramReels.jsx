'use client';

import { useState, useEffect } from 'react';
import { getInstagramThumbnails } from '../utils/getInstagramThumbnail';

/**
 * InstagramReels Component
 * Displays Instagram Reel thumbnails in a responsive grid
 * 
 * @param {Object} props
 * @param {string[]} props.reelUrls - Array of Instagram Reel URLs
 * @param {number} props.columns - Number of columns (default: responsive)
 * @param {string} props.fallbackImage - Fallback image path (default: '/fallback.jpg')
 */
export default function InstagramReels({ 
  reelUrls = [], 
  columns = null,
  fallbackImage = '/fallback.jpg' 
}) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reelUrls || reelUrls.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchThumbnails() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch thumbnails with rate limiting
        const results = await getInstagramThumbnails(reelUrls, 600);
        
        // Replace fallback paths with provided fallback image
        const processedResults = results.map(result => ({
          ...result,
          thumbnail: result.thumbnail === '/fallback.jpg' ? fallbackImage : result.thumbnail,
        }));
        
        setThumbnails(processedResults);
      } catch (err) {
        console.error('Error fetching Instagram thumbnails:', err);
        setError('Failed to load Instagram thumbnails');
        // Set fallback thumbnails
        setThumbnails(
          reelUrls.map(url => ({
            url,
            thumbnail: fallbackImage,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchThumbnails();
  }, [reelUrls, fallbackImage]);

  const handleThumbnailClick = (reelUrl) => {
    window.open(reelUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="instagram-reels-container">
        <div className="instagram-reels-grid" style={{ '--columns': columns || 'auto-fit' }}>
          {reelUrls.map((_, index) => (
            <div key={index} className="instagram-reel-skeleton">
              <div className="skeleton-loader"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && thumbnails.length === 0) {
    return (
      <div className="instagram-reels-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="instagram-reels-container">
      <div 
        className="instagram-reels-grid" 
        style={{ '--columns': columns || 'auto-fit' }}
      >
        {thumbnails.map((item, index) => (
          <div
            key={index}
            className="instagram-reel-item"
            onClick={() => handleThumbnailClick(item.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleThumbnailClick(item.url);
              }
            }}
            aria-label={`Open Instagram reel ${index + 1}`}
          >
            <div className="instagram-reel-thumbnail">
              <img
                src={item.thumbnail}
                alt={`Instagram Reel ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
              />
              <div className="instagram-reel-overlay">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="play-icon"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .instagram-reels-container {
          width: 100%;
          padding: 0;
        }

        .instagram-reels-grid {
          display: grid;
          grid-template-columns: repeat(${columns ? `var(--columns)` : 'auto-fit'}, minmax(280px, 1fr));
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .instagram-reels-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .instagram-reels-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .instagram-reel-item {
          position: relative;
          aspect-ratio: 9 / 16;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          background-color: #000;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .instagram-reel-item:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .instagram-reel-item:focus {
          outline: 2px solid #3897f0;
          outline-offset: 2px;
        }

        .instagram-reel-thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .instagram-reel-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .instagram-reel-item:hover .instagram-reel-thumbnail img {
          transform: scale(1.1);
        }

        .instagram-reel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.3) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .instagram-reel-item:hover .instagram-reel-overlay {
          opacity: 1;
        }

        .play-icon {
          width: 48px;
          height: 48px;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
          transition: transform 0.3s ease;
        }

        .instagram-reel-item:hover .play-icon {
          transform: scale(1.1);
        }

        .instagram-reel-skeleton {
          aspect-ratio: 9 / 16;
          border-radius: 12px;
          overflow: hidden;
          background-color: #1a1a1a;
          position: relative;
        }

        .skeleton-loader {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #1a1a1a 0%,
            #2a2a2a 50%,
            #1a1a1a 100%
          );
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .instagram-reels-error {
          padding: 40px;
          text-align: center;
          color: #999;
        }

        .instagram-reels-error p {
          margin: 0;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

