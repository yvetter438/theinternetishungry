/**
 * Elixir — vertical video feed (Bunny Stream iframes)
 */
(function () {
    const config = window.MENU_CONFIG;
    const feed = document.getElementById("feed");
    const restaurantName = config?.restaurant || "Elixir";

    if (!config || !feed) return;

    const videos = config.videos || [];
    if (!videos.length) {
        feed.innerHTML = `
            <div class="feed-empty">
                <h1>${restaurantName}</h1>
                <p>Add Bunny Stream video IDs in <code>menu.js</code>.</p>
            </div>
        `;
        return;
    }

    if (!config.libraryId) {
        feed.innerHTML = `
            <div class="feed-empty">
                <h1>${restaurantName}</h1>
                <p>Set <code>libraryId</code> in <code>menu.js</code>.</p>
            </div>
        `;
        return;
    }

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
            info.appendChild(createOrderButton(orderUrl));
        }

        const overlay = document.createElement("div");
        overlay.className = "slide-ui";
        overlay.appendChild(gradient);
        if (info.childElementCount) {
            overlay.appendChild(info);
        }

        return overlay;
    }

    function createOrderButton(url) {
        const label = config.ctaLabel || "Order now";

        if (url) {
            const link = document.createElement("a");
            link.className = "order-btn";
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = label;
            link.addEventListener("click", function () {
                if (window.MenuAnalytics) {
                    window.MenuAnalytics.capture("order_clicked", {
                        order_url: url
                    });
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
        slide.setAttribute("aria-label", `${restaurantName} — view full menu`);

        const card = document.createElement("div");
        card.className = "end-card";

        const brand = document.createElement("div");
        brand.className = "end-card__brand";

        if (config.logo) {
            const logo = document.createElement("img");
            logo.className = "end-card__logo";
            logo.src = config.logo;
            logo.alt = restaurantName;
            brand.appendChild(logo);
        } else {
            const name = document.createElement("h1");
            name.className = "end-card__name";
            name.textContent = restaurantName;
            brand.appendChild(name);
        }

        card.appendChild(brand);

        const actions = document.createElement("div");
        actions.className = "end-card__actions";
        actions.appendChild(createEndButton("View full menu", config.menuUrl));
        card.appendChild(actions);

        slide.appendChild(card);
        return slide;
    }

    function createEndButton(label, url) {
        if (url) {
            const link = document.createElement("a");
            link.className = "end-card-btn";
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = label;
            link.addEventListener("click", function () {
                if (window.MenuAnalytics) {
                    window.MenuAnalytics.capture("menu_clicked", {
                        menu_url: url
                    });
                }
            });
            return link;
        }

        const span = document.createElement("span");
        span.className = "end-card-btn end-card-btn--disabled";
        span.textContent = label;
        return span;
    }

    videos.forEach((video, index) => {
        feed.appendChild(createSlide(video, index));
    });

    feed.appendChild(createEndCard());

    const slides = feed.querySelectorAll(".slide");

    preloadAround(0);

    const preloadObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadIframeForSlide(entry.target);
            });
        },
        { root: feed, rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );

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
        if (slide.dataset.videoId) {
            preloadObserver.observe(slide);
        }
        activeObserver.observe(slide);
    });
})();
