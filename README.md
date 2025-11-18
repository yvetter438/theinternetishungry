# theinternetishungry.com

A marketing website with concentric circles of poster images in the background and a prominent site title in the foreground.

## Features

- **Foreground**: Site title "theinternetishungry.com" in classic internet link style (blue, underlined, Courier font)
- **Background**: 5 concentric rings of poster images arranged in a circular pattern
- **Design**: Greyish/beige gradient background with staggered poster placement
- **Interactive**: Hover effects on posters and clickable title that redirects to another site
- **Responsive**: Adapts to different screen sizes

## Setup

Simply open `index.html` in a web browser. No build process or dependencies required!

## Configuration

You can customize the layout by editing the `config` object in `script.js`:

```javascript
const config = {
    rings: 5,                              // Number of concentric rings
    postersPerRing: [8, 12, 16, 20, 24],  // Posters per ring (inner to outer)
    baseRadius: 200,                       // Starting radius for innermost ring
    radiusIncrement: 150,                  // Space between rings
    posterWidth: 120,                      // Poster width in pixels
    posterHeight: 180,                     // Poster height in pixels
    staggerAmount: 20                      // Random stagger for variety
};
```

## Customization

### Replace Dummy Posters

Currently using placeholder images. To use your actual posters:

1. Upload 63 poster images to the `posters/` folder (named `poster-1.jpg` through `poster-63.jpg`)
2. See `POSTER_UPLOAD_INSTRUCTIONS.md` for detailed steps
3. Update the image source in `script.js` (line 32):

```javascript
// Replace this line:
img.src = `https://via.placeholder.com/...`;

// With:
img.src = `posters/poster-${index + 1}.jpg`;
```

### Change Redirect URL

Edit the click handler in `script.js`:

```javascript
window.location.href = 'https://www.example.com'; // Change to your URL
```

### Adjust Colors

- **Background**: Edit the gradient in `style.css` under `body { background: ... }`
- **Title color**: Edit `.site-title { color: ... }` in `style.css`

## File Structure

```
theinternetishungry/
├── index.html                      # Main HTML structure
├── style.css                       # All styling and layout
├── script.js                       # Poster generation and interactions
├── README.md                       # This file
├── POSTER_UPLOAD_INSTRUCTIONS.md   # Guide for uploading your posters
└── posters/                        # Folder containing 63 poster images
    ├── README.md                   # Poster folder documentation
    ├── poster-1.jpg
    ├── poster-2.jpg
    └── ... (poster-3.jpg through poster-63.jpg)
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

