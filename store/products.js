/**
 * Channel Preview — Creator Store Product Catalog
 * 24 Curated Products across 6 Creator Categories:
 * 1. Creator Essentials
 * 2. Cameras & Photography
 * 3. Audio & Microphones
 * 4. Lighting Equipment
 * 5. Desk Setup
 * 6. Creator Accessories
 *
 * NOTE:
 * 'affiliateUrl' and 'imageUrl' are intentionally left empty ("") as requested.
 * Paste your custom Amazon affiliate links and product image URLs directly here.
 * The store will automatically render active shopping links and images once provided.
 */

const CATEGORIES = [
  { id: "all", name: "All Gear", slug: "all", icon: "grid" },
  { id: "creator-essentials", name: "Creator Essentials", slug: "creator-essentials", icon: "laptop" },
  { id: "cameras-photography", name: "Cameras & Photography", slug: "cameras-photography", icon: "camera" },
  { id: "audio-microphones", name: "Audio & Microphones", slug: "audio-microphones", icon: "mic" },
  { id: "lighting-equipment", name: "Lighting Equipment", slug: "lighting-equipment", icon: "sun" },
  { id: "desk-setup", name: "Desk Setup", slug: "desk-setup", icon: "monitor" },
  { id: "accessories", name: "Creator Accessories", slug: "accessories", icon: "layers" }
];

const PRODUCTS = [

  // ==========================================
  // 1. CREATOR ESSENTIALS
  // ==========================================

  {
    id: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S Wireless Mouse",
    brand: "Logitech",
    category: "Creator Essentials",
    categorySlug: "creator-essentials",
    description: "Ergonomic precision mouse with 8K DPI sensor, quiet electromagnetic clicks and MagSpeed scroll wheel for editing workflows.",
    affiliateUrl: "https://link.amazon/B0087hJhc",
    imageUrl: "https://m.media-amazon.com/images/I/61z3ENJubZL._SL1500_.jpg",
    badge: "Editor's Choice",
    featured: true,
    chips: ["8K DPI Sensor", "Quiet Clicks", "MagSpeed Scroll"]
  },

  {
    id: "elgato-stream-deck-mk2",
    name: "Elgato Stream Deck MK.2",
    brand: "Elgato",
    category: "Creator Essentials",
    categorySlug: "creator-essentials",
    description: "Studio controller with 15 customizable LCD keys for triggering one-touch actions, scene switching, audio mixing and creator macros.",
    affiliateUrl: "https://link.amazon/B01HZKuGK",
    imageUrl: "https://m.media-amazon.com/images/I/61gtdFnK+UL._SL1500_.jpg",
    badge: "Must-Have",
    featured: true,
    chips: ["15 LCD Keys", "Custom Macros", "OBS & App Control"]
  },

  {
    id: "samsung-t7-shield-ssd",
    name: "Samsung T7 Shield Portable SSD",
    brand: "Samsung",
    category: "Creator Essentials",
    categorySlug: "creator-essentials",
    description: "Rugged, high-speed external solid-state drive with IP65 dust and water resistance for 4K video editing and project backups.",
    affiliateUrl: "https://link.amazon/B0aYjzN28",
    imageUrl: "https://m.media-amazon.com/images/I/91syu8t9c3L._SL1500_.jpg",
    badge: null,
    featured: false,
    chips: ["Up to 1,050 MB/s", "IP65 Rugged", "USB 3.2 Gen 2"]
  },

  {
    id: "logitech-brio-4k",
    name: "Logitech Brio 4K Webcam",
    brand: "Logitech",
    category: "Creator Essentials",
    categorySlug: "creator-essentials",
    description: "Ultra 4K HD webcam with HDR and RightLight 3 auto light correction for streaming, live video production and desk recordings.",
    affiliateUrl: "https://link.amazon/B0ioZ2ejs",
    imageUrl: "https://m.media-amazon.com/images/I/51KIsAkiqqL._SL1500_.jpg",
    badge: "Streaming Pick",
    featured: false,
    chips: ["Ultra 4K HDR", "Auto Light Tuning", "Dual Stereo Mics"]
  },


  // ==========================================
  // 2. CAMERAS & PHOTOGRAPHY
  // ==========================================

  {
    id: "sony-zv-e10",
    name: "Sony ZV-E10 Mirrorless Camera",
    brand: "Sony",
    category: "Cameras & Photography",
    categorySlug: "cameras-photography",
    description: "Interchangeable-lens mirrorless camera engineered for creators, featuring a 24.2 MP APS-C sensor, Product Showcase mode and vari-angle touchscreen.",
    affiliateUrl: "https://link.amazon/B06Akikoc",
    imageUrl: "https://m.media-amazon.com/images/I/712ywHZbdNL._SL1500_.jpg",
    badge: "Creator Camera",
    featured: true,
    chips: ["24.2 MP APS-C", "4K Video & Eye AF", "Side-Flip Screen"]
  },

  {
    id: "canon-eos-r50",
    name: "Canon EOS R50 Mirrorless Camera",
    brand: "Canon",
    category: "Cameras & Photography",
    categorySlug: "cameras-photography",
    description: "Lightweight, compact mirrorless camera with Dual Pixel CMOS AF II and uncropped 6K oversampled 4K video for YouTube creators.",
    affiliateUrl: "https://link.amazon/B0cKiLK0U",
    imageUrl: "https://m.media-amazon.com/images/I/71WMAX2RIAL._SL1500_.jpg",
    badge: "Beginner Camera",
    featured: true,
    chips: ["Dual Pixel AF II", "6K Oversampled 4K", "Vari-Angle Touchscreen"]
  },

  {
    id: "dji-osmo-pocket-3",
    name: "DJI Osmo Pocket 3",
    brand: "DJI",
    category: "Cameras & Photography",
    categorySlug: "cameras-photography",
    description: "Pocket-sized 3-axis gimbal camera with a 1-inch CMOS sensor, 4K/120fps recording and 2-inch rotatable OLED touchscreen.",
    affiliateUrl: "https://link.amazon/B08MY1WhL",
    imageUrl: "https://m.media-amazon.com/images/I/61tukvVUMiL._SL1500_.jpg",
    badge: "Vlogging Pick",
    featured: true,
    chips: ["1-Inch CMOS Sensor", "3-Axis Gimbal", "2-Inch Rotating OLED"]
  },

  {
    id: "gopro-hero13-black",
    name: "GoPro HERO13 Black",
    brand: "GoPro",
    category: "Cameras & Photography",
    categorySlug: "cameras-photography",
    description: "Action camera delivering 5.3K60 video, HyperSmooth 6.0 stabilization and HB-Series lens compatibility for rugged outdoor shoots.",
    affiliateUrl: "https://link.amazon/B084TRRQg",
    imageUrl: "https://m.media-amazon.com/images/I/51JwcRWiefL._SL1080_.jpg",
    badge: "Action Camera",
    featured: false,
    chips: ["5.3K60 Video", "HyperSmooth 6.0", "Waterproof to 33ft"]
  },


  // ==========================================
  // 3. AUDIO & MICROPHONES
  // ==========================================

  {
    id: "rode-wireless-pro",
    name: "RØDE Wireless PRO",
    brand: "RØDE",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "Dual-channel compact wireless microphone system featuring 32-bit float on-board recording, GainAssist and intelligent timecode sync.",
    affiliateUrl: "https://link.amazon/B0h1rbHIb",
    imageUrl: "https://m.media-amazon.com/images/I/61feWshwtsL._SL1500_.jpg",
    badge: "Wireless Pick",
    featured: true,
    chips: ["32-Bit Float Audio", "Dual Wireless Mics", "260m Range"]
  },

  {
    id: "dji-mic-mini",
    name: "DJI Mic Mini",
    brand: "DJI",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "Ultralight wireless microphone system with direct phone connection, active noise cancellation and long battery endurance.",
    affiliateUrl: "https://link.amazon/B0aqP5xzl",
    imageUrl: "https://m.media-amazon.com/images/I/61xsG-hsgPL._SL1500_.jpg",
    badge: "Mobile Creator Pick",
    featured: true,
    chips: ["Ultralight Design", "Noise Cancellation", "Direct Device Link"]
  },

  {
    id: "hollyland-lark-m2",
    name: "Hollyland LARK M2",
    brand: "Hollyland",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "Ultra-compact wireless microphone system featuring 48kHz/24-bit studio-quality audio, environmental noise cancellation, 300m wireless transmission range and up to 40 hours of battery life.",
    affiliateUrl: "https://link.amazon/B0iXdWCR4",
    imageUrl: "https://m.media-amazon.com/images/I/81RzyMqiQjL._SL1500_.jpg",
    badge: "Creator Favourite",
    featured: true,
    chips: [
      "9g Ultralight",
      "300m Wireless Range",
      "40H Battery Life"
    ]
  },

  {
    id: "shure-sm7b",
    name: "Shure SM7B Dynamic Microphone",
    brand: "Shure",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "Industry-standard dynamic microphone with flat, wide-range frequency response for clean vocal recording in podcasts, voiceovers and streaming.",
    affiliateUrl: "https://link.amazon/B0auyxQq4",
    imageUrl: "https://m.media-amazon.com/images/I/71LYHO3+wnL._SL1356_.jpg",
    badge: "Studio Benchmark",
    featured: true,
    chips: ["Cardioid Dynamic", "Built-In Pop Filter", "Electromagnetic Shield"]
  },

  {
    id: "audio-technica-ath-m50x",
    name: "Audio-Technica ATH-M50x Headphones",
    brand: "Audio-Technica",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "Professional studio monitor headphones with 45mm large-aperture drivers, exceptional sound isolation and collapsible design.",
    affiliateUrl: "https://link.amazon/B0eqtZ9o7",
    imageUrl: "https://m.media-amazon.com/images/I/71r+8LBiCQL._SL1500_.jpg",
    badge: null,
    featured: false,
    chips: ["45mm Drivers", "Sound Isolation", "90° Swiveling Cups"]
  },

  {
    id: "focusrite-scarlett-2i2-4th-gen",
    name: "Focusrite Scarlett 2i2 4th Gen",
    brand: "Focusrite",
    category: "Audio & Microphones",
    categorySlug: "audio-microphones",
    description: "High-performance 2-in/2-out USB audio interface featuring 69dB gain preamps, Auto Gain, Clip Safe and 120dB dynamic range.",
    affiliateUrl: "https://link.amazon/B0a05kvxq",
    imageUrl: "https://m.media-amazon.com/images/I/51ov6SGAYeL._SL1500_.jpg",
    badge: null,
    featured: false,
    chips: ["69dB Ultra-Low Noise", "Auto Gain & Clip Safe", "Air Mode Preamps"]
  },


  // ==========================================
  // 4. LIGHTING EQUIPMENT
  // ==========================================

  {
    id: "kreo-slab-video-light",
    name: "Kreo Slab Video Light",
    brand: "Kreo",
    category: "Lighting Equipment",
    categorySlug: "lighting-equipment",
    description: "Adjustable LED video light with 5 color temperatures (3200K–5600K), 1455 lumens brightness, 120 LEDs, and an extendable stand. Ideal for photography, streaming, and content creation.",
    affiliateUrl: "https://link.amazon/B0690T3N8",
    imageUrl: "https://m.media-amazon.com/images/I/611B-nhyr1L._SL1500_.jpg",
    badge: "Studio Lighting",
    featured: true,
    chips: ["1455 Lumens", "3200K–5600K Temp", "120 LEDs", "Extendable Stand"]
  },


  {
    id: "godox-sl-60w",
    name: "Godox SL-60W LED Video Light",
    brand: "Godox",
    category: "Lighting Equipment",
    categorySlug: "lighting-equipment",
    description: "Continuous 5600K daylight-balanced LED video light with Bowens mount for softboxes and reliable key lighting for video studios.",
    affiliateUrl: "https://link.amazon/B0a4xRKiY",
    imageUrl: "https://m.media-amazon.com/images/I/61u27rFx8CL._SL1024_.jpg",
    badge: "Studio Lighting",
    featured: true,
    chips: ["5600K Daylight", "Bowens Mount", "Continuous 60W Output"]
  },

  {
    id: "amaran-100d-s",
    name: "amaran 100d S LED Light",
    brand: "amaran",
    category: "Lighting Equipment",
    categorySlug: "lighting-equipment",
    description: "100W point-source daylight Bowens mount LED light with upgraded ultra-high SSI color quality for film and streaming studios.",
    affiliateUrl: "https://link.amazon/B0eC8qByx",
    imageUrl: "https://m.media-amazon.com/images/I/61OgH021+UL._SL1500_.jpg",
    badge: "Key Light Pick",
    featured: false,
    chips: ["100W Point Source", "Ultra-High SSI Quality", "Sidus Link Control"]
  },

  {
    id: "neewer-660-pro-rgb",
    name: "NEEWER 660 PRO RGB LED Video Light",
    brand: "NEEWER",
    category: "Lighting Equipment",
    categorySlug: "lighting-equipment",
    description: "50W RGB LED panel with full 360° color spectrum, app control and aluminum casing for background wash and creative accent lighting.",
    affiliateUrl: "https://link.amazon/B04iZ15Qb",
    imageUrl: "https://m.media-amazon.com/images/I/71fjGnA-hJL._SL1500_.jpg",
    badge: null,
    featured: false,
    chips: ["360° RGB Spectrum", "CCT 3200K–5600K", "Mobile App Control"]
  },


  // ==========================================
  // 5. DESK SETUP
  // ==========================================

  {
    id: "benq-screenbar-halo",
    name: "BenQ ScreenBar Halo",
    brand: "BenQ",
    category: "Desk Setup",
    categorySlug: "desk-setup",
    description: "Monitor light bar with front and back dual-zone illumination, wireless rotary controller and zero-screen-glare optical design.",
    affiliateUrl: "https://link.amazon/B0eNKkWrN",
    imageUrl: "https://m.media-amazon.com/images/I/41fmQI53UNL._SL1000_.jpg",
    badge: "Workspace Pick",
    featured: true,
    chips: ["Dual-Zone Light", "Zero Screen Glare", "Wireless Controller"]
  },

  {
    id: "elgato-wave-mic-arm-lp",
    name: "Elgato Wave Mic Arm LP",
    brand: "Elgato",
    category: "Desk Setup",
    categorySlug: "desk-setup",
    description: "Low-profile studio boom arm that sits below the monitor line of sight, featuring integrated magnetic cable channels and 360° rotation.",
    affiliateUrl: "https://link.amazon/B00r3DYMe",
    imageUrl: "https://m.media-amazon.com/images/I/51Bj5bGMDLL._SL1500_.jpg",
    badge: "Clean Setup",
    featured: false,
    chips: ["Low-Profile Design", "Magnetic Cable Trays", "360° Rotation"]
  },

  {
    id: "dell-ultrasharp-u2723qe",
    name: "Dell UltraSharp U2723QE 4K Monitor",
    brand: "Dell",
    category: "Desk Setup",
    categorySlug: "desk-setup",
    description: "27-inch 4K UHD hub monitor with IPS Black technology, 2000:1 contrast ratio, 98% DCI-P3 color gamut and 90W USB-C Power Delivery.",
    affiliateUrl: "https://link.amazon/B0cumzMbh",
    imageUrl: "https://m.media-amazon.com/images/I/71QeU8VixML._SL1269_.jpg",
    badge: null,
    featured: false,
    chips: ["27-Inch 4K IPS Black", "98% DCI-P3 Color", "90W USB-C Hub"]
  },

  {
    id: "logitech-mx-keys-s",
    name: "Logitech MX Keys S Wireless Keyboard",
    brand: "Logitech",
    category: "Desk Setup",
    categorySlug: "desk-setup",
    description: "Advanced wireless illuminated keyboard with spherically dished keys, smart backlighting and Smart Actions automation.",
    affiliateUrl: "https://link.amazon/B01TTygy8",
    imageUrl: "https://m.media-amazon.com/images/I/51C3YcfZfQL._SL1000_.jpg",
    badge: null,
    featured: false,
    chips: ["Spherically Dished Keys", "Smart Backlighting", "Multi-OS & USB-C"]
  },


  // ==========================================
  // 6. CREATOR ACCESSORIES
  // ==========================================

  {
    id: "digitek-professional-tripod",
    name: "DIGITEK Professional Tripod Stand",
    brand: "DIGITEK",
    category: "Creator Accessories",
    categorySlug: "accessories",
    description: "Heavy-duty multi-purpose aluminum tripod with 3-way pan head and quick-release plate for cameras, smartphones and ring lights.",
    affiliateUrl: "https://link.amazon/B0eNVjQ7Z",
    imageUrl: "https://m.media-amazon.com/images/I/51x3uEySPhL._SL1000_.jpg",
    badge: "Creator Essential",
    featured: false,
    chips: ["Multi-Purpose Mount", "3-Way Pan Head", "Quick-Release Plate"]
  },

  {
    id: "smallrig-camera-cage",
    name: "SmallRig Camera Cage",
    brand: "SmallRig",
    category: "Creator Accessories",
    categorySlug: "accessories",
    description: "Form-fitting aluminum camera cage providing multiple 1/4\"-20 and 3/8\"-16 mounting threads, cold shoe mounts and NATO rails for rig building.",
    affiliateUrl: "https://link.amazon/B09lA8VYw",
    imageUrl: "https://m.media-amazon.com/images/I/615WvHl0ghL._SL1500_.jpg",
    badge: "Rig Accessory",
    featured: false,
    chips: ["Form-Fitting Aluminum", "1/4\" & 3/8\" Mounts", "Cold Shoe & NATO Rail"]
  },

  {
    id: "ulanzi-vl49-rgb",
    name: "Ulanzi VL49 RGB Video Light",
    brand: "Ulanzi",
    category: "Creator Accessories",
    categorySlug: "accessories",
    description: "Compact pocket-sized RGB LED light with 2000mAh rechargeable battery, 3 cold shoe mounts and magnetic back for quick filming.",
    affiliateUrl: "https://link.amazon/B0iswUEOn",
    imageUrl: "https://m.media-amazon.com/images/I/71vp1ZCn5WL._SL1500_.jpg",
    badge: null,
    featured: false,
    chips: ["Pocket Sized & Magnetic", "2000mAh Battery", "3 Cold Shoe Mounts"]
  }

];

// Optional CommonJS export for Node scripts/testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, PRODUCTS };
}
