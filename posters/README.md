# Poster Images

This folder contains all the poster images used in the website's concentric circle layout.

## Folder Structure

Upload your poster images to this folder with the following naming convention:

```
poster-1.jpg
poster-2.jpg
poster-3.jpg
...
poster-63.jpg
```

## Poster Distribution by Ring

Total posters needed: **63 posters**

- **Ring 1 (innermost)**: Posters 1-5 (5 posters)
- **Ring 2**: Posters 6-15 (10 posters)
- **Ring 3**: Posters 16-28 (13 posters)
- **Ring 4**: Posters 29-44 (16 posters)
- **Ring 5 (outermost)**: Posters 45-63 (19 posters)

## Supported Formats

- JPG/JPEG (recommended)
- PNG
- WebP
- GIF

## Recommended Specifications

- **Dimensions**: 120px width × 180px height (or any 2:3 aspect ratio)
- **File size**: Keep under 500KB per image for optimal loading
- **Resolution**: 72-150 DPI is sufficient for web display

## After Upload

Once you've uploaded your posters, update the `script.js` file to reference them:

1. Open `script.js`
2. Find the `createPoster` function
3. Replace the placeholder URL with:
   ```javascript
   img.src = `posters/poster-${index + 1}.jpg`;
   ```

## Notes

- Posters are positioned radially (long edge facing outward from center)
- Due to the radial layout, you won't see the full face of each poster
- Consider using high-contrast or visually interesting edges
- The posters will rotate slowly with their respective rings

