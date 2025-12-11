# Instagram Reels Component

A production-ready React component for displaying Instagram Reel thumbnails without Instagram's embed UI.

## Features

- ✅ Fetches thumbnails from Instagram Reel URLs
- ✅ Responsive grid layout
- ✅ Hover zoom effects
- ✅ No Instagram UI elements (clean thumbnails only)
- ✅ Click to open reels in new tab
- ✅ Graceful error handling with fallback images
- ✅ Rate limiting to avoid API blocks
- ✅ Loading states with skeleton loaders
- ✅ Accessible (keyboard navigation, ARIA labels)

## Installation

### For Next.js Projects

1. Copy the files to your project:
   - `components/InstagramReels.jsx`
   - `utils/getInstagramThumbnail.js`
   - `app/reels/page.jsx` (sample page)

2. Install dependencies (if not already installed):
```bash
npm install react react-dom next
```

3. Add a fallback image to your `public` folder:
   - Place `fallback.jpg` in `/public/fallback.jpg`

## Usage

### Basic Usage

```jsx
import InstagramReels from '@/components/InstagramReels';

const reelUrls = [
  'https://www.instagram.com/reel/DI1FodctCVQ/',
  'https://www.instagram.com/reel/DJ4KP0WSV63/',
  'https://www.instagram.com/reel/DLar02_teFo/',
];

export default function MyPage() {
  return <InstagramReels reelUrls={reelUrls} />;
}
```

### With Custom Fallback

```jsx
<InstagramReels 
  reelUrls={reelUrls}
  fallbackImage="/custom-fallback.jpg"
/>
```

### With Fixed Columns

```jsx
<InstagramReels 
  reelUrls={reelUrls}
  columns={3}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reelUrls` | `string[]` | `[]` | Array of Instagram Reel URLs |
| `fallbackImage` | `string` | `'/fallback.jpg'` | Path to fallback image |
| `columns` | `number` | `null` | Number of columns (null = responsive) |

## How It Works

1. **Thumbnail Fetching**: The component uses multiple methods to fetch thumbnails:
   - Instagram oEmbed API (primary)
   - Instagram embed page meta tags (fallback)
   - Constructed thumbnail URL pattern (last resort)

2. **Rate Limiting**: Requests are spaced 600ms apart to avoid rate limits

3. **Error Handling**: If fetching fails, fallback images are used

## Important Notes

⚠️ **Instagram API Limitations**:
- Instagram's public endpoints may be rate-limited
- Some endpoints may require authentication for production use
- Consider using Instagram's official Graph API for production apps

⚠️ **CORS Issues**:
- If fetching from client-side, you may encounter CORS errors
- For Next.js, use Server Components or API routes to fetch thumbnails server-side

## Server-Side Fetching (Recommended)

For production, create an API route to fetch thumbnails server-side:

### `app/api/instagram/route.js`

```javascript
import { getInstagramThumbnail } from '@/utils/getInstagramThumbnail';

export async function POST(request) {
  try {
    const { reelUrl } = await request.json();
    const thumbnail = await getInstagramThumbnail(reelUrl);
    return Response.json({ thumbnail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

Then update `getInstagramThumbnail.js` to use your API route when running client-side.

## Styling

The component uses styled-jsx by default. To use CSS Modules instead:

1. Import the CSS module in `InstagramReels.jsx`:
```jsx
import styles from './InstagramReels.module.css';
```

2. Replace class names with `styles.className`

## Deployment

### Vercel
- Works out of the box
- Ensure environment variables are set if using API routes

### Netlify
- Works out of the box
- May need to configure serverless functions for API routes

### Render
- Works out of the box
- Configure build command: `npm run build`

## Troubleshooting

**Thumbnails not loading:**
- Check browser console for CORS errors
- Verify Instagram URLs are correct
- Ensure fallback image exists in `/public` folder
- Try using server-side fetching via API routes

**Rate limiting:**
- Increase delay in `getInstagramThumbnails()` function
- Use server-side fetching to avoid client-side rate limits

## License

MIT

