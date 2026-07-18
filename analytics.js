/**
 * Shared analytics — QR attribution + PostHog
 *
 * QR code URL format:
 *   https://theinternetishungry.com/little-thai-restaurant/?src=qr
 *
 * Optional location tag:
 *   ?src=qr&loc=front-door
 */
(function () {
    const STORAGE_KEY = "tih_attribution";
    const analyticsConfig = window.ANALYTICS_CONFIG || {};
    const menuConfig = window.MENU_CONFIG || {};

    function readStoredAttribution() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function storeAttribution(attribution) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
        } catch {
            /* ignore quota / private mode */
        }
    }

    function hasUrlAttribution(params) {
        return (
            params.has("src") ||
            params.has("loc") ||
            params.has("utm_source") ||
            params.has("utm_medium") ||
            params.has("utm_campaign") ||
            params.has("utm_content")
        );
    }

    function inferRestaurantSlug() {
        const parts = window.location.pathname.split("/").filter(Boolean);
        return parts[parts.length - 1] || "unknown";
    }

    function resolveSource(params) {
        const src = params.get("src");
        const utmSource = params.get("utm_source");
        const utmMedium = params.get("utm_medium");

        if (src === "qr" || utmSource === "qr" || utmMedium === "qr") {
            return "qr";
        }

        if (utmSource) {
            return utmSource;
        }

        if (document.referrer) {
            try {
                const referrerHost = new URL(document.referrer).hostname;
                if (referrerHost !== window.location.hostname) {
                    return "referral";
                }
            } catch {
                return "referral";
            }
        }

        return "direct";
    }

    function parseAttribution() {
        const params = new URLSearchParams(window.location.search);

        if (!hasUrlAttribution(params)) {
            const stored = readStoredAttribution();
            if (stored) return stored;
        }

        const source = resolveSource(params);
        const loc = params.get("loc");

        const attribution = {
            source: source,
            is_qr_scan: source === "qr",
            location: loc || null,
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            utm_campaign: params.get("utm_campaign"),
            utm_content: params.get("utm_content"),
            referrer: document.referrer || null,
            landing_path: window.location.pathname,
            landing_url: window.location.href.split("?")[0]
        };

        storeAttribution(attribution);
        return attribution;
    }

    function isConfigured() {
        const key = analyticsConfig.posthogKey;
        return Boolean(key && !key.includes("YOUR_KEY"));
    }

    function initPostHog() {
        if (!isConfigured() || typeof posthog === "undefined") {
            if (!isConfigured()) {
                console.warn("[analytics] Add your PostHog key to analytics-config.js");
            }
            return null;
        }

        posthog.init(analyticsConfig.posthogKey, {
            api_host: analyticsConfig.posthogHost || "https://us.i.posthog.com",
            person_profiles: "identified_only",
            capture_pageview: false
        });

        return posthog;
    }

    function trackMenuOpened(client, attribution) {
        const restaurant = menuConfig.slug || inferRestaurantSlug();

        const payload = {
            restaurant: restaurant,
            restaurant_name: menuConfig.restaurant || null,
            total_videos: Array.isArray(menuConfig.videos) ? menuConfig.videos.length : 0,
            ...attribution
        };

        if (client) {
            client.register(payload);
            client.capture("menu_opened", payload);
        }

        return payload;
    }

    function init() {
        const attribution = parseAttribution();
        const client = initPostHog();
        const context = trackMenuOpened(client, attribution);

        window.MenuAnalytics = {
            getAttribution: function () {
                return readStoredAttribution() || attribution;
            },
            capture: function (eventName, properties) {
                if (!client) return;

                client.capture(eventName, {
                    restaurant: context.restaurant,
                    restaurant_name: context.restaurant_name,
                    ...attribution,
                    ...properties
                });
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
