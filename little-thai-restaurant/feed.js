/**
 * Little Thai Restaurant — vertical video feed (Bunny Stream iframes)
 */
(function () {
    const config = window.MENU_CONFIG;
    const feed = document.getElementById("feed");

    if (!config || !feed) return;

    const videos = config.videos || [];
    if (!videos.length) return;

    function embedUrl(videoId) {
        const params = "autoplay=true&loop=true&muted=true&preload=true&responsive=true";
        return `https://player.mediadelivery.net/embed/${config.libraryId}/${videoId}?${params}`;
    }

    function createSlide(video, index) {
        const slide = document.createElement("article");
        slide.className = "slide";
        slide.dataset.videoId = video.id;
        slide.setAttribute("aria-label", video.name || `Video ${index + 1}`);

        const wrap = document.createElement("div");
        wrap.className = "video-wrap";

        const iframe = document.createElement("iframe");
        iframe.loading = index === 0 ? "eager" : "lazy";
        iframe.allow =
            "accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen";
        iframe.allowFullscreen = true;
        iframe.title = video.name || `Little Thai Restaurant video ${index + 1}`;

        if (index === 0) {
            iframe.src = embedUrl(video.id);
        }

        wrap.appendChild(iframe);
        slide.appendChild(wrap);
        return slide;
    }

    videos.forEach((video, index) => {
        feed.appendChild(createSlide(video, index));
    });

    const slides = feed.querySelectorAll(".slide");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;

                const iframe = entry.target.querySelector("iframe");
                const videoId = entry.target.dataset.videoId;

                if (iframe && videoId && !iframe.src) {
                    iframe.src = embedUrl(videoId);
                }
            });
        },
        { root: feed, threshold: [0.5] }
    );

    slides.forEach((slide) => observer.observe(slide));
})();
