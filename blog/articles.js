// Shared Article Database for Channel Preview Creator Resource Center
const ARTICLES = [
    {
        id: "youtube-banner-size",
        title: "YouTube Banner Size Guide: Perfect Dimensions & Guidelines",
        slug: "youtube-banner-size",
        category: "YouTube Banners",
        categorySlug: "banner",
        description: "The complete guide to YouTube banner dimensions in 2026. Learn safe zones, file sizes, and responsive crops for TV, desktop, tablet, and mobile.",
        date: "June 6, 2026",
        readingTime: "5 min read",
        popular: true,
        featured: true,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "YouTube Banner Preview",
            url: "/youtube-banner-preview",
            buttonText: "Open Banner Preview"
        }
    },
    {
        id: "youtube-banner-safe-area",
        title: "YouTube Banner Safe Area Explained (Avoid Bad Crops)",
        slug: "youtube-banner-safe-area",
        category: "YouTube Banners",
        categorySlug: "banner",
        description: "How to design YouTube banners that never crop out on mobile. Master the 1546×423px safe zone and position logos and text perfectly.",
        date: "June 5, 2026",
        readingTime: "6 min read",
        popular: true,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Banner Safe Area Guide",
            url: "/youtube-banner-safe-area",
            buttonText: "Open Safe Area Tool"
        }
    },
    {
        id: "youtube-thumbnail-size",
        title: "YouTube Thumbnail Size Guide: Ideal Specs & Aspect Ratios",
        slug: "youtube-thumbnail-size",
        category: "Thumbnails",
        categorySlug: "thumbnail",
        description: "What is the best YouTube thumbnail size? Learn the exact resolution, aspect ratio, file size limit, and file formats required for high CTR.",
        date: "June 4, 2026",
        readingTime: "4 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Thumbnail Preview Tester",
            url: "/youtube-thumbnail-preview",
            buttonText: "Test Thumbnail CTR"
        }
    },
    {
        id: "best-youtube-thumbnail-practices",
        title: "Best YouTube Thumbnail Practices: Design for Higher CTR",
        slug: "best-youtube-thumbnail-practices",
        category: "Thumbnails",
        categorySlug: "thumbnail",
        description: "Pro techniques for YouTube thumbnail design. Master the rule of thirds, select high-contrast colors, and avoid timestamp overlap.",
        date: "June 3, 2026",
        readingTime: "8 min read",
        popular: true,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Thumbnail Preview Tester",
            url: "/youtube-thumbnail-preview",
            buttonText: "Test Thumbnail CTR"
        }
    },
    {
        id: "youtube-profile-picture-size",
        title: "YouTube Profile Picture Size Guide: Avoid Circle Crop Issues",
        slug: "youtube-profile-picture-size",
        category: "Profile Pictures",
        categorySlug: "profile-picture",
        description: "Learn the ideal dimensions for your YouTube profile picture and how to ensure your logo or face doesn't get clipped by the circular crop.",
        date: "June 2, 2026",
        readingTime: "4 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Profile Picture Tester",
            url: "/youtube-profile-picture-preview",
            buttonText: "Test Profile Picture"
        }
    },
    {
        id: "how-to-design-youtube-banner",
        title: "How to Design a Professional YouTube Banner step-by-step",
        slug: "how-to-design-youtube-banner",
        category: "YouTube Banners",
        categorySlug: "banner",
        description: "A comprehensive design workflow for YouTube banners. Choose colors, fonts, hierarchy, and schedules that command attention.",
        date: "June 1, 2026",
        readingTime: "7 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "YouTube Banner Preview",
            url: "/youtube-banner-preview",
            buttonText: "Open Banner Preview"
        }
    },
    {
        id: "how-to-make-clickable-thumbnails",
        title: "How to Make Clickable Thumbnails: CTR Secrets Revealed",
        slug: "how-to-make-clickable-thumbnails",
        category: "Thumbnails",
        categorySlug: "thumbnail",
        description: "The visual psychology behind high-click thumbnails. Learn the curiosity gap, emotional triggers, and typography contrast.",
        date: "May 30, 2026",
        readingTime: "9 min read",
        popular: true,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Thumbnail Preview Tester",
            url: "/youtube-thumbnail-preview",
            buttonText: "Test Thumbnail CTR"
        }
    },
    {
        id: "youtube-channel-branding-guide",
        title: "The Ultimate YouTube Channel Branding Guide for 2026",
        slug: "youtube-channel-branding-guide",
        category: "Channel Branding",
        categorySlug: "title", // Maps to titles category page or we can make branding category
        description: "Build a memorable YouTube identity. Align banner, profile photo, thumbnails, and channel color palette for cohesive brand growth.",
        date: "May 28, 2026",
        readingTime: "8 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "All-in-One Channel Editor",
            url: "/editor",
            buttonText: "Open Channel Editor"
        }
    },
    {
        id: "youtube-title-length",
        title: "Best YouTube Title Length: Prevent Mobile Truncation",
        slug: "youtube-title-length",
        category: "Titles",
        categorySlug: "title",
        description: "How long should your YouTube title be? Optimize character counts for SEO, CTR, and search results on desktop and mobile screens.",
        date: "May 25, 2026",
        readingTime: "5 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "YouTube Title Tester",
            url: "/youtube-title-preview",
            buttonText: "Test Title Truncation"
        }
    },
    {
        id: "youtube-banner-vs-mobile-crop",
        title: "YouTube Banner vs Mobile Crop: Visual Differences Explained",
        slug: "youtube-banner-vs-mobile-crop",
        category: "YouTube Banners",
        categorySlug: "banner",
        description: "A detailed comparison of how YouTube banners adapt between Mobile and TV. Learn why your artwork gets cropped and how to fix it.",
        date: "May 22, 2026",
        readingTime: "5 min read",
        popular: false,
        featured: false,
        author: "Gagan Pratap",
        authorSlug: "gagan-pratap",
        relatedTool: {
            name: "Banner Safe Area Guide",
            url: "/youtube-banner-safe-area",
            buttonText: "Open Safe Area Tool"
        }
    }
];

// Helper to get category descriptions
const CATEGORY_DETAILS = {
    "banner": {
        name: "YouTube Banners",
        desc: "Guides, safe zones, templates, and design tips to help you create perfectly sized banners that look stunning on Mobile, Desktop, and TV."
    },
    "thumbnail": {
        name: "Thumbnails",
        desc: "Master YouTube thumbnail dimensions, layout theories, color contrast, and psychological triggers to skyrocket your Click-Through Rate (CTR)."
    },
    "profile-picture": {
        name: "Profile Pictures",
        desc: "Sizing guides and crop helpers to design high-impact circular channel logos and avatars that stand out in comments and search results."
    },
    "title": {
        name: "Titles",
        desc: "Character limits, keyword placement strategies, and truncation previews to write highly clickable YouTube video titles."
    },
    "youtube-growth": {
        name: "YouTube Growth",
        desc: "Strategic insights, brand identity principles, and optimization techniques to turn causal impressions into loyal channel subscribers."
    }
};

// Export if in Node context, otherwise leave global for browser script tags
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARTICLES, CATEGORY_DETAILS };
}
