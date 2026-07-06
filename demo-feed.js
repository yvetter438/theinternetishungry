/**
 * Shared TikTok-style video menu feed.
 * Each demo page sets window.MENU_CONFIG before loading this script.
 *
 * MENU_CONFIG shape:
 * {
 *   restaurant: "Restaurant Name",
 *   orderUrl: "https://...",        // optional default order link
 *   showOrderButton: true,          // set false to hide Order now button
 *   dishes: [
 *     {
 *       name: "Dish Name",
 *       video: "https://xxx.supabase.co/storage/v1/object/public/...",
 *       orderUrl: "https://..."     // optional, overrides default
 *     }
 *   ]
 * }
 */
(function () {
    const config = window.MENU_CONFIG;
    const menu = document.getElementById("menu");

    if (!menu || !config) return;

    function renderEmpty() {
        menu.innerHTML = `
            <div class="feed-empty">
                <h2>${config.restaurant || "Video Menu"}</h2>
                <p>Add dishes with Supabase video URLs in <code>menu.js</code>.</p>
            </div>
        `;
    }

    function renderFeed() {
        const dishes = config.dishes || [];
        if (!dishes.length) {
            renderEmpty();
            return;
        }

        document.body.classList.add("has-feed");

        const feed = document.createElement("div");
        feed.className = "feed";
        feed.setAttribute("role", "feed");
        feed.setAttribute("aria-label", `${config.restaurant} video menu`);

        dishes.forEach((dish, i) => {
            const slide = document.createElement("article");
            slide.className = "slide";
            slide.setAttribute("role", "article");
            slide.setAttribute("aria-label", dish.name);

            const video = document.createElement("video");
            video.src = dish.video;
            video.playsInline = true;
            video.muted = true;
            video.loop = true;
            video.preload = i === 0 ? "auto" : "metadata";
            video.setAttribute("aria-hidden", "true");

            const overlay = document.createElement("div");
            overlay.className = "slide-overlay";

            const info = document.createElement("div");
            info.className = "slide-info";

            const name = document.createElement("h2");
            name.className = "dish-name";
            name.textContent = dish.name;

            info.appendChild(name);

            const showOrder = config.showOrderButton !== false;
            if (showOrder) {
                const orderUrl = dish.orderUrl || config.orderUrl;
                const orderBtn = document.createElement(orderUrl ? "a" : "button");
                orderBtn.className = "order-btn" + (orderUrl ? "" : " order-btn--disabled");
                orderBtn.textContent = "Order now";

                if (orderUrl) {
                    orderBtn.href = orderUrl;
                    orderBtn.target = "_blank";
                    orderBtn.rel = "noopener noreferrer";
                } else {
                    orderBtn.type = "button";
                    orderBtn.disabled = true;
                }

                info.appendChild(orderBtn);
            }

            slide.appendChild(video);
            slide.appendChild(overlay);
            slide.appendChild(info);
            feed.appendChild(slide);
        });

        menu.innerHTML = "";
        menu.appendChild(feed);
        initPlayback(feed);
    }

    function initPlayback(feed) {
        const slides = feed.querySelectorAll(".slide");
        const videos = feed.querySelectorAll("video");

        function setActive(index) {
            videos.forEach((video, i) => {
                if (i === index) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        const index = [...slides].indexOf(entry.target);
                        if (index >= 0) setActive(index);
                    }
                });
            },
            { root: feed, threshold: [0.6] }
        );

        slides.forEach((slide) => observer.observe(slide));
        setActive(0);
    }

    renderFeed();
})();
