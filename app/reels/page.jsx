import InstagramReels from '../../components/InstagramReels';
// Alternative: Use server component for better performance
// import InstagramReelsServer from '../../components/InstagramReels.server';

// Sample Instagram Reel URLs
const sampleReels = [
  'https://www.instagram.com/reel/DI1FodctCVQ/',
  'https://www.instagram.com/reel/DJ4KP0WSV63/',
  'https://www.instagram.com/reel/DLar02_teFo/',
  'https://www.instagram.com/reel/DPtvhmbDUAW/',
  'https://www.instagram.com/reel/DQYVUvcDfvS/',
  'https://www.instagram.com/reel/DI1FodctCVQ/', // Example: duplicate for 6 items
];

export default function ReelsPage() {
  return (
    <div className="reels-page">
      <div className="reels-page-header">
        <h1>Instagram Reels</h1>
        <p>Click on any reel to view it on Instagram</p>
      </div>
      
      {/* Client-side component (fetches on client) */}
      <InstagramReels 
        reelUrls={sampleReels}
        fallbackImage="/fallback.jpg"
      />
      
      {/* Alternative: Server component (better performance, no CORS) */}
      {/* <InstagramReelsServer 
        reelUrls={sampleReels}
        fallbackImage="/fallback.jpg"
      /> */}
      
      <style jsx>{`
        .reels-page {
          min-height: 100vh;
          padding: 60px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .reels-page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .reels-page-header h1 {
          font-size: 42px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #fff;
        }

        .reels-page-header p {
          font-size: 16px;
          color: #999;
          margin: 0;
        }

        @media (max-width: 768px) {
          .reels-page {
            padding: 40px 16px;
          }

          .reels-page-header {
            margin-bottom: 40px;
          }

          .reels-page-header h1 {
            font-size: 32px;
          }

          .reels-page-header p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

