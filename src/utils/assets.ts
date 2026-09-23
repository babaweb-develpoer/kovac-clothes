// Vite only rewrites asset URLs it can statically analyze (imports, HTML
// attrs). Runtime string paths to files in public/ need the configured
// base path (e.g. "/kovac-clothes/" on GitHub Pages) prepended manually.
export const LIFESTYLE_IMG = `${import.meta.env.BASE_URL}images/lifestyle.jpg`;
