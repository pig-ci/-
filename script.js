let galleryImagesLoaded = false;
let currentOpenEventKey = "";
const translations = {};

// Web Speech API 變數
let synth = window.speechSynthesis;
let utterance = null;

async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`無法載入語言檔: ${lang}`);
        const langData = await response.json();
        translations[lang] = langData;
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.innerHTML = langData[key];
            }
        });
        const detailModal = document.getElementById("detail-modal");
        if (detailModal && detailModal.style.display === "block" && currentOpenEventKey) {
            updateModalContent(currentOpenEventKey, lang);
        }
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
        // 切換語言時停止目前的朗讀
        stopTTS();
    } catch (error) {
        console.error("翻譯錯誤:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('preferredLang') || 'zh-TW';
    setLanguage(savedLang);
});

function switchPage(pageName) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.toggle('active-section', section.id === `page-${pageName}`);
    });
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const onclickAttr = link.getAttribute('onclick') || "";
        const isMatch = onclickAttr.includes(pageName);
        link.classList.toggle('active', isMatch);
    });
    if (pageName === 'gallery' && !galleryImagesLoaded) {
        const galleryImages = document.querySelectorAll('.gallery-grid img[data-src]');
        galleryImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        galleryImagesLoaded = true;
    }
    closeMobileMenu();
    stopTTS(); // 切換頁面停止朗讀
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// 監控滾動與手機選單邏輯 (保持不變)
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (index === 0) {
            item.classList.add('is-visible');
        } else {
            observer.observe(item);
        }
    });

    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinksContainer.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                menuToggle.classList.add('is-active');
                navLinksContainer.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = "hidden";
            }
        });
        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }
    }
    
    // 圖片燈箱邏輯
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.addEventListener('click', function(event) {
            const galleryItem = event.target.closest('.gallery-item');
            if (galleryItem) {
                openImageModal(galleryItem);
            }
        });
    }

    const modalImg = document.getElementById('modal-img-src');
    const zoomContainer = document.querySelector('.image-zoom-container');
    if (modalImg && zoomContainer) {
        modalImg.addEventListener('click', function(e) {
            if (!this.classList.contains('zoomed')) {
                const rect = this.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const xRatio = offsetX / rect.width;
                const yRatio = offsetY / rect.height;
                this.style.transformOrigin = `${xRatio * 100}% ${yRatio * 100}%`;
                this.classList.add('zoomed');
            } else {
                this.classList.remove('zoomed');
                setTimeout(() => {
                    this.style.transformOrigin = 'center center';
                }, 300);
            }
        });
    }
});

function closeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle) menuToggle.classList.remove('is-active');
    if (navLinksContainer) navLinksContainer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    
    const detailModal = document.getElementById("detail-modal");
    const imageModal = document.getElementById("image-modal");
    if (detailModal && imageModal) {
        if (detailModal.style.display !== 'block' && imageModal.style.display !== 'block') {
             document.body.style.overflow = "auto";
        }
    }
}

// --- 朗讀邏輯 (Web Speech API) ---

function toggleAudio() {
    const ttsBtn = document.getElementById("tts-btn");
    // 檢查 HTML 上的 data-tts-enabled 屬性
    if (ttsBtn.getAttribute('data-tts-enabled') !== "true") return;

    if (synth.speaking) {
        stopTTS();
        return;
    }

    const modalBody = document.getElementById("modal-body");
    const textToRead = modalBody.innerText; 
    const currentLang = document.documentElement.lang || 'zh-TW';

    utterance = new SpeechSynthesisUtterance(textToRead);
    
    // 語言對應表
    const langMap = {
        'zh-TW': 'zh-TW',
        'zh-CN': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP'
    };
    utterance.lang = langMap[currentLang] || currentLang;
    utterance.rate = 1.0;

    utterance.onstart = () => updateTTSButtonState(true);
    utterance.onend = () => updateTTSButtonState(false);
    utterance.onerror = () => stopTTS();

    synth.speak(utterance);
}

function stopTTS() {
    if (synth) {
        synth.cancel();
        updateTTSButtonState(false);
    }
}

function updateTTSButtonState(speaking) {
    const playSvg = document.getElementById("svg-play");
    const pauseSvg = document.getElementById("svg-pause");
    const btnText = document.getElementById("tts-text");
    const currentLang = document.documentElement.lang;

    if (speaking) {
        if (playSvg) playSvg.style.display = "none";
        if (pauseSvg) pauseSvg.style.display = "inline-block";
        if (btnText) {
            // 這裡可以根據需要加入更多語言的停止按鈕翻譯
            btnText.innerText = (currentLang === 'ja') ? "停止" : "停止播放";
        }
    } else {
        if (playSvg) playSvg.style.display = "inline-block";
        if (pauseSvg) pauseSvg.style.display = "none";
        if (btnText) {
            // 回復原本的朗讀按鈕文字
            btnText.innerText = translations[currentLang]?.['tts-read'] || "朗讀全文";
        }
    }
}

// --- Modal 控制邏輯 ---

function openModal(element) {
    currentOpenEventKey = element.getAttribute('data-event-id');
    const title = element.querySelector('h2').textContent;
    const fullTextHtml = element.querySelector('.full-text').innerHTML;
    
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = fullTextHtml;

    // 重置按鈕狀態
    stopTTS(); 
    
    document.getElementById("detail-modal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const detailModal = document.getElementById("detail-modal");
    if (detailModal) {
        detailModal.style.display = "none";
        stopTTS(); // 關閉視窗務必停止聲音
    }
    document.body.style.overflow = "auto";
}

function updateModalContent(eventKey, lang) {
    const titleKey = `${eventKey}-title`;
    const textKey = `${eventKey}-full-text`;
    
    if (translations[lang]) {
        if (translations[lang][titleKey]) {
            document.getElementById("modal-title").textContent = translations[lang][titleKey];
        }
        if (translations[lang][textKey]) {
            const modalBody = document.getElementById("modal-body");
            modalBody.innerHTML = `<div class="modal-full-text">${translations[lang][textKey]}</div>`;
        }
    }
}

// 圖片燈箱與游標邏輯 (保持不變)
function openImageModal(element) {
    const imageModal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img-src");
    const captionText = document.getElementById("modal-img-caption");

    const sourceImg = element.querySelector("img[data-src]");
    const sourceCaption = element.querySelector(".caption h3");

    if (imageModal && modalImg && sourceImg && sourceImg.dataset.src) {
        modalImg.classList.remove('zoomed');
        modalImg.style.transformOrigin = 'center';
        imageModal.style.display = "block";
        setTimeout(() => imageModal.classList.add('visible'), 10); 
        modalImg.src = sourceImg.dataset.src; 
        captionText.innerHTML = sourceCaption ? sourceCaption.innerHTML : '';
        document.body.style.overflow = "hidden";
    }
}

function closeImageModal() {
    const imageModal = document.getElementById("image-modal");
    if (imageModal && imageModal.style.display === 'block') {
        imageModal.classList.remove('visible');
        setTimeout(() => {
            imageModal.style.display = "none";
            const modalImg = document.getElementById('modal-img-src');
            if (modalImg) {
                modalImg.classList.remove('zoomed'); 
                modalImg.style.transformOrigin = 'center';
            }
        }, 300);
        const navLinksContainer = document.querySelector('.nav-links');
        const detailModal = document.getElementById("detail-modal");
        if (!navLinksContainer.classList.contains('active') && detailModal.style.display !== 'block') {
            document.body.style.overflow = "auto";
        }
    }
}

window.onclick = function(event) {
    const detailModal = document.getElementById("detail-modal");
    const imageModal = document.getElementById("image-modal");
    if (event.target == detailModal) closeModal();
    if (event.target == imageModal) closeImageModal();
};

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
        closeImageModal();
        closeMobileMenu();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
});
