/**
 * Instagram Reels Thumbnail Loader
 * Replaces Instagram embeds with local thumbnail images from Assets/Reel Thumbnail
 */

(function() {
    'use strict';

    // Map reel thumbnails - adjust if you have more or fewer reels
    const THUMBNAIL_PATHS = [
        'Assets/Reel Thumbnail/Reel 1.jpg',
        'Assets/Reel Thumbnail/Reel 2.jpg',
        'Assets/Reel Thumbnail/Reel 3.jpg',
        'Assets/Reel Thumbnail/Reel 4.jpg',
        'Assets/Reel Thumbnail/Reel 5.jpg',
        'Assets/Reel Thumbnail/Reel 6.jpg'
    ];

    function initInstagramThumbnails() {
        const grid = document.querySelector('.instagram-grid');
        if (!grid) return;

        const posts = grid.querySelectorAll('.instagram-post');
        
        posts.forEach((post, index) => {
            const blockquote = post.querySelector('.instagram-media');
            if (!blockquote) return;

            // Extract reel URL
            let reelUrl = blockquote.getAttribute('data-instgrm-permalink');
            if (!reelUrl) {
                const link = blockquote.querySelector('a');
                reelUrl = link ? link.href : null;
            }
            
            if (!reelUrl) return;

            // Get thumbnail path (use index to map to thumbnail)
            const thumbnailPath = THUMBNAIL_PATHS[index] || THUMBNAIL_PATHS[0];
            
            // Create thumbnail container
            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'instagram-thumbnail-container';
            thumbnailContainer.innerHTML = `
                <a href="${reelUrl}" target="_blank" rel="noopener noreferrer" class="instagram-thumbnail-link">
                    <div class="instagram-thumbnail-wrapper">
                        <img 
                            src="${thumbnailPath}" 
                            alt="Instagram Reel ${index + 1}"
                            class="instagram-thumbnail-img"
                            loading="lazy"
                            onerror="this.style.backgroundColor='#1a1a1a'; this.alt='Thumbnail not found';"
                        >
                        <div class="instagram-thumbnail-overlay">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" class="play-icon">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </a>
            `;

            // Replace blockquote with thumbnail
            blockquote.replaceWith(thumbnailContainer);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInstagramThumbnails);
    } else {
        initInstagramThumbnails();
    }
})();

