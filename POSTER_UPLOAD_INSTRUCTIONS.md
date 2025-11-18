# How to Upload and Use Your Posters

## Step 1: Prepare Your Posters

You need **63 poster images** total. Name them:
- `poster-1.jpg` through `poster-63.jpg`

Place all 63 images in the `posters/` folder (replacing the placeholder files).

## Step 2: Update script.js

Once your posters are uploaded, you need to update the code to use them instead of the placeholder images.

Open `script.js` and find this section (around line 32):

```javascript
img.src = `https://via.placeholder.com/${config.posterWidth}x${config.posterHeight}/${color}/ffffff?text=Poster+${index + 1}`;
```

**Replace it with:**

```javascript
img.src = `posters/poster-${index + 1}.jpg`;
```

If you're using PNG files instead, change `.jpg` to `.png`.

## Step 3: Test

Open `index.html` in your browser and verify all posters load correctly.

## Poster Distribution

Your 63 posters will be distributed as follows:
- **Ring 1** (innermost, rotates clockwise): 5 posters
- **Ring 2** (rotates counterclockwise): 10 posters  
- **Ring 3** (rotates clockwise): 13 posters
- **Ring 4** (rotates counterclockwise): 16 posters
- **Ring 5** (outermost, rotates clockwise): 19 posters

## Tips

- Since posters are positioned radially (edge-out), consider which posters you want more visible
- Inner rings have fewer posters and rotate more prominently
- Outer rings have more posters but are further from the center
- All posters will slowly rotate with their respective rings

