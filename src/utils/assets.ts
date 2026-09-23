// Vite only rewrites asset URLs it can statically analyze (imports, HTML
// attrs). Runtime string paths to files in public/ need the configured
// base path (e.g. "/kovac-clothes/" on GitHub Pages) prepended manually.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const LIFESTYLE_IMG = asset("images/lifestyle.jpg");

// Campaign photography (generated luxury/sportswear shoot)
export const ATLAS_CAMPAIGN_IMG = asset("images/kv-atlas-campaign.jpg");
export const LIFESTYLE_NIGHT_IMG = asset("images/kv-lifestyle-night.jpg");
export const HERO_STAGE_IMG = asset("images/kv-hero-stage.jpg");
export const MACRO_WOOL_IMG = asset("images/kv-macro-wool.jpg");
export const MACRO_CANVAS_IMG = asset("images/kv-macro-canvas.jpg");
export const STITCH_DETAIL_IMG = asset("images/kv-stitch-detail.jpg");
export const HARDWARE_DETAIL_IMG = asset("images/kv-hardware-detail.jpg");

// New product hero shots
export const VOYAGER_MAIN_IMG = asset("images/kv-voyager-main.jpg");
export const SUMMIT_MAIN_IMG = asset("images/kv-summit-main.jpg");
export const RECON_MAIN_IMG = asset("images/kv-recon-main.jpg");

// Campaign video
export const HERO_LOOP_VIDEO = asset("videos/kv-hero-loop.mp4");
export const KEYNOTE_VIDEO_1 = asset("videos/kv-keynote-1.mp4");
export const KEYNOTE_VIDEO_2 = asset("videos/kv-keynote-2.mp4");
export const KEYNOTE_VIDEO_3 = asset("videos/kv-keynote-3.mp4");
