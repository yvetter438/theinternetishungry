# Demo Videos

Upload your video menu demos here. The landing page reads from the config in `script.js`.

## Quick start

1. Add your video files to this folder (`.mp4` recommended for broad browser support)
2. Optionally add poster images (`.jpg`) — shown before the video loads
3. Open `script.js` and fill in the paths:

```javascript
const heroDemo = {
    src: "demos/hero.mp4",
    poster: "demos/hero-poster.jpg"
};

const demos = [
    {
        title: "Luna Kitchen",
        description: "Modern Italian · Seattle",
        src: "demos/luna-kitchen.mp4",
        poster: "demos/luna-kitchen-poster.jpg"
    },
    // add more...
];
```

4. Refresh the page — videos autoplay muted inside the phone frames

## Recommended specs

| | Hero | Work grid demos |
|---|---|---|
| **Aspect ratio** | 9:16 (vertical) | 9:16 (vertical) |
| **Resolution** | 1080 × 1920 | 1080 × 1920 |
| **Length** | 15–30 sec loop | 15–60 sec loop |
| **File size** | Under 5 MB | Under 8 MB each |

## Tips

- Videos autoplay **muted** (browser requirement). They loop continuously in the phone mockups.
- Use H.264 `.mp4` for best compatibility on mobile Safari and Chrome.
- Poster images should be a single frame from the video — helps on slow connections.
- Leave `src: ""` on any slot you haven't filled yet; a placeholder will show instead.
