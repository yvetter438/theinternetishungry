/**
 * Shared feed analytics — video scroll depth, end card, session summary
 */
(function () {
    function capture(eventName, properties) {
        if (window.MenuAnalytics) {
            window.MenuAnalytics.capture(eventName, properties);
        }
    }

    function create(feed, slides, videos) {
        const totalVideos = videos.length;
        const seenSlides = new Set();
        let maxSlideReached = -1;
        let endCardViewed = false;
        let orderClicked = false;
        let endCardClicked = false;
        let sessionSent = false;

        function videosSeen() {
            return seenSlides.size;
        }

        function trackVideoViewed(index) {
            if (seenSlides.has(index)) return;

            seenSlides.add(index);
            if (index > maxSlideReached) {
                maxSlideReached = index;
            }

            const video = videos[index];
            capture("video_viewed", {
                slide_index: index,
                video_id: video?.id || null,
                video_name: video?.name || null,
                total_videos: totalVideos
            });
        }

        function trackEndCardViewed() {
            if (endCardViewed) return;

            endCardViewed = true;
            capture("end_card_viewed", {
                videos_seen: videosSeen(),
                total_videos: totalVideos
            });
        }

        function sendSessionSummary() {
            if (sessionSent) return;

            sessionSent = true;
            capture("session_summary", {
                max_slide_reached: maxSlideReached,
                videos_seen: videosSeen(),
                total_videos: totalVideos,
                reached_end: endCardViewed,
                order_clicked: orderClicked,
                end_card_clicked: endCardClicked
            });
        }

        function handleSlideActive(slide, onVideoActive) {
            if (slide.classList.contains("slide--end")) {
                trackEndCardViewed();
                return;
            }

            const index = Number(slide.dataset.slideIndex);
            if (Number.isNaN(index)) return;

            onVideoActive(index);
            trackVideoViewed(index);
        }

        function attach(onVideoActive) {
            const activeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
                        handleSlideActive(entry.target, onVideoActive);
                    });
                },
                { root: feed, threshold: [0.5] }
            );

            slides.forEach((slide) => {
                activeObserver.observe(slide);
            });

            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "hidden") {
                    sendSessionSummary();
                }
            });
            window.addEventListener("pagehide", sendSessionSummary);
        }

        return {
            attach: attach,
            trackOrderClick: function (properties) {
                orderClicked = true;
                capture("order_clicked", properties);
            },
            trackEndCardClick: function (properties) {
                endCardClicked = true;
                capture("end_card_clicked", properties);
            }
        };
    }

    window.FeedAnalytics = { create: create };
})();
