/**
 * Chuan Hause — menu config
 *
 * Add dish videos from your Supabase bucket:
 * https://YOUR_PROJECT.supabase.co/storage/v1/object/public/YOUR_BUCKET/path/video.mp4
 */
window.MENU_CONFIG = {
    restaurant: "Chuan Hause",
    orderUrl: "", // default order link for all dishes (optional)

    dishes: [
        // {
        //     name: "Kung Pao Chicken",
        //     video: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/menus/chuan/kung-pao.mp4"
        // },
        {
            name: "Kung Pao Chicken",
            video: "/demos/mockup-1.mp4" // swap for Supabase URL
        }
    ]
};
