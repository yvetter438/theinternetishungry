/**
 * Landing page + live demo config
 *
 * Each demo has a slug — the live product lives at /{slug}/
 * e.g. theinternetishungry.com/chuan-hause/
 */
const demos = [
    {
        title: "Chuan Hause",
        slug: "chuan-hause",
        description: "Video menu · mobile scroll",
        src: "demos/mockup-1.mp4"
    },
    {
        title: "Shake & Stack Burgers",
        slug: "shake-and-stack-burgers",
        description: "Video menu · dish spotlight",
        src: "demos/mockup-2.mp4"
    },
    {
        title: "Thai 2go",
        slug: "thai-2go",
        description: "Video menu · full experience",
        src: "demos/mockup-3.mp4"
    }
];

const heroDemo = {
    slug: "chuan-hause",
    src: "demos/mockup-1.mp4"
};

function demoUrl(slug) {
    return `/${slug}/`;
}

function createVideoElement(videoConfig, placeholderLabel, preload = "metadata") {
    const video = document.createElement("video");
    video.src = videoConfig.src;
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = preload;
    if (videoConfig.poster) video.poster = videoConfig.poster;
    video.setAttribute("aria-label", placeholderLabel);
    return video;
}

function createMockup(videoConfig, placeholderLabel, preload = "metadata") {
    const mockup = document.createElement("div");
    mockup.className = "phone-mockup";

    if (videoConfig.src) {
        mockup.appendChild(createVideoElement(videoConfig, placeholderLabel, preload));
    } else {
        mockup.innerHTML = `
            <div class="phone-placeholder">
                <span class="placeholder-icon">▶</span>
                <span>${placeholderLabel}</span>
            </div>
        `;
    }

    return mockup;
}

function renderWorkGrid() {
    const grid = document.getElementById("workGrid");
    if (!grid) return;

    grid.innerHTML = "";

    demos.forEach((demo, i) => {
        const card = document.createElement("article");
        card.className = "work-card";

        const link = document.createElement("a");
        link.className = "work-card-link";
        link.href = demoUrl(demo.slug);
        link.setAttribute("aria-label", `Try live demo: ${demo.title}`);

        const label = demo.src ? demo.title : `Upload demo ${String(i + 1).padStart(2, "0")}`;
        link.appendChild(createMockup({ src: demo.src, poster: demo.poster }, label));

        const meta = document.createElement("div");
        meta.className = "work-card-meta";
        meta.innerHTML = `
            <h3>${demo.title}</h3>
            <p>${demo.description}</p>
            <span class="work-card-cta">Try live demo →</span>
        `;

        link.appendChild(meta);
        card.appendChild(link);
        grid.appendChild(card);
    });
}

function renderHeroVideo() {
    const heroMockup = document.getElementById("heroMockup");
    const heroLink = document.getElementById("heroDemoLink");
    if (!heroMockup) return;

    heroMockup.innerHTML = "";
    heroMockup.appendChild(
        createVideoElement(heroDemo, "Video menu demo", "auto")
    );

    if (heroLink && heroDemo.slug) {
        heroLink.href = demoUrl(heroDemo.slug);
    }
}

function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const header = document.querySelector(".site-header");

    toggle?.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        header.classList.toggle("nav-open", !expanded);
    });

    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            toggle?.setAttribute("aria-expanded", "false");
            header?.classList.remove("nav-open");
        });
    });
}

function initFooter() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
    renderHeroVideo();
    renderWorkGrid();
    initNav();
    initFooter();
});
