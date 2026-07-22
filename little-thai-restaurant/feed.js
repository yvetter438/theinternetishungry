/**
 * Little Thai Restaurant — vertical video feed (Bunny Stream iframes)
 */
(function () {
    const config = window.MENU_CONFIG;
    const feed = document.getElementById("feed");

    if (!config || !feed) return;

    const videos = config.videos || [];
    if (!videos.length) return;

    const PRELOAD_AHEAD = 2;

    function embedUrl(videoId) {
        const params = "autoplay=true&loop=true&muted=true&preload=true&responsive=true";
        return `https://player.mediadelivery.net/embed/${config.libraryId}/${videoId}?${params}`;
    }

    function loadIframeForSlide(slide) {
        const iframe = slide.querySelector("iframe");
        const videoId = slide.dataset.videoId;

        if (!iframe || !videoId || iframe.src) return;

        iframe.src = embedUrl(videoId);
    }

    function preloadAround(index) {
        for (let i = index; i <= index + PRELOAD_AHEAD; i++) {
            const slide = slides[i];
            if (slide && slide.dataset.videoId) {
                loadIframeForSlide(slide);
            }
        }
    }

    function createSlide(video, index) {
        const slide = document.createElement("article");
        slide.className = "slide";
        slide.dataset.videoId = video.id;
        slide.dataset.slideIndex = String(index);
        slide.setAttribute("aria-label", video.name || `Dish #${index + 1}`);

        const wrap = document.createElement("div");
        wrap.className = "video-wrap";

        const iframe = document.createElement("iframe");
        iframe.loading = index <= 1 ? "eager" : "lazy";
        iframe.allow =
            "accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen";
        iframe.allowFullscreen = true;
        iframe.title = video.name || `Dish #${index + 1}`;

        wrap.appendChild(iframe);
        slide.appendChild(wrap);
        slide.appendChild(createSlideOverlay(video, index));
        return slide;
    }

    function createSlideOverlay(video, index) {
        const gradient = document.createElement("div");
        gradient.className = "slide-overlay";
        gradient.setAttribute("aria-hidden", "true");

        const info = document.createElement("div");
        info.className = "slide-info";

        const title = document.createElement("h2");
        title.className = "dish-name";
        title.textContent = video.name || `Dish #${index + 1}`;
        info.appendChild(title);

        if (config.showOrderButton !== false) {
            const orderUrl = video.orderUrl || config.takeoutUrl || config.menuUrl;
            info.appendChild(createOrderButton(orderUrl, index));
        }

        const overlay = document.createElement("div");
        overlay.className = "slide-ui";
        overlay.appendChild(gradient);
        if (info.childElementCount) {
            overlay.appendChild(info);
        }

        return overlay;
    }

    function createOrderButton(url, slideIndex) {
        const label = "Order now";

        if (url) {
            const link = document.createElement("a");
            link.className = "order-btn";
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = label;
            link.addEventListener("click", function () {
                const payload = { order_url: url };
                if (typeof slideIndex === "number") {
                    payload.slide_index = slideIndex;
                }
                if (feedAnalytics) {
                    feedAnalytics.trackOrderClick(payload);
                }
            });
            return link;
        }

        const button = document.createElement("button");
        button.className = "order-btn order-btn--disabled";
        button.type = "button";
        button.disabled = true;
        button.textContent = label;
        return button;
    }

    function createEndCard() {
        const slide = document.createElement("article");
        slide.className = "slide slide--end";
        slide.setAttribute("aria-label", "Little Thai Restaurant — view full menu");

        const card = document.createElement("div");
        card.className = "end-card";

        const brand = document.createElement("div");
        brand.className = "end-card__brand";
        const logo = document.createElement("div");
        logo.className = "end-card__logo";
        logo.setAttribute("role", "img");
        logo.setAttribute("aria-label", "Little Thai Restaurant");
        brand.appendChild(logo);
        card.appendChild(brand);

        const actions = document.createElement("div");
        actions.className = "end-card-actions";
        actions.appendChild(createEndLink("View full menu", config.menuUrl));
        card.appendChild(actions);

        const decor = document.createElement("div");
        decor.className = "end-card__decor";
        decor.setAttribute("aria-hidden", "true");
        decor.innerHTML = `
            <svg class="end-card__swirl" xmlns="http://www.w3.org/2000/svg" viewBox="0 800 810 640" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
                <path fill="currentColor" d="M 863.769531 1440.027344 L 0.488281 1440.027344 C 0.488281 1328.75 0.488281 1217.472656 0.488281 1106.179688 C 37.335938 1097.476562 90.460938 1091.121094 145.8125 1110.375 C 235.265625 1141.46875 233.816406 1205.765625 306.433594 1227.710938 C 405.972656 1257.769531 453.347656 1150.429688 578.800781 1173.238281 C 654.09375 1186.929688 673.828125 1232.269531 739.4375 1225.105469 C 795.207031 1219.007812 837.058594 1180.109375 863.75 1148.097656 C 863.769531 1245.40625 863.769531 1342.71875 863.769531 1440.027344 Z"/>
                <path fill="currentColor" d="M 96.34375 883.105469 C 144.621094 962.742188 113.042969 1063.125 124.320312 1150.285156 C 136.472656 1244.265625 198.675781 1307.714844 271.257812 1358.996094 L 0.0078125 1358.996094 L 0.0078125 809.644531 C 39.527344 822.175781 75.027344 847.957031 96.34375 883.105469 Z"/>
            </svg>
        `;
        card.appendChild(decor);

        slide.appendChild(card);
        return slide;
    }

    function createEndLink(label, url) {
        if (url) {
            const link = document.createElement("a");
            link.className = "end-card-link";
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = label;
            link.addEventListener("click", function () {
                if (feedAnalytics) {
                    feedAnalytics.trackEndCardClick({
                        button_label: label,
                        menu_url: url
                    });
                }
            });
            return link;
        }

        const span = document.createElement("span");
        span.className = "end-card-link end-card-link--pending";
        span.textContent = label;
        return span;
    }

    videos.forEach((video, index) => {
        feed.appendChild(createSlide(video, index));
    });

    feed.appendChild(createEndCard());

    const slides = feed.querySelectorAll(".slide");

    preloadAround(0);

    const feedAnalytics = window.FeedAnalytics
        ? window.FeedAnalytics.create(feed, slides, videos)
        : null;

    const preloadObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadIframeForSlide(entry.target);
            });
        },
        { root: feed, rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );

    slides.forEach((slide) => {
        if (slide.dataset.videoId) {
            preloadObserver.observe(slide);
        }
    });

    if (feedAnalytics) {
        feedAnalytics.attach(preloadAround);
    } else {
        const activeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;

                    const index = Number(entry.target.dataset.slideIndex);
                    if (!Number.isNaN(index)) {
                        preloadAround(index);
                    }
                });
            },
            { root: feed, threshold: [0.5] }
        );

        slides.forEach((slide) => {
            activeObserver.observe(slide);
        });
    }
})();
