// Configuration for concentric circles
const config = {
    rings: 5,
    postersPerRing: [5, 10, 9], // Number of posters in each ring (inner to outer) - 25 total posters
    baseRadius: 220, // Starting radius for innermost ring
    radiusIncrement: 200, // Space between rings - increased to prevent radial overlap
    posterWidth: 120,
    posterHeight: 180,
    staggerAmount: 0, // No random stagger to prevent overlap
    totalPosters: 25 // Total number of poster images available
};


function createPoster(x, y, index, angle) {
    const poster = document.createElement('div');
    poster.className = 'poster';
    
    // Create img element with actual poster images
    const img = document.createElement('img');
    // Loop through the 25 posters (1-25)
    const posterNumber = (index % config.totalPosters) + 1;
    img.src = `posters/${posterNumber}.png`;
    img.alt = `Poster ${posterNumber}`;
    
    poster.appendChild(img);
    
    // Position the poster (centered on the calculated point)
    poster.style.left = `${x - config.posterWidth / 2}px`;
    poster.style.top = `${y - config.posterHeight / 2}px`;
    
    // Rotate poster to point radially outward (convert angle from radians to degrees)
    const rotationDegrees = (angle * 180 / Math.PI) + 180; // +180 to align with radius and add 90 degree turn
    poster.style.transform = `rotate(${rotationDegrees}deg)`;
    
    return poster;
}

function generateConcentricCircles() {
    const container = document.getElementById('poster-container');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    let posterIndex = 0;
    
    for (let ring = 0; ring < config.rings; ring++) {
        // Create a container for this ring
        const ringContainer = document.createElement('div');
        ringContainer.className = 'ring-container';
        
        // Alternate rotation direction - even rings clockwise, odd counterclockwise
        if (ring % 2 === 0) {
            ringContainer.classList.add('clockwise');
        } else {
            ringContainer.classList.add('counterclockwise');
        }
        
        // Set transform origin to center of screen
        ringContainer.style.transformOrigin = `${centerX}px ${centerY}px`;
        
        const radius = config.baseRadius + (ring * config.radiusIncrement);
        const postersInRing = config.postersPerRing[ring];
        const angleStep = (2 * Math.PI) / postersInRing;
        
        for (let i = 0; i < postersInRing; i++) {
            // Calculate angle evenly distributed
            const angle = i * angleStep;
            
            // Use exact radius - no variation to prevent overlap
            const actualRadius = radius;
            
            // Calculate position
            const x = centerX + Math.cos(angle) * actualRadius;
            const y = centerY + Math.sin(angle) * actualRadius;
            
            // Create and add poster (pass angle for radial rotation)
            const poster = createPoster(x, y, posterIndex, angle);
            
            ringContainer.appendChild(poster);
            posterIndex++;
        }
        
        container.appendChild(ringContainer);
    }
}

// Handle window resize
function handleResize() {
    const container = document.getElementById('poster-container');
    container.innerHTML = '';
    generateConcentricCircles();
}

// Initialize
window.addEventListener('load', generateConcentricCircles);
window.addEventListener('resize', debounce(handleResize, 250));

// Debounce function to limit resize calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle link click - redirects to Crave website
document.addEventListener('DOMContentLoaded', () => {
    const siteTitle = document.getElementById('siteTitle');
    siteTitle.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'https://crave.food';
    });
});

