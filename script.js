let galleryImagesLoaded = false;
let currentOpenEventKey = "";
const translations = {};

// Web Speech API 全域變數
let synth = window.speechSynthesis;
let utteranceQueue = []; // 存放長文本拆分後的句子
let isManualStopping = false;

/**
 * 設定語言並切換內容
 */
async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`無法載入語言檔: ${lang}`);
        const langData = await response.json();
        translations[lang] = langData;

        // 更新頁面中帶有 data-i18n 屬性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.innerHTML = langData[key];
            }
        });

        // 如果 Modal 開著，同步更新 Modal 內容
        const detailModal = document.getElementById("detail-modal");
        if (detailModal && detailModal.style.display === "block" && currentOpenEventKey) {
            updateModalContent(currentOpenEventKey, lang);
        }

        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
        // 切換語言時務必停止朗讀，避免語音與文字不符
        stopTTS();
    } catch (error) {
        console.error("翻譯錯誤:", error);
    }
}

/**
 * 頁面切換邏輯
 */
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

    // 懶加載相簿圖片
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

/**
 * Web Speech API 核心朗讀邏輯
 */
function toggleAudio() {
    const ttsBtn = document.getElementById("tts-btn");
    // 檢查是否有 HTML 屬性控制開關
    const isEnabled = ttsBtn.getAttribute('data-tts-enabled') !== "false";
    if (!isEnabled) return;

    // 如果正在讀，再次點擊則停止
    if (synth.speaking) {
        stopTTS();
        return;
    }

    const modalBody = document.getElementById("modal-body");
    const fullText = modalBody.innerText.trim();
    const currentLang = document.documentElement.lang || 'zh-TW';

    if (!fullText) return;

    // --- 解決長文本中斷問題的核心：分段處理 ---
    // 使用正則表達式根據標點符號或換行拆分句子，避免單次讀取字數過多
    utteranceQueue = fullText.split(/[。！？\?\!\n\r]/g).filter(s => s.trim().length > 0);
    
    isManualStopping = false;
    speakNextPart(currentLang);
}

/**
 * 遞迴播放隊列中的文字
 */
function speakNextPart(langCode) {
    if (utteranceQueue.length === 0 || isManualStopping) {
        updateTTSButtonState(false);
        return;
    }

    const textPart = utteranceQueue.shift();
    const utterance = new SpeechSynthesisUtterance(textPart);
    
    // 語言對應
    const langMap = {
        'zh-TW': 'zh-TW',
        'zh-CN': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP'
    };
    utterance.lang = langMap[langCode] || langCode;
    utterance.rate = 1.0;  // 語速
    utterance.pitch = 1.0; // 音調

    utterance.onstart = () => updateTTSButtonState(true);
    
    utterance.onend = () => {
        // 當前片段結束，自動播放下一段
        if (!isManualStopping) {
            speakNextPart(langCode);
        }
    };

    utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance 發生錯誤:", event);
        stopTTS();
    };

    synth.speak(utterance);
}

/**
 * 停止所有語音行為
 */
function stopTTS() {
    isManualStopping = true;
    utteranceQueue = []; 
    if (synth) {
        synth.cancel();
        updateTTSButtonState(false);
    }
}

/**
 * UI 按鈕狀態切換 (SVG 圖示與文字)
 */
function updateTTSButtonState(speaking) {
    const playSvg = document.getElementById("svg-play");
    const pauseSvg = document.getElementById("svg-pause");
    const btnText = document.getElementById("tts-text");
    const currentLang = document.documentElement.lang;

    if (speaking) {
        if (playSvg) playSvg.style.display = "none";
        if (pauseSvg) pauseSvg.style.display = "inline-block";
        if (btnText) {
            // 針對停止狀態做簡單翻譯
            const stopLabel = (currentLang === 'ja') ? "停止" : (currentLang === 'en' ? "Stop" : "停止播放");
            btnText.innerText = stopLabel;
        }
    } else {
        if (playSvg) playSvg.style.display = "inline-block";
        if (pauseSvg) pauseSvg.style.display = "none";
        if (btnText) {
            // 回復為 JSON 定義的「朗讀全文」
            btnText.innerText = translations[currentLang]?.['tts-read'] || "朗讀全文";
        }
    }
}

/**
 * Modal 視窗控制
 */
function openModal(element) {
    currentOpenEventKey = element.getAttribute('data-event-id');
    const title = element.querySelector('h2').textContent;
    const fullTextHtml = element.querySelector('.full-text').innerHTML;
    
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = fullTextHtml;

    stopTTS(); // 每次開啟新視窗先停止舊語音
    
    document.getElementById("detail-modal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const detailModal = document.getElementById("detail-modal");
    if (detailModal) {
        detailModal.style.display = "none";
        stopTTS(); 
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

/**
 * 圖片燈箱邏輯
 */
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
        
        // 如果詳情視窗沒開，才恢復捲動
        const detailModal = document.getElementById("detail-modal");
        if (detailModal && detailModal.style.display !== 'block') {
            document.body.style.overflow = "auto";
        }
    }
}

/**
 * 手機選單控制
 */
function closeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle) menuToggle.classList.remove('is-active');
    if (navLinksContainer) navLinksContainer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

/**
 * 初始化與事件監聽
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. 語系初始化
    const savedLang = localStorage.getItem('preferredLang') || 'zh-TW';
    setLanguage(savedLang);

    // 2. 時間軸滾動動畫監測
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
        if (index === 0) item.classList.add('is-visible');
        else observer.observe(item);
    });

    // 3. 手機選單事件
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle) {
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
    }
    if (overlay) overlay.addEventListener('click', closeMobileMenu);

    // 4. 客製化游標邏輯
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mousedown', () => cursor.classList.add('active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('active'));
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }
});

/**
 * 全域點擊與按鍵監聽
 */
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
