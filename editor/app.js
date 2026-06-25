/**
 * ChannelKit Preview — Core Editor Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ── Application State ──
    const defaultState = {
        // Banner
        bannerSrc: '',
        bannerName: '',
        bannerDimensions: '',
        bannerZoom: 100,
        bannerOffsetX: 0,
        bannerOffsetY: 0,
        bannerBrightness: 0,
        bannerContrast: 0,
        bannerSaturation: 0,
        bannerBlur: 0,
        bannerOverlayColor: '#000000',
        bannerOverlayOpacity: 0,
        
        // Profile Picture
        profileSrc: '',
        profileName: '',
        profileDimensions: '',
        profileScale: 100,
        profileOffsetX: 0,
        profileOffsetY: 0,
        profileBorderActive: false,
        profileBorderColor: '#ffffff',
        profileBorderThickness: 2,
        profileBgFill: '#1a1a1a',

        // Channel Info
        channelName: 'Your Channel Name',
        channelHandle: 'yourhandle',
        subscriberCount: '12.4K subscribers',
        videoCount: '48 videos',
        bioLink: 'Write your bio...',
        websiteLink: 'yourwebsite.com',
        fontWeightBold: true,

        // Thumbnails (6 slots)
        thumbnails: Array.from({ length: 6 }, (_, i) => ({
            src: '',
            name: '',
            dimensions: '',
            brightness: 0,
            contrast: 0,
            textActive: false,
            text: '100x CTR!',
            textFont: 'Impact, sans-serif',
            textSize: 24,
            textColor: '#ffffff',
            textPos: 'bottom-left',
            duration: i === 0 ? '10:24' : i === 1 ? '10:00' : i === 2 ? '8:45' : i === 3 ? '12:15' : i === 4 ? '15:30' : '5:40',
            title: `Placeholder Video Title ${i + 1}`,
            views: i === 0 ? '45K views' : i === 1 ? '850K views' : i === 2 ? '525K views' : i === 3 ? '120K views' : i === 4 ? '95K views' : '310K views',
            time: i === 0 ? '3 days ago' : i === 1 ? '1 week ago' : i === 2 ? '1 month ago' : i === 3 ? '2 months ago' : i === 4 ? '3 months ago' : '4 months ago'
        })),
    };

    // We maintain the active editing state
    let stateB = JSON.parse(JSON.stringify(defaultState)); // B is the active editing state
    
    let currentDevice = 'desktop';
    let selectedAsset = null; // 'banner', 'profile', 'thumbnail-0'...'thumbnail-5', 'info'
    let safeZoneActive = false;

    // Canvas Stage Zoom Viewport State
    let canvasZoom = 100;

    // Get current editing state
    function getActiveState() {
        return stateB;
    }

    // ── Style Presets Definitions ──
    const PRESETS = {
        gaming: {
            bannerSrc: 'gradient-gaming',
            bannerOverlayColor: '#ff1c44',
            bannerOverlayOpacity: 10,
            profileBgFill: '#1b0922',
            accentColor: '#ff1c44'
        },
        edu: {
            bannerSrc: 'gradient-edu',
            bannerOverlayColor: '#00b4d8',
            bannerOverlayOpacity: 10,
            profileBgFill: '#0f1c3f',
            accentColor: '#00b4d8'
        },
        vlog: {
            bannerSrc: 'gradient-vlog',
            bannerOverlayColor: '#ff8e3c',
            bannerOverlayOpacity: 10,
            profileBgFill: '#4a1d00',
            accentColor: '#ff8e3c'
        },
        tech: {
            bannerSrc: 'gradient-tech',
            bannerOverlayColor: '#66fcf1',
            bannerOverlayOpacity: 10,
            profileBgFill: '#0b0c10',
            accentColor: '#66fcf1'
        },
        beauty: {
            bannerSrc: 'gradient-beauty',
            bannerOverlayColor: '#ffb3c6',
            bannerOverlayOpacity: 10,
            profileBgFill: '#ffe5ec',
            accentColor: '#ffb3c6'
        }
    };

    // ── DOM References ──
    const bodyEl = document.body;
    const deviceFrame = document.getElementById('device-frame');
    const deviceFrameContainer = document.getElementById('device-frame-container');
    const deviceChromeLabel = document.getElementById('device-chrome-label');
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const panelEmptyState = document.getElementById('panel-empty-state');

    // Close right panel on mobile/tablet on load
    if (window.innerWidth < 1280) {
        rightPanel.classList.remove('open');
    }
    
    // Top bar buttons
    const safeZoneToggle = document.getElementById('safe-zone-toggle');
    const exportBtn = document.getElementById('export-btn');
    const exportDropdown = document.getElementById('export-dropdown');
    
    // Left sidebar collapsible triggers
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    // Selection outline
    const selectionOutline = document.getElementById('canvas-selection-outline');

    // Toast and blocking overlay
    const toastContainer = document.getElementById('toast-container');
    
    // Mobile blocking overlay
    const blockOverlay = document.createElement('div');
    blockOverlay.className = 'mobile-blocking-overlay';
    blockOverlay.innerHTML = `
        <div class="blocking-icon"><i data-lucide="monitor-off"></i></div>
        <div class="blocking-title">Screen Area Too Small</div>
        <div class="blocking-desc">ChannelKit Preview is a design workspace and works best on a desktop or tablet. Please expand your viewport or switch to a larger device.</div>
    `;
    bodyEl.appendChild(blockOverlay);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({node: blockOverlay});
    }

    // ── Toast System ──
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast-message ${isError ? 'toast-error' : ''}`;
        toast.innerHTML = `
            <i data-lucide="${isError ? 'alert-triangle' : 'check-circle'}" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({node: toast});
        }
        
        setTimeout(() => toast.classList.add('show'), 50);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ── Accordion Toggle Logic ──
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            if (item.classList.contains('disabled')) return;
            
            const wasActive = item.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(acc => {
                acc.classList.remove('active');
            });

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // ── Device Switcher Logic ──
    const deviceTabs = document.querySelectorAll('.device-tab');
    deviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            deviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const device = tab.dataset.device;
            currentDevice = device;
            
            deviceFrame.className = `device-frame ${device}`;
            
            let label = 'Desktop View';
            if (device === 'tablet') label = 'Tablet View';
            if (device === 'mobile') label = 'Mobile View';
            deviceChromeLabel.textContent = label;

            positionSelectionOutline();
            showToast(`Switched to ${device} preview`);
        });
    });

    // ── Safe Zone Overlay ──
    const safeZoneOverlay = document.getElementById('safe-zone-overlay');
    const safeZoneLegend = document.getElementById('safe-zone-legend');
    
    safeZoneToggle.addEventListener('click', () => {
        safeZoneActive = !safeZoneActive;
        safeZoneToggle.classList.toggle('active', safeZoneActive);
        
        if (safeZoneActive) {
            safeZoneOverlay.classList.remove('hidden');
            safeZoneLegend.classList.remove('hidden');
            showToast("Safe zones visible");
        } else {
            safeZoneOverlay.classList.add('hidden');
            safeZoneLegend.classList.add('hidden');
        }
    });

    document.getElementById('legend-close-btn').addEventListener('click', () => {
        safeZoneActive = false;
        safeZoneToggle.classList.remove('active');
        safeZoneOverlay.classList.add('hidden');
        safeZoneLegend.classList.add('hidden');
    });

    // ── Canvas Zoom Operations ──
    const canvasZoomSlider = document.getElementById('canvas-zoom-slider');
    const canvasZoomPercent = document.getElementById('canvas-zoom-percent');
    const canvasZoomIn = document.getElementById('canvas-zoom-in');
    const canvasZoomOut = document.getElementById('canvas-zoom-out');
    const canvasViewReset = document.getElementById('canvas-view-reset');

    function updateCanvasViewport() {
        // Apply transform to the device boundary container (zoom only)
        deviceFrameContainer.style.transform = `scale(${canvasZoom / 100})`;
        canvasZoomPercent.textContent = `${canvasZoom}%`;
        canvasZoomSlider.value = canvasZoom;
        
        positionSelectionOutline();
    }

    canvasZoomSlider.addEventListener('input', (e) => {
        canvasZoom = parseInt(e.target.value);
        updateCanvasViewport();
    });

    canvasZoomIn.addEventListener('click', () => {
        canvasZoom = Math.min(200, canvasZoom + 10);
        updateCanvasViewport();
    });

    canvasZoomOut.addEventListener('click', () => {
        canvasZoom = Math.max(30, canvasZoom - 10);
        updateCanvasViewport();
    });

    canvasViewReset.addEventListener('click', () => {
        canvasZoom = 100;
        updateCanvasViewport();
        showToast("Canvas viewport reset");
    });


    function syncRightPanelPreviews() {
        const state = getActiveState();
        
        // 1. Banner
        const bannerImg = document.getElementById('panel-banner-preview-img');
        if (bannerImg) {
            const placeholder = bannerImg.nextElementSibling;
            if (state.bannerSrc) {
                bannerImg.src = state.bannerSrc;
                bannerImg.classList.remove('hidden');
                if (placeholder) placeholder.classList.add('hidden');
            } else {
                bannerImg.src = '';
                bannerImg.classList.add('hidden');
                if (placeholder) placeholder.classList.remove('hidden');
            }
        }

        // 2. Profile/Logo
        const profileImg = document.getElementById('panel-profile-preview-img');
        if (profileImg) {
            const placeholder = profileImg.nextElementSibling;
            if (state.profileSrc) {
                profileImg.src = state.profileSrc;
                profileImg.classList.remove('hidden');
                if (placeholder) placeholder.classList.add('hidden');
            } else {
                profileImg.src = '';
                profileImg.classList.add('hidden');
                if (placeholder) placeholder.classList.remove('hidden');
            }
        }

        // 3. Thumbnail (only if selected)
        if (selectedAsset && selectedAsset.startsWith('thumbnail-')) {
            const idx = selectedAsset.split('-')[1];
            const thumb = state.thumbnails[idx];
            
            const thumbImg = document.getElementById('panel-thumb-preview-img');
            if (thumbImg) {
                const placeholder = thumbImg.nextElementSibling;
                if (thumb.src) {
                    thumbImg.src = thumb.src;
                    thumbImg.classList.remove('hidden');
                    if (placeholder) placeholder.classList.add('hidden');
                } else {
                    thumbImg.src = '';
                    thumbImg.classList.add('hidden');
                    if (placeholder) placeholder.classList.remove('hidden');
                }
            }
        }
    }

    // ── Selection State Visuals ──
    function selectAsset(assetName) {
        selectedAsset = assetName;
        
        document.querySelectorAll('.clickable-asset').forEach(el => {
            el.classList.remove('selected-asset-active');
        });
        
        selectionOutline.style.display = 'none';

        if (!assetName) {
            const isDesktop = window.innerWidth >= 1280;
            if (isDesktop) {
                document.querySelectorAll('.context-panel').forEach(p => p.classList.add('hidden'));
                panelEmptyState.classList.remove('hidden');
                document.getElementById('active-asset-label').textContent = 'None';
            } else {
                rightPanel.classList.remove('open');
            }
            return;
        }

        let targetEl = null;
        let label = 'Selected';
        
        if (assetName === 'banner') {
            targetEl = document.getElementById('yt-mockup-banner');
            label = 'Banner';
        } else if (assetName === 'profile') {
            targetEl = document.getElementById('yt-mockup-pfp');
            label = 'Profile Picture';
        } else if (assetName === 'info') {
            targetEl = document.getElementById('mock-channel-name');
            label = 'Channel Info';
        } else if (assetName.startsWith('thumbnail-')) {
            const idx = assetName.split('-')[1];
            targetEl = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
            label = `Thumbnail ${parseInt(idx) + 1}`;
        }

        if (targetEl) {
            targetEl.classList.add('selected-asset-active');
            setTimeout(() => positionSelectionOutline(targetEl, label), 50);
        }

        rightPanel.classList.add('open');
        panelEmptyState.classList.add('hidden');
        
        document.querySelectorAll('.context-panel').forEach(p => p.classList.add('hidden'));
        
        let panelKey = assetName;
        if (assetName.startsWith('thumbnail-')) {
            panelKey = 'thumbnail';
            const idx = assetName.split('-')[1];
            document.getElementById('active-thumbnail-idx').textContent = parseInt(idx) + 1;
            loadThumbnailControls(idx);
        }
        
        const activePanel = document.querySelector(`.context-panel[data-panel="${panelKey}"]`);
        if (activePanel) {
            activePanel.classList.remove('hidden');
            document.getElementById('active-asset-label').textContent = label;
        }

        syncSlidersToState(assetName);
        syncRightPanelPreviews();
    }

    function positionSelectionOutline(targetEl = null, label = 'Asset') {
        if (!selectedAsset) {
            selectionOutline.style.display = 'none';
            return;
        }

        if (!targetEl) {
            if (selectedAsset === 'banner') {
                targetEl = document.getElementById('yt-mockup-banner');
                label = 'Banner';
            } else if (selectedAsset === 'profile') {
                targetEl = document.getElementById('yt-mockup-pfp');
                label = 'Profile Picture';
            } else if (selectedAsset === 'info') {
                targetEl = document.getElementById('mock-channel-name');
                label = 'Channel Info';
            } else if (selectedAsset.startsWith('thumbnail-')) {
                const idx = selectedAsset.split('-')[1];
                targetEl = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
                label = `Thumbnail ${parseInt(idx) + 1}`;
            }
        }

        if (!targetEl || targetEl.offsetParent === null) {
            selectionOutline.style.display = 'none';
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        const stageRect = document.querySelector('.canvas-stage').getBoundingClientRect();

        selectionOutline.style.left = `${rect.left - stageRect.left}px`;
        selectionOutline.style.top = `${rect.top - stageRect.top}px`;
        selectionOutline.style.width = `${rect.width}px`;
        selectionOutline.style.height = `${rect.height}px`;
        selectionOutline.querySelector('.selection-outline-label').textContent = label;
        selectionOutline.style.display = 'block';
    }

    window.addEventListener('resize', () => {
        positionSelectionOutline();
    });

    document.getElementById('right-panel-close').addEventListener('click', () => {
        selectAsset(null);
    });

    // Canvas click triggers selection
    document.querySelectorAll('.clickable-asset').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const asset = el.dataset.asset;
            selectAsset(asset);
        });
    });

    // Clicking empty space in canvas deselects
    document.querySelector('.center-canvas').addEventListener('click', (e) => {
        if (e.target.classList.contains('center-canvas') || e.target.classList.contains('canvas-stage') || e.target.classList.contains('device-frame-container')) {
            selectAsset(null);
        }
    });

    document.getElementById('btn-info-direct-link').addEventListener('click', () => {
        const infoAcc = document.querySelector('.accordion-item[data-section="info"]');
        document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('active'));
        infoAcc.classList.add('active');
        document.getElementById('channel-name-input').focus();
    });


    // ── Data Input Bindings ──
    const nameInput = document.getElementById('channel-name-input');
    const handleInput = document.getElementById('channel-handle-input');
    const subInput = document.getElementById('subscriber-count-input');
    const vidInput = document.getElementById('video-count-input');
    const bioInput = document.getElementById('bio-link-input');
    const webInput = document.getElementById('website-link-input');

    const mockName = document.getElementById('mock-channel-name');
    const mockHandle = document.querySelector('.stats-handle');
    const mockSubs = document.querySelector('.stats-subs');
    const mockVids = document.querySelector('.stats-videos');
    const mockBio = document.getElementById('mock-channel-bio');
    const mockWeb = document.getElementById('mock-channel-website');
    const mobileHeaderTitle = document.querySelector('.mobile-header-title');

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const updateCanvasTexts = debounce(() => {
        const state = getActiveState();
        state.channelName = nameInput.value;
        state.channelHandle = handleInput.value.replace(/^@/, '');
        state.subscriberCount = subInput.value;
        state.videoCount = vidInput.value;
        state.bioLink = bioInput.value;
        state.websiteLink = webInput.value;

        // Apply to DOM
        mockName.textContent = state.channelName;
        if (mobileHeaderTitle) {
            mobileHeaderTitle.textContent = state.channelName;
        }
        mockHandle.textContent = `@${state.channelHandle}`;
        mockSubs.textContent = state.subscriberCount;
        mockVids.textContent = state.videoCount;
        mockBio.textContent = state.bioLink;
        mockWeb.textContent = state.websiteLink;
        
        document.getElementById('name-count').textContent = state.channelName.length;
        
        positionSelectionOutline();
    }, 150);

    nameInput.addEventListener('input', updateCanvasTexts);
    handleInput.addEventListener('input', updateCanvasTexts);
    subInput.addEventListener('input', updateCanvasTexts);
    vidInput.addEventListener('input', updateCanvasTexts);
    bioInput.addEventListener('input', updateCanvasTexts);
    webInput.addEventListener('input', updateCanvasTexts);

    const infoBoldToggle = document.getElementById('info-bold-toggle');
    infoBoldToggle.addEventListener('change', () => {
        const state = getActiveState();
        state.fontWeightBold = infoBoldToggle.checked;
        mockName.style.fontWeight = state.fontWeightBold ? '700' : '400';
    });


    // ── Image Cropping Modals logic ──
    const bannerCropModal = document.getElementById('banner-crop-modal');
    const profileCropModal = document.getElementById('profile-crop-modal');
    
    let activeCropType = null; // 'banner' or 'profile'
    let cropImgSrc = '';
    let cropFileName = '';
    let cropFileDimensions = '';
    
    let cropZoom = 100;
    let cropOffsetX = 0;
    let cropOffsetY = 0;
    
    let isDraggingCrop = false;
    let cropDragStartX = 0;
    let cropDragStartY = 0;
    let cropDragStartOffsetX = 0;
    let cropDragStartOffsetY = 0;

    function openCropModal(type, src, name, dimensions, initialZoom = 100, initialX = 0, initialY = 0) {
        activeCropType = type;
        cropImgSrc = src;
        cropFileName = name;
        cropFileDimensions = dimensions;
        
        cropZoom = initialZoom;
        cropOffsetX = initialX;
        cropOffsetY = initialY;
        
        if (type === 'banner') {
            document.getElementById('banner-crop-img').src = src;
            document.getElementById('banner-crop-zoom').value = cropZoom;
            document.getElementById('val-banner-crop-zoom').textContent = `${cropZoom}%`;
            bannerCropModal.classList.remove('hidden');
            updateCropImagePreview('banner');
        } else {
            document.getElementById('profile-crop-img').src = src;
            document.getElementById('profile-crop-zoom').value = cropZoom;
            document.getElementById('val-profile-crop-zoom').textContent = `${cropZoom}%`;
            profileCropModal.classList.remove('hidden');
            updateCropImagePreview('profile');
        }
    }

    function updateCropImagePreview(type) {
        const img = document.getElementById(`${type}-crop-img`);
        img.style.transform = `translate(${cropOffsetX}px, ${cropOffsetY}px) scale(${cropZoom / 100})`;
    }

    // Modal drag behaviors
    function setupModalDrag(viewportId, imgId, type) {
        const viewport = document.getElementById(viewportId);
        
        const startDragModal = (e) => {
            isDraggingCrop = true;
            cropDragStartX = e.clientX || (e.touches && e.touches[0].clientX);
            cropDragStartY = e.clientY || (e.touches && e.touches[0].clientY);
            cropDragStartOffsetX = cropOffsetX;
            cropDragStartOffsetY = cropOffsetY;
            e.preventDefault();
        };

        const moveDragModal = (e) => {
            if (!isDraggingCrop) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const dx = clientX - cropDragStartX;
            const dy = clientY - cropDragStartY;
            
            cropOffsetX = cropDragStartOffsetX + dx;
            
            // Banners only crop vertically on YouTube by default, but let's allow both for user freedom in crop modal
            cropOffsetY = cropDragStartOffsetY + dy;
            
            updateCropImagePreview(type);
        };

        const endDragModal = () => {
            isDraggingCrop = false;
        };

        viewport.addEventListener('mousedown', startDragModal);
        viewport.addEventListener('touchstart', startDragModal, { passive: false });
        
        window.addEventListener('mousemove', moveDragModal);
        window.addEventListener('touchmove', moveDragModal, { passive: false });
        
        window.addEventListener('mouseup', endDragModal);
        window.addEventListener('touchend', endDragModal);
    }

    setupModalDrag('banner-crop-viewport', 'banner-crop-img', 'banner');
    setupModalDrag('profile-crop-viewport', 'profile-crop-img', 'profile');

    // Zoom sliders in modal
    document.getElementById('banner-crop-zoom').addEventListener('input', (e) => {
        cropZoom = parseInt(e.target.value);
        document.getElementById('val-banner-crop-zoom').textContent = `${cropZoom}%`;
        updateCropImagePreview('banner');
    });

    document.getElementById('profile-crop-zoom').addEventListener('input', (e) => {
        cropZoom = parseInt(e.target.value);
        document.getElementById('val-profile-crop-zoom').textContent = `${cropZoom}%`;
        updateCropImagePreview('profile');
    });

    // Done / Cancel buttons
    document.getElementById('banner-crop-cancel').addEventListener('click', () => {
        bannerCropModal.classList.add('hidden');
        activeCropType = null;
    });

    document.getElementById('profile-crop-cancel').addEventListener('click', () => {
        profileCropModal.classList.add('hidden');
        activeCropType = null;
    });

    document.getElementById('banner-crop-done').addEventListener('click', () => {
        const state = getActiveState();
        state.bannerSrc = cropImgSrc;
        state.bannerName = cropFileName;
        state.bannerDimensions = cropFileDimensions;
        state.bannerZoom = cropZoom;
        state.bannerOffsetX = cropOffsetX;
        state.bannerOffsetY = cropOffsetY;
        
        bannerCropModal.classList.add('hidden');
        activeCropType = null;
        
        // Update Sidebar filled card
        updateUploadSlotUI('banner', cropImgSrc, cropFileName, cropFileDimensions);
        
        // Remove empty state overlay if first upload
        const emptyStateHint = document.getElementById('canvas-empty-state-hint');
        if (emptyStateHint) emptyStateHint.classList.add('hidden');
        
        applyStateToMockup();
        selectAsset('banner');
        showToast("Banner customized and cropped");
    });

    document.getElementById('profile-crop-done').addEventListener('click', () => {
        const state = getActiveState();
        state.profileSrc = cropImgSrc;
        state.profileName = cropFileName;
        state.profileDimensions = cropFileDimensions;
        state.profileScale = cropZoom;
        state.profileOffsetX = cropOffsetX;
        state.profileOffsetY = cropOffsetY;
        
        profileCropModal.classList.add('hidden');
        activeCropType = null;
        
        updateUploadSlotUI('profile', cropImgSrc, cropFileName, cropFileDimensions);
        
        applyStateToMockup();
        selectAsset('profile');
        showToast("Profile customized and cropped");
    });

    // Re-cropping trigger buttons on slots
    document.getElementById('banner-crop-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        const state = getActiveState();
        if (state.bannerSrc && !state.bannerSrc.startsWith('gradient-')) {
            openCropModal('banner', state.bannerSrc, state.bannerName, state.bannerDimensions, state.bannerZoom, state.bannerOffsetX, state.bannerOffsetY);
        } else {
            showToast("Upload banner image first to recrop", true);
        }
    });

    document.getElementById('profile-crop-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        const state = getActiveState();
        if (state.profileSrc) {
            openCropModal('profile', state.profileSrc, state.profileName, state.profileDimensions, state.profileScale, state.profileOffsetX, state.profileOffsetY);
        } else {
            showToast("Upload profile picture first to recrop", true);
        }
    });


    // ── File Upload System (without double trigger bug) ──
    const fileInputs = {
        banner: document.getElementById('banner-input'),
        profile: document.getElementById('profile-input')
    };

    const dropzones = {
        banner: document.getElementById('banner-dropzone'),
        profile: document.getElementById('profile-dropzone')
    };

    // Setup drag over highlights
    Object.keys(dropzones).forEach(key => {
        const dz = dropzones[key];
        
        dz.addEventListener('dragover', (e) => {
            e.preventDefault();
            dz.classList.add('dragover');
        });

        dz.addEventListener('dragleave', () => {
            dz.classList.remove('dragover');
        });

        dz.addEventListener('drop', (e) => {
            e.preventDefault();
            dz.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) {
                processFile(key, files[0]);
            }
        });

        fileInputs[key].addEventListener('change', () => {
            const input = fileInputs[key];
            if (input.files.length) {
                processFile(key, input.files[0]);
            }
        });
    });

    function processFile(slotType, file) {
        const card = document.querySelector(`.asset-slot-card[data-slot="${slotType}"]`);
        const dz = dropzones[slotType];
        const errorEl = card.querySelector('.slot-error-msg');
        
        const maxSize = 6 * 1024 * 1024;
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        
        if (file.size > maxSize || !validTypes.includes(file.type)) {
            dz.classList.add('error');
            errorEl.classList.remove('hidden');
            showToast("Invalid file upload", true);
            return;
        }

        dz.classList.remove('error');
        errorEl.classList.add('hidden');

        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            
            const img = new Image();
            img.onload = function() {
                const dims = `${img.width} × ${img.height}`;
                
                openCropModal(slotType, dataUrl, file.name, dims);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }

    // Sidebar filled asset visual updates
    function updateUploadSlotUI(slotType, src, fileName, dimensions) {
        const dz = dropzones[slotType];
        const emptyEl = dz.querySelector('.dropzone-empty');
        const filledEl = dz.querySelector('.dropzone-filled');
        
        if (src) {
            filledEl.querySelector('.dropzone-thumb').src = src;
            filledEl.querySelector('.file-name').textContent = fileName || (slotType + '.png');
            filledEl.querySelector('.file-dimensions').textContent = dimensions || '';
            
            emptyEl.classList.add('hidden');
            filledEl.classList.remove('hidden');
        } else {
            emptyEl.classList.remove('hidden');
            filledEl.classList.add('hidden');
            filledEl.querySelector('.dropzone-thumb').src = '';
        }
    }

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const slotCard = btn.closest('.asset-slot-card');
            const slotType = slotCard.dataset.slot;
            removeAsset(slotType);
        });
    });

    function removeAsset(slotType) {
        const state = getActiveState();
        const dz = dropzones[slotType];
        const emptyEl = dz.querySelector('.dropzone-empty');
        const filledEl = dz.querySelector('.dropzone-filled');
        
        if (slotType === 'banner') {
            state.bannerSrc = '';
            state.bannerName = '';
            state.bannerDimensions = '';
            
            const mockImg = document.getElementById('mock-banner-img');
            mockImg.src = '';
            mockImg.classList.add('hidden');
            document.getElementById('mock-banner-placeholder').classList.remove('hidden');
            
            if (!state.profileSrc) {
                const emptyStateHint = document.getElementById('canvas-empty-state-hint');
                if (emptyStateHint) emptyStateHint.classList.remove('hidden');
            }

        } else if (slotType === 'profile') {
            state.profileSrc = '';
            state.profileName = '';
            state.profileDimensions = '';

            const mockImg = document.getElementById('mock-pfp-img');
            mockImg.src = '';
            mockImg.classList.add('hidden');
            document.getElementById('mock-pfp-placeholder').classList.remove('hidden');

        }

        emptyEl.classList.remove('hidden');
        filledEl.classList.add('hidden');
        
        if (selectedAsset === slotType) {
            selectAsset(null);
        }
        
        applyStateToMockup();
        showToast(`Removed ${slotType}`);
    }

    // ── Thumbnail slots uploads and select details ──
    const thumbSlots = document.querySelectorAll('.thumb-slot');
    thumbSlots.forEach((slot, i) => {
        const input = slot.querySelector('.file-input-hidden');
        const previewDiv = slot.querySelector('.thumb-filled-preview');
        const previewImg = previewDiv.querySelector('img');
        
        input.addEventListener('change', () => {
            if (input.files.length) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target.result;
                    const img = new Image();
                    img.onload = () => {
                        const state = getActiveState();
                        state.thumbnails[i].src = src;
                        state.thumbnails[i].name = file.name;
                        state.thumbnails[i].dimensions = `${img.width} × ${img.height}`;
                        
                        slot.classList.remove('empty');
                        previewImg.src = src;
                        previewDiv.classList.remove('hidden');
                        
                        // Canvas mockup update
                        const mockItem = document.querySelector(`.mock-video-item[data-index="${i}"]`);
                        const mockImg = mockItem.querySelector('.mock-thumb-img');
                        mockImg.src = src;
                        mockImg.classList.remove('hidden');
                        mockItem.querySelector('.mock-thumb-placeholder').classList.add('hidden');
                        
                        selectAsset(`thumbnail-${i}`);
                        showToast(`Uploaded thumbnail ${i + 1}`);
                    };
                    img.src = src;
                };
                reader.readAsDataURL(file);
            }
        });

        // Click on filled thumbnail sidebar selects it (replaces double trigger dialog click)
        previewDiv.addEventListener('click', (e) => {
            if (e.target.closest('.thumb-remove-btn')) return; // handled separately
            e.stopPropagation();
            selectAsset(`thumbnail-${i}`);
        });

        // Edit button
        previewDiv.querySelector('.thumb-edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            selectAsset(`thumbnail-${i}`);
        });

        // Remove button
        previewDiv.querySelector('.thumb-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const state = getActiveState();
            state.thumbnails[i].src = '';
            state.thumbnails[i].name = '';
            
            slot.classList.add('empty');
            previewDiv.classList.add('hidden');
            previewImg.src = '';
            
            const mockItem = document.querySelector(`.mock-video-item[data-index="${i}"]`);
            const mockImg = mockItem.querySelector('.mock-thumb-img');
            mockImg.src = '';
            mockImg.classList.add('hidden');
            mockItem.querySelector('.mock-thumb-placeholder').classList.remove('hidden');
            
            if (selectedAsset === `thumbnail-${i}`) {
                selectAsset(null);
            }
            showToast(`Removed thumbnail ${i + 1}`);
        });
    });


    // ── Sliders to State Synchronizations ──
    function syncSlidersToState(asset) {
        const state = getActiveState();
        
        if (asset === 'banner') {
            document.getElementById('banner-zoom').value = state.bannerZoom;
            document.getElementById('val-banner-zoom').textContent = `${state.bannerZoom}%`;
            
            document.getElementById('banner-brightness').value = state.bannerBrightness;
            document.getElementById('val-banner-brightness').textContent = state.bannerBrightness;
            
            document.getElementById('banner-contrast').value = state.bannerContrast;
            document.getElementById('val-banner-contrast').textContent = state.bannerContrast;
            
            document.getElementById('banner-saturation').value = state.bannerSaturation;
            document.getElementById('val-banner-saturation').textContent = state.bannerSaturation;
            
            document.getElementById('banner-blur').value = state.bannerBlur;
            document.getElementById('val-banner-blur').textContent = `${state.bannerBlur}px`;
            
            document.getElementById('banner-overlay-color').value = state.bannerOverlayColor;
            document.getElementById('banner-overlay-color-hex').value = state.bannerOverlayColor;
            
            document.getElementById('banner-overlay-opacity').value = state.bannerOverlayOpacity;
            document.getElementById('val-banner-overlay-opacity').textContent = `${state.bannerOverlayOpacity}%`;
            
        } else if (asset === 'profile') {
            document.getElementById('profile-scale').value = state.profileScale;
            document.getElementById('val-profile-scale').textContent = `${state.profileScale}%`;
            
            document.getElementById('profile-offset-x').value = state.profileOffsetX;
            document.getElementById('val-profile-offset-x').textContent = `${state.profileOffsetX}px`;

            document.getElementById('profile-offset-y').value = state.profileOffsetY;
            document.getElementById('val-profile-offset-y').textContent = `${state.profileOffsetY}px`;

            const borderActive = state.profileBorderActive;
            document.getElementById('profile-border-toggle').checked = borderActive;
            
            const borderBox = document.getElementById('profile-border-settings');
            if (borderActive) {
                borderBox.classList.remove('hidden');
            } else {
                borderBox.classList.add('hidden');
            }
            
            document.getElementById('profile-border-color').value = state.profileBorderColor;
            document.getElementById('profile-border-color-hex').value = state.profileBorderColor;
            
            document.getElementById('profile-border-thickness').value = state.profileBorderThickness;
            document.getElementById('val-profile-border-thickness').textContent = `${state.profileBorderThickness}px`;
            
            document.getElementById('profile-bg-fill').value = state.profileBgFill;
            document.getElementById('profile-bg-fill-hex').value = state.profileBgFill;
            
        } else if (asset === 'info') {
            document.getElementById('info-bold-toggle').checked = state.fontWeightBold;
        }
    }

    function loadThumbnailControls(idx) {
        const state = getActiveState();
        const thumb = state.thumbnails[idx];
        
        // Video details fields inside Right Panel
        const vTitleInp = document.getElementById('thumb-video-title');
        const vViewsInp = document.getElementById('thumb-video-views');
        const vTimeInp = document.getElementById('thumb-video-time');
        const vDurationInp = document.getElementById('thumb-video-duration');

        vTitleInp.value = thumb.title;
        document.getElementById('thumb-video-title-count').textContent = thumb.title.length;
        
        vViewsInp.value = thumb.views;
        vTimeInp.value = thumb.time;
        vDurationInp.value = thumb.duration;

        document.getElementById('thumb-brightness').value = thumb.brightness;
        document.getElementById('val-thumb-brightness').textContent = thumb.brightness;
        
        document.getElementById('thumb-contrast').value = thumb.contrast;
        document.getElementById('val-thumb-contrast').textContent = thumb.contrast;
        
        const textToggle = document.getElementById('thumb-text-toggle');
        textToggle.checked = thumb.textActive;
        
        const settingsBox = document.getElementById('thumb-text-settings');
        if (thumb.textActive) {
            settingsBox.classList.remove('hidden');
        } else {
            settingsBox.classList.add('hidden');
        }
        
        document.getElementById('thumb-text-input').value = thumb.text;
        document.getElementById('thumb-text-font').value = thumb.textFont;
        
        document.getElementById('thumb-text-size').value = thumb.textSize;
        document.getElementById('val-thumb-text-size').textContent = `${thumb.textSize}px`;
        
        document.getElementById('thumb-text-color').value = thumb.textColor;
        document.getElementById('thumb-text-color-hex').value = thumb.textColor;
        
        document.querySelectorAll('.grid-picker-cell').forEach(cell => {
            cell.classList.remove('active');
            if (cell.dataset.pos === thumb.textPos) {
                cell.classList.add('active');
            }
        });
    }

    // ── Sliders Event Listeners ──
    
    // Banner controls
    document.getElementById('banner-zoom').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerZoom = parseInt(e.target.value);
        document.getElementById('val-banner-zoom').textContent = `${state.bannerZoom}%`;
        applyStateToMockup();
    });

    document.getElementById('banner-brightness').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerBrightness = parseInt(e.target.value);
        document.getElementById('val-banner-brightness').textContent = state.bannerBrightness;
        applyStateToMockup();
    });

    document.getElementById('banner-contrast').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerContrast = parseInt(e.target.value);
        document.getElementById('val-banner-contrast').textContent = state.bannerContrast;
        applyStateToMockup();
    });

    document.getElementById('banner-saturation').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerSaturation = parseInt(e.target.value);
        document.getElementById('val-banner-saturation').textContent = state.bannerSaturation;
        applyStateToMockup();
    });

    document.getElementById('banner-blur').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerBlur = parseInt(e.target.value);
        document.getElementById('val-banner-blur').textContent = `${state.bannerBlur}px`;
        applyStateToMockup();
    });

    function linkColorPickers(colorInputId, hexInputId, stateProp, callback) {
        const colorInput = document.getElementById(colorInputId);
        const hexInput = document.getElementById(hexInputId);
        
        colorInput.addEventListener('input', (e) => {
            const state = getActiveState();
            const val = e.target.value;
            hexInput.value = val;
            
            if (stateProp.startsWith('thumbnails[')) {
                const parts = stateProp.match(/thumbnails\[(\d+)\]\.(.+)/);
                state.thumbnails[parts[1]][parts[2]] = val;
            } else {
                state[stateProp] = val;
            }
            callback();
        });

        hexInput.addEventListener('input', (e) => {
            let val = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                colorInput.value = val;
                const state = getActiveState();
                
                if (stateProp.startsWith('thumbnails[')) {
                    const parts = stateProp.match(/thumbnails\[(\d+)\]\.(.+)/);
                    state.thumbnails[parts[1]][parts[2]] = val;
                } else {
                    state[stateProp] = val;
                }
                callback();
            }
        });
    }

    linkColorPickers('banner-overlay-color', 'banner-overlay-color-hex', 'bannerOverlayColor', applyStateToMockup);
    
    document.getElementById('banner-overlay-opacity').addEventListener('input', (e) => {
        const state = getActiveState();
        state.bannerOverlayOpacity = parseInt(e.target.value);
        document.getElementById('val-banner-overlay-opacity').textContent = `${state.bannerOverlayOpacity}%`;
        applyStateToMockup();
    });

    document.getElementById('banner-reset-btn').addEventListener('click', () => {
        const state = getActiveState();
        state.bannerZoom = 100;
        state.bannerOffsetX = 0;
        state.bannerOffsetY = 0;
        state.bannerBrightness = 0;
        state.bannerContrast = 0;
        state.bannerSaturation = 0;
        state.bannerBlur = 0;
        state.bannerOverlayColor = '#000000';
        state.bannerOverlayOpacity = 0;
        
        syncSlidersToState('banner');
        applyStateToMockup();
        showToast("Banner filters reset");
    });

    // Profile picture controls (Sliders replace dragging)
    document.getElementById('profile-scale').addEventListener('input', (e) => {
        const state = getActiveState();
        state.profileScale = parseInt(e.target.value);
        document.getElementById('val-profile-scale').textContent = `${state.profileScale}%`;
        applyStateToMockup();
    });

    document.getElementById('profile-offset-x').addEventListener('input', (e) => {
        const state = getActiveState();
        state.profileOffsetX = parseInt(e.target.value);
        document.getElementById('val-profile-offset-x').textContent = `${state.profileOffsetX}px`;
        applyStateToMockup();
    });

    document.getElementById('profile-offset-y').addEventListener('input', (e) => {
        const state = getActiveState();
        state.profileOffsetY = parseInt(e.target.value);
        document.getElementById('val-profile-offset-y').textContent = `${state.profileOffsetY}px`;
        applyStateToMockup();
    });

    const borderToggle = document.getElementById('profile-border-toggle');
    borderToggle.addEventListener('change', () => {
        const state = getActiveState();
        state.profileBorderActive = borderToggle.checked;
        
        const settingsBox = document.getElementById('profile-border-settings');
        if (state.profileBorderActive) {
            settingsBox.classList.remove('hidden');
        } else {
            settingsBox.classList.add('hidden');
        }
        applyStateToMockup();
    });

    linkColorPickers('profile-border-color', 'profile-border-color-hex', 'profileBorderColor', applyStateToMockup);
    linkColorPickers('profile-bg-fill', 'profile-bg-fill-hex', 'profileBgFill', applyStateToMockup);

    document.getElementById('profile-border-thickness').addEventListener('input', (e) => {
        const state = getActiveState();
        state.profileBorderThickness = parseInt(e.target.value);
        document.getElementById('val-profile-border-thickness').textContent = `${state.profileBorderThickness}px`;
        applyStateToMockup();
    });

    document.getElementById('profile-reset-btn').addEventListener('click', () => {
        const state = getActiveState();
        state.profileScale = 100;
        state.profileOffsetX = 0;
        state.profileOffsetY = 0;
        state.profileBorderActive = false;
        state.profileBorderColor = '#ffffff';
        state.profileBorderThickness = 2;
        state.profileBgFill = '#1a1a1a';
        
        syncSlidersToState('profile');
        applyStateToMockup();
        showToast("Profile controls reset");
    });

    // Thumbnail video details Right Panel inputs binding
    const vTitle = document.getElementById('thumb-video-title');
    const vViews = document.getElementById('thumb-video-views');
    const vTime = document.getElementById('thumb-video-time');
    const vDuration = document.getElementById('thumb-video-duration');

    vTitle.addEventListener('input', () => {
        if (!selectedAsset.startsWith('thumbnail-')) return;
        const idx = selectedAsset.split('-')[1];
        const state = getActiveState();
        
        state.thumbnails[idx].title = vTitle.value;
        document.getElementById('thumb-video-title-count').textContent = vTitle.value.length;
        
        const mockItem = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
        mockItem.querySelector('.mock-video-title').textContent = vTitle.value;
    });

    vViews.addEventListener('input', () => {
        if (!selectedAsset.startsWith('thumbnail-')) return;
        const idx = selectedAsset.split('-')[1];
        const state = getActiveState();
        
        state.thumbnails[idx].views = vViews.value;
        const mockItem = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
        updateMockVideoMeta(mockItem, state.thumbnails[idx]);
    });

    vTime.addEventListener('input', () => {
        if (!selectedAsset.startsWith('thumbnail-')) return;
        const idx = selectedAsset.split('-')[1];
        const state = getActiveState();
        
        state.thumbnails[idx].time = vTime.value;
        const mockItem = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
        updateMockVideoMeta(mockItem, state.thumbnails[idx]);
    });

    vDuration.addEventListener('input', () => {
        if (!selectedAsset.startsWith('thumbnail-')) return;
        const idx = selectedAsset.split('-')[1];
        const state = getActiveState();
        
        state.thumbnails[idx].duration = vDuration.value;
        const mockItem = document.querySelector(`.mock-video-item[data-index="${idx}"]`);
        mockItem.querySelector('.mock-video-duration').textContent = vDuration.value;
    });

    // Thumbnail filter sliders
    document.getElementById('thumb-brightness').addEventListener('input', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].brightness = parseInt(e.target.value);
        document.getElementById('val-thumb-brightness').textContent = state.thumbnails[idx].brightness;
        applyStateToMockup();
    });

    document.getElementById('thumb-contrast').addEventListener('input', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].contrast = parseInt(e.target.value);
        document.getElementById('val-thumb-contrast').textContent = state.thumbnails[idx].contrast;
        applyStateToMockup();
    });

    const thumbTextToggle = document.getElementById('thumb-text-toggle');
    thumbTextToggle.addEventListener('change', () => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].textActive = thumbTextToggle.checked;
        
        const settingsBox = document.getElementById('thumb-text-settings');
        if (state.thumbnails[idx].textActive) {
            settingsBox.classList.remove('hidden');
        } else {
            settingsBox.classList.add('hidden');
        }
        applyStateToMockup();
    });

    document.getElementById('thumb-text-input').addEventListener('input', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].text = e.target.value;
        applyStateToMockup();
    });

    document.getElementById('thumb-text-font').addEventListener('change', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].textFont = e.target.value;
        applyStateToMockup();
    });

    document.getElementById('thumb-text-size').addEventListener('input', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        state.thumbnails[idx].textSize = parseInt(e.target.value);
        document.getElementById('val-thumb-text-size').textContent = `${state.thumbnails[idx].textSize}px`;
        applyStateToMockup();
    });

    document.getElementById('thumb-text-color').addEventListener('input', (e) => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        const val = e.target.value;
        document.getElementById('thumb-text-color-hex').value = val;
        state.thumbnails[idx].textColor = val;
        applyStateToMockup();
    });

    document.getElementById('thumb-text-color-hex').addEventListener('input', (e) => {
        const val = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            document.getElementById('thumb-text-color').value = val;
            const state = getActiveState();
            const idx = selectedAsset.split('-')[1];
            state.thumbnails[idx].textColor = val;
            applyStateToMockup();
        }
    });

    document.querySelectorAll('.grid-picker-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const state = getActiveState();
            const idx = selectedAsset.split('-')[1];
            
            document.querySelectorAll('.grid-picker-cell').forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            
            state.thumbnails[idx].textPos = cell.dataset.pos;
            applyStateToMockup();
        });
    });

    document.getElementById('thumb-reset-btn').addEventListener('click', () => {
        const state = getActiveState();
        const idx = selectedAsset.split('-')[1];
        
        state.thumbnails[idx].brightness = 0;
        state.thumbnails[idx].contrast = 0;
        state.thumbnails[idx].textActive = false;
        state.thumbnails[idx].text = '100x CTR!';
        state.thumbnails[idx].textFont = 'Impact, sans-serif';
        state.thumbnails[idx].textSize = 24;
        state.thumbnails[idx].textColor = '#ffffff';
        state.thumbnails[idx].textPos = 'bottom-left';
        
        loadThumbnailControls(idx);
        applyStateToMockup();
        showToast(`Thumbnail ${parseInt(idx) + 1} settings reset`);
    });


    // ── Direct Reposition (Dragging) on Mockup Canvas (Banner only, PFP disabled) ──
    let isDragging = false;
    let dragTarget = null;
    let startX = 0;
    let startY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    const mockBannerImg = document.getElementById('mock-banner-img');

    function startDrag(e, type) {
        if (selectedAsset !== type) {
            selectAsset(type);
        }
        
        isDragging = true;
        dragTarget = type;
        
        const state = getActiveState();
        
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        startY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (type === 'banner') {
            startOffsetX = state.bannerOffsetX;
            startOffsetY = state.bannerOffsetY;
        }
        
        e.preventDefault();
        
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const dx = clientX - startX;
        const dy = clientY - startY;

        let scaleCorrection = 1;
        let container = null;
        
        if (dragTarget === 'banner') {
            container = document.getElementById('yt-mockup-banner');
        }
        
        if (container) {
            const renderWidth = container.clientWidth;
            const nativeWidth = 2560;
            scaleCorrection = nativeWidth / renderWidth;
        }
        
        const state = getActiveState();
        
        if (dragTarget === 'banner') {
            state.bannerOffsetY = startOffsetY + (dy * scaleCorrection);
            if (state.bannerZoom > 100) {
                state.bannerOffsetX = startOffsetX + (dx * scaleCorrection);
            } else {
                state.bannerOffsetX = 0;
            }
        }
        
        applyStateToMockup();
        positionSelectionOutline();
    }

    function dragEnd() {
        isDragging = false;
        dragTarget = null;
        
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('touchend', dragEnd);
    }

    mockBannerImg.addEventListener('mousedown', (e) => startDrag(e, 'banner'));
    mockBannerImg.addEventListener('touchstart', (e) => startDrag(e, 'banner'), { passive: false });


    // ── Apply State styling to Mockup DOM ──
    function applyStateToMockup() {
        const state = getActiveState();
        
        // 1. Banner
        const mockImg = document.getElementById('mock-banner-img');
        if (state.bannerSrc) {
            if (state.bannerSrc.startsWith('gradient-')) {
                // preset gradients
                const mockPlaceholder = document.getElementById('mock-banner-placeholder');
                const key = state.bannerSrc.split('-')[1];
                const gradients = {
                    gaming: 'linear-gradient(135deg, #1b0922 0%, #ff1c44 100%)',
                    edu: 'linear-gradient(135deg, #0f1c3f 0%, #00b4d8 100%)',
                    vlog: 'linear-gradient(135deg, #4a1d00 0%, #ff8e3c 100%)',
                    tech: 'linear-gradient(135deg, #0b0c10 0%, #66fcf1 100%)',
                    beauty: 'linear-gradient(135deg, #ffe5ec 0%, #ffb3c6 100%)'
                };
                mockPlaceholder.style.background = gradients[key];
                mockPlaceholder.classList.remove('hidden');
                mockImg.classList.add('hidden');
            } else {
                mockImg.src = state.bannerSrc;
                mockImg.style.transform = `translate(${state.bannerOffsetX}px, ${state.bannerOffsetY}px) scale(${state.bannerZoom / 100})`;
                mockImg.style.filter = `brightness(${100 + state.bannerBrightness}%) contrast(${100 + state.bannerContrast}%) saturate(${100 + state.bannerSaturation}%) blur(${state.bannerBlur}px)`;
                mockImg.classList.remove('hidden');
                document.getElementById('mock-banner-placeholder').classList.add('hidden');
            }
        } else {
            mockImg.src = '';
            mockImg.classList.add('hidden');
            document.getElementById('mock-banner-placeholder').classList.remove('hidden');
        }
        
        // Color overlay banner
        let overlayDiv = document.getElementById('banner-color-overlay-el');
        if (!overlayDiv) {
            overlayDiv = document.createElement('div');
            overlayDiv.id = 'banner-color-overlay-el';
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.inset = '0';
            overlayDiv.style.pointerEvents = 'none';
            overlayDiv.style.zIndex = '4';
            document.querySelector('.banner-image-wrapper').appendChild(overlayDiv);
        }
        overlayDiv.style.backgroundColor = state.bannerOverlayColor;
        overlayDiv.style.opacity = state.bannerOverlayOpacity / 100;

        // 2. Profile picture
        const mockPfpImg = document.getElementById('mock-pfp-img');
        const mockPfpCircle = document.querySelector('.mock-pfp-circle');
        const mockPfpPlaceholder = document.getElementById('mock-pfp-placeholder');
        
        if (state.profileSrc) {
            mockPfpImg.src = state.profileSrc;
            mockPfpImg.classList.remove('hidden');
            if (mockPfpPlaceholder) mockPfpPlaceholder.classList.add('hidden');
            mockPfpImg.style.transform = `translate(${state.profileOffsetX}px, ${state.profileOffsetY}px) scale(${state.profileScale / 100})`;
        } else {
            mockPfpImg.src = '';
            mockPfpImg.classList.add('hidden');
            if (mockPfpPlaceholder) mockPfpPlaceholder.classList.remove('hidden');
        }
        
        mockPfpCircle.style.backgroundColor = state.profileBgFill;
        
        const pfpWrapper = document.getElementById('yt-mockup-pfp');
        if (state.profileBorderActive) {
            pfpWrapper.style.border = `${state.profileBorderThickness}px solid ${state.profileBorderColor}`;
        } else {
            pfpWrapper.style.border = '4px solid #0F0F0F';
        }

        // 3. Channel Info
        mockName.textContent = state.channelName;
        mockName.style.fontWeight = state.fontWeightBold ? '700' : '400';
        if (mobileHeaderTitle) {
            mobileHeaderTitle.textContent = state.channelName;
        }
        mockHandle.textContent = `@${state.channelHandle}`;
        mockSubs.textContent = state.subscriberCount;
        mockVids.textContent = state.videoCount;
        mockBio.textContent = state.bioLink;
        mockWeb.textContent = state.websiteLink;

        // 4. Thumbnails & Titles inside grid
        state.thumbnails.forEach((thumb, i) => {
            const mockItem = document.querySelector(`.mock-video-item[data-index="${i}"]`);
            const mockImg = mockItem.querySelector('.mock-thumb-img');
            const mockPlaceholder = mockItem.querySelector('.mock-thumb-placeholder');
            
            if (thumb.src) {
                mockImg.src = thumb.src;
                mockImg.style.filter = `brightness(${100 + thumb.brightness}%) contrast(${100 + thumb.contrast}%)`;
                mockImg.classList.remove('hidden');
                if (mockPlaceholder) mockPlaceholder.classList.add('hidden');
            } else {
                mockImg.src = '';
                mockImg.classList.add('hidden');
                if (mockPlaceholder) mockPlaceholder.classList.remove('hidden');
            }
            
            let textEl = mockItem.querySelector('.thumb-overlay-text-el');
            if (textEl) textEl.remove();
            
            if (thumb.textActive && thumb.src) {
                textEl = document.createElement('div');
                textEl.className = `thumb-overlay-text-el pos-${thumb.textPos}`;
                textEl.textContent = thumb.text;
                textEl.style.fontFamily = thumb.textFont;
                textEl.style.fontSize = `${thumb.textSize}px`;
                textEl.style.color = thumb.textColor;
                
                mockItem.querySelector('.mock-video-thumbnail').appendChild(textEl);
            }
            
            mockItem.querySelector('.mock-video-title').textContent = thumb.title;
            updateMockVideoMeta(mockItem, thumb);
        });


        // Update right panel file names & image previews
        syncRightPanelPreviews();
    }

    function updateMockVideoMeta(mockItem, thumbData) {
        const metaEl = mockItem.querySelector('.mock-video-meta');
        metaEl.querySelector('.mock-video-views').textContent = thumbData.views;
        metaEl.querySelector('.mock-video-time').textContent = thumbData.time;
    }

    // ── Style Presets Application ──
    const presetCards = document.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
        card.addEventListener('click', () => {
            const presetKey = card.dataset.preset;
            const presetData = PRESETS[presetKey];
            
            const state = getActiveState();
            
            if (state.bannerSrc && !state.bannerSrc.startsWith('gradient-')) {
                const replace = confirm("Replace your uploaded banner with this preset gradient?");
                if (!replace) return;
            }
            
            applyPreset(presetKey, presetData);
        });
    });

    function applyPreset(presetKey, presetData) {
        const state = getActiveState();
        
        const gradients = {
            gaming: 'linear-gradient(135deg, #1b0922 0%, #ff1c44 100%)',
            edu: 'linear-gradient(135deg, #0f1c3f 0%, #00b4d8 100%)',
            vlog: 'linear-gradient(135deg, #4a1d00 0%, #ff8e3c 100%)',
            tech: 'linear-gradient(135deg, #0b0c10 0%, #66fcf1 100%)',
            beauty: 'linear-gradient(135deg, #ffe5ec 0%, #ffb3c6 100%)'
        };

        state.bannerSrc = `gradient-${presetKey}`;
        state.bannerName = `gradient-${presetKey}.png`;
        state.bannerDimensions = '2560 × 1440';
        state.bannerZoom = 100;
        state.bannerOffsetX = 0;
        state.bannerOffsetY = 0;
        state.bannerBrightness = 0;
        state.bannerContrast = 0;
        state.bannerSaturation = 0;
        state.bannerBlur = 0;
        state.bannerOverlayColor = presetData.bannerOverlayColor;
        state.bannerOverlayOpacity = presetData.bannerOverlayOpacity;
        state.profileBgFill = presetData.profileBgFill;

        const mockImg = document.getElementById('mock-banner-img');
        mockImg.classList.add('hidden');
        
        const mockPlaceholder = document.getElementById('mock-banner-placeholder');
        mockPlaceholder.style.background = gradients[presetKey];
        mockPlaceholder.classList.remove('hidden');
        
        const emptyStateHint = document.getElementById('canvas-empty-state-hint');
        if (emptyStateHint) emptyStateHint.classList.add('hidden');

        const filledEl = dropzones.banner.querySelector('.dropzone-filled');
        const emptyEl = dropzones.banner.querySelector('.dropzone-empty');
        filledEl.querySelector('.dropzone-thumb').src = '/assets/logo-icon.png';
        filledEl.querySelector('.dropzone-thumb').style.background = gradients[presetKey];
        filledEl.querySelector('.file-name').textContent = state.bannerName;
        filledEl.querySelector('.file-dimensions').textContent = state.bannerDimensions;
        
        emptyEl.classList.add('hidden');
        filledEl.classList.remove('hidden');

        applyStateToMockup();
        selectAsset('banner');
        showToast(`Preset "${presetKey}" applied`);
    }


    // Helper to clone mockup element for exporting
    function createMockupCloneForExport() {
        const container = document.createElement('div');
        container.className = 'device-frame-container compare-frame-node';
        container.innerHTML = `
            <div class="device-frame ${currentDevice}">
                <div class="yt-mockup">
                    <div class="yt-mockup-body">
                        <div class="yt-mockup-main" style="width: 100%;">
                            <!-- Banner -->
                            <div class="yt-mockup-banner">
                                <div class="banner-image-wrapper">
                                    <img class="mock-banner-img hidden">
                                    <div class="banner-placeholder-gradient"></div>
                                </div>
                            </div>
                            <!-- Header -->
                            <div class="yt-mockup-header">
                                <div class="mock-pfp-wrapper">
                                    <div class="mock-pfp-circle">
                                        <img class="mock-pfp-img hidden">
                                        <div class="pfp-placeholder"><i data-lucide="user"></i></div>
                                    </div>
                                </div>
                                <div class="yt-mockup-channel-meta">
                                    <h1 class="mock-channel-name">Channel Name</h1>
                                    <div class="mock-channel-stats">
                                        <span class="stats-handle">@handle</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({node: container});
        }
        return container;
    }

    function applyStateToExportClone(frameContainer, stateData) {
        if (!stateData) return;
        
        const frame = frameContainer.querySelector('.device-frame');
        
        // Banner
        const bannerImg = frame.querySelector('.mock-banner-img');
        const bannerPlaceholder = frame.querySelector('.banner-placeholder-gradient');
        
        if (stateData.bannerSrc) {
            if (stateData.bannerSrc.startsWith('gradient-')) {
                const key = stateData.bannerSrc.split('-')[1];
                const gradients = {
                    gaming: 'linear-gradient(135deg, #1b0922 0%, #ff1c44 100%)',
                    edu: 'linear-gradient(135deg, #0f1c3f 0%, #00b4d8 100%)',
                    vlog: 'linear-gradient(135deg, #4a1d00 0%, #ff8e3c 100%)',
                    tech: 'linear-gradient(135deg, #0b0c10 0%, #66fcf1 100%)',
                    beauty: 'linear-gradient(135deg, #ffe5ec 0%, #ffb3c6 100%)'
                };
                bannerPlaceholder.style.background = gradients[key];
                bannerPlaceholder.classList.remove('hidden');
                bannerImg.classList.add('hidden');
            } else {
                bannerImg.src = stateData.bannerSrc;
                bannerImg.classList.remove('hidden');
                bannerPlaceholder.classList.add('hidden');
                
                bannerImg.style.transform = `translate(${stateData.bannerOffsetX}px, ${stateData.bannerOffsetY}px) scale(${stateData.bannerZoom / 100})`;
                bannerImg.style.filter = `brightness(${100 + stateData.bannerBrightness}%) contrast(${100 + stateData.bannerContrast}%) saturate(${100 + stateData.bannerSaturation}%) blur(${stateData.bannerBlur}px)`;
            }
        }
        
        // Color overlay banner
        let overlayDiv = frame.querySelector('.banner-overlay-color-applied');
        if (!overlayDiv) {
            overlayDiv = document.createElement('div');
            overlayDiv.className = 'banner-overlay-color-applied';
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.inset = '0';
            overlayDiv.style.pointerEvents = 'none';
            frame.querySelector('.banner-image-wrapper').appendChild(overlayDiv);
        }
        overlayDiv.style.backgroundColor = stateData.bannerOverlayColor;
        overlayDiv.style.opacity = stateData.bannerOverlayOpacity / 100;

        // Profile Pic
        const pfpImg = frame.querySelector('.mock-pfp-img');
        const pfpPlaceholder = frame.querySelector('.pfp-placeholder');
        const pfpCircle = frame.querySelector('.mock-pfp-circle');
        const pfpWrapper = frame.querySelector('.mock-pfp-wrapper');
        
        if (stateData.profileSrc) {
            pfpImg.src = stateData.profileSrc;
            pfpImg.classList.remove('hidden');
            pfpPlaceholder.classList.add('hidden');
            pfpImg.style.transform = `translate(${stateData.profileOffsetX}px, ${stateData.profileOffsetY}px) scale(${stateData.profileScale / 100})`;
        }
        
        pfpCircle.style.backgroundColor = stateData.profileBgFill;
        if (stateData.profileBorderActive) {
            pfpWrapper.style.border = `${stateData.profileBorderThickness}px solid ${stateData.profileBorderColor}`;
        } else {
            const defaultBorderColor = document.body.classList.contains('light-theme') ? '#FFFFFF' : '#0F0F0F';
            pfpWrapper.style.border = `4px solid ${defaultBorderColor}`;
        }

        // Name & Handles
        frame.querySelector('.mock-channel-name').textContent = stateData.channelName;
        frame.querySelector('.mock-channel-name').style.fontWeight = stateData.fontWeightBold ? '700' : '400';
        frame.querySelector('.stats-handle').textContent = `@${stateData.channelHandle}`;
    }


    // ── Export Flow Engine ──
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const state = getActiveState();
        if (!state.bannerSrc && !state.profileSrc) {
            showToast("Upload banner or profile to export preview", true);
            return;
        }
        exportDropdown.classList.toggle('show');
    });

    window.addEventListener('click', () => {
        exportDropdown.classList.remove('show');
    });

    const exportOptions = document.querySelectorAll('.export-option');
    exportOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const format = opt.dataset.export;
            triggerExport(format);
        });
    });

    function triggerExport(format) {
        exportBtn.disabled = true;
        exportBtn.innerHTML = `<span>Exporting...</span> <i data-lucide="loader" class="animate-spin"></i>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({node: exportBtn});
        }

        setTimeout(async () => {
            try {
                if (format === 'zip') {
                    await exportAllAsZip();
                } else {
                    await exportSinglePreview(format);
                }
            } catch (err) {
                console.error("Export failure: ", err);
                showToast("Export failed. Please check browser support.", true);
            } finally {
                exportBtn.disabled = false;
                exportBtn.innerHTML = `<span>Export</span> <i data-lucide="download"></i>`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons({node: exportBtn});
                }
            }
        }, 300);
    }

    async function exportSinglePreview(deviceKey) {
        const nativeWidths = { desktop: 1280, tablet: 800, mobile: 420 };
        const targetWidth = nativeWidths[deviceKey];

        const offscreenContainer = document.createElement('div');
        offscreenContainer.style.position = 'fixed';
        offscreenContainer.style.left = '-9999px';
        offscreenContainer.style.top = '-9999px';
        offscreenContainer.style.width = `${targetWidth}px`;
        bodyEl.appendChild(offscreenContainer);

        const cloneFrame = createMockupCloneForExport();
        
        const frameDiv = cloneFrame.querySelector('.device-frame');
        frameDiv.className = `device-frame ${deviceKey}`;
        frameDiv.style.width = '100%';
        frameDiv.style.borderRadius = '0';
        frameDiv.style.border = 'none';
        frameDiv.style.boxShadow = 'none';
        
        offscreenContainer.appendChild(cloneFrame);

        const state = getActiveState();
        applyStateToExportClone(cloneFrame, state);

        const imgs = cloneFrame.querySelectorAll('img');
        const imgPromises = Array.from(imgs).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(res => {
                img.onload = res;
                img.onerror = res;
            });
        });
        await Promise.all(imgPromises);
        await new Promise(res => setTimeout(res, 100));

        const exportBgColor = document.body.classList.contains('light-theme') ? '#FFFFFF' : '#0F0F0F';
        const canvas = await html2canvas(frameDiv, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: exportBgColor,
            scale: 2,
            logging: false
        });

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `channelkit-${deviceKey}-preview.png`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`✓ ${deviceKey.toUpperCase()} preview exported`);
        }, 'image/png');

        offscreenContainer.remove();
    }

    async function exportAllAsZip() {
        if (typeof JSZip === 'undefined') {
            showToast("JSZip library failed to load", true);
            return;
        }

        const zip = new JSZip();
        const devices = ['desktop', 'tablet', 'mobile'];
        const nativeWidths = { desktop: 1280, tablet: 800, mobile: 420 };

        for (const deviceKey of devices) {
            const targetWidth = nativeWidths[deviceKey];

            const offscreenContainer = document.createElement('div');
            offscreenContainer.style.position = 'fixed';
            offscreenContainer.style.left = '-9999px';
            offscreenContainer.style.top = '-9999px';
            offscreenContainer.style.width = `${targetWidth}px`;
            bodyEl.appendChild(offscreenContainer);

            const cloneFrame = createMockupCloneForExport();
            
            const frameDiv = cloneFrame.querySelector('.device-frame');
            frameDiv.className = `device-frame ${deviceKey}`;
            frameDiv.style.width = '100%';
            frameDiv.style.borderRadius = '0';
            frameDiv.style.border = 'none';
            frameDiv.style.boxShadow = 'none';
            
            offscreenContainer.appendChild(cloneFrame);

            const state = getActiveState();
            applyStateToExportClone(cloneFrame, state);

            const imgs = cloneFrame.querySelectorAll('img');
            const imgPromises = Array.from(imgs).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(res => {
                    img.onload = res;
                    img.onerror = res;
                });
            });
            await Promise.all(imgPromises);
            await new Promise(res => setTimeout(res, 100));

            const exportBgColor = document.body.classList.contains('light-theme') ? '#FFFFFF' : '#0F0F0F';
            const canvas = await html2canvas(frameDiv, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: exportBgColor,
                scale: 1.5,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png').split(',')[1];
            zip.file(`channelkit-${deviceKey}-preview.png`, imgData, { base64: true });

            offscreenContainer.remove();
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'channelkit-all-previews.zip';
        a.click();
        URL.revokeObjectURL(url);
        
        showToast("✓ ZIP archive exported successfully");
    }

    // Toggle Left Drawer
    const leftPanelToggle = document.getElementById('left-panel-drawer-toggle');
    if (leftPanelToggle) {
        leftPanelToggle.addEventListener('click', () => {
            leftPanel.classList.toggle('open');
            const isOpen = leftPanel.classList.contains('open');
            leftPanelToggle.innerHTML = isOpen ? `<i data-lucide="x"></i>` : `<i data-lucide="menu"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons({node: leftPanelToggle});
            }
        });
    }

    // ── Reactive Canvas Background ──
    const centerCanvas = document.querySelector('.center-canvas');
    if (centerCanvas) {
        centerCanvas.addEventListener('mousemove', (e) => {
            const rect = centerCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            centerCanvas.style.setProperty('--mouse-x', `${x}px`);
            centerCanvas.style.setProperty('--mouse-y', `${y}px`);
        });

        centerCanvas.addEventListener('mouseleave', () => {
            centerCanvas.style.setProperty('--mouse-x', `-9999px`);
            centerCanvas.style.setProperty('--mouse-y', `-9999px`);
        });
    }

    // ── Right Panel File Selection Triggers ──
    const panelBannerUploadBtn = document.getElementById('panel-banner-upload-btn');
    if (panelBannerUploadBtn) {
        panelBannerUploadBtn.addEventListener('click', () => {
            const bannerInput = document.getElementById('banner-input');
            if (bannerInput) bannerInput.click();
        });
    }

    const panelProfileUploadBtn = document.getElementById('panel-profile-upload-btn');
    if (panelProfileUploadBtn) {
        panelProfileUploadBtn.addEventListener('click', () => {
            const profileInput = document.getElementById('profile-input');
            if (profileInput) profileInput.click();
        });
    }

    const panelThumbUploadBtn = document.getElementById('panel-thumb-upload-btn');
    if (panelThumbUploadBtn) {
        panelThumbUploadBtn.addEventListener('click', () => {
            if (selectedAsset && selectedAsset.startsWith('thumbnail-')) {
                const idx = selectedAsset.split('-')[1];
                const thumbInput = document.getElementById(`thumb-input-${idx}`);
                if (thumbInput) thumbInput.click();
            }
        });
    }

    // ── Theme Toggle Manager ──
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const themeToggleText = document.getElementById('theme-toggle-text');

    function applyTheme(theme) {
        if (theme === 'light') {
            bodyEl.classList.add('light-theme');
            if (themeToggleIcon) themeToggleIcon.setAttribute('data-lucide', 'moon');
            if (themeToggleText) themeToggleText.textContent = 'Dark Mode';
            if (themeToggleBtn) themeToggleBtn.title = 'Switch to Dark Mode';
        } else {
            bodyEl.classList.remove('light-theme');
            if (themeToggleIcon) themeToggleIcon.setAttribute('data-lucide', 'sun');
            if (themeToggleText) themeToggleText.textContent = 'Bright Mode';
            if (themeToggleBtn) themeToggleBtn.title = 'Switch to Bright Mode';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({node: themeToggleBtn});
        }
    }

    // Load initial theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = bodyEl.classList.contains('light-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
            showToast(`Switched to ${currentTheme === 'light' ? 'Bright' : 'Dark'} Mode`);
        });
    }

    // Initialize Mockup & sidebar forms
    applyStateToMockup();
    updateCanvasViewport();
});
