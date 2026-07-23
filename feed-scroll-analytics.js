/**
 * Scroll-based video_viewed tracking for snap feeds.
 */
(function () {
    function attach(feed, videos, libraryId) {
        const totalVideos = videos.length;
        if (!totalVideos) return;

        const seenSlides = new Set();
        let activeIndex = -1;
        let scrollTimer = null;

        function getSlideIndex() {
            if (!feed.clientHeight) return 0;

            const index = Math.round(feed.scrollTop / feed.clientHeight);
            return Math.max(0, Math.min(index, totalVideos - 1));
        }

        function trackVideoViewed(index) {
            if (index < 0 || index >= totalVideos || seenSlides.has(index)) return;
            if (!window.MenuAnalytics) return;

            seenSlides.add(index);
            const video = videos[index];

            window.MenuAnalytics.capture("video_viewed", {
                slide_index: index,
                slide_position: index + 1,
                video_id: video?.id || null,
                video_name: video?.name || null,
                library_id: libraryId || null,
                total_videos: totalVideos,
                videos_seen: seenSlides.size,
                menu_depth_percent: Math.round(((index + 1) / totalVideos) * 100)
            });
        }

        function onScrollSettled() {
            const index = getSlideIndex();
            if (index === activeIndex) return;

            activeIndex = index;
            trackVideoViewed(index);
        }

        function scheduleScrollCheck() {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(onScrollSettled, 120);
        }

        feed.addEventListener("scroll", scheduleScrollCheck, { passive: true });
        feed.addEventListener("scrollend", onScrollSettled, { passive: true });

        requestAnimationFrame(onScrollSettled);
    }

    window.FeedScrollAnalytics = { attach: attach };
})();
