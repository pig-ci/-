let galleryImagesLoaded = false;
let currentOpenEventKey = "";
const translations = {};
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
        galleryImagesLoaded = true; // 標記為已載入，避免重複執行
    }
    closeMobileMenu(); // 切換頁面後自動關閉手機選單
    window.scrollTo({ top: 0, behavior: 'instant' }); // 切換後回到頁面頂部
}
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
            item.classList.add('is-visible'); // 第一個項目預設可見
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
                document.body.style.overflow = "hidden"; // 禁止背景滾動
            }
        });
        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }
    }
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
// script.js

let currentAudio = null;

function openModal(element) {
    currentOpenEventKey = element.getAttribute('data-event-id');
    const title = element.querySelector('h2').textContent;
    const fullTextHtml = element.querySelector('.full-text').innerHTML;
    
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = fullTextHtml;

    // 設定音訊來源 (假設是 mp3)
    const audioPlayer = document.getElementById("timeline-audio");
    audioPlayer.src = `audio/${currentOpenEventKey}.mp3`;
    resetAudioButton();

    document.getElementById("detail-modal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function toggleAudio() {
    const audio = document.getElementById("timeline-audio");
    const playSvg = document.getElementById("svg-play");
    const pauseSvg = document.getElementById("svg-pause");
    const btnText = document.getElementById("tts-text");

    if (audio.paused) {
        audio.play();
        // 顯示暫停，隱藏播放
        playSvg.style.display = "none";
        pauseSvg.style.display = "inline-block";
        btnText.textContent = "停止播放";
    } else {
        audio.pause();
        audio.currentTime = 0; 
        resetAudioButton();
    }
}

function audioEnded() {
    resetAudioButton();
}

function resetAudioButton() {
    const playSvg = document.getElementById("svg-play");
    const pauseSvg = document.getElementById("svg-pause");
    const btnText = document.getElementById("tts-text");

    if (playSvg && pauseSvg && btnText) {
        playSvg.style.display = "inline-block";
        pauseSvg.style.display = "none";
        btnText.textContent = "朗讀全文";
    }
}

// 記得在 closeModal 也要呼叫 resetAudioButton()
function closeModal() {
    const detailModal = document.getElementById("detail-modal");
    if (detailModal) {
        detailModal.style.display = "none";
        const audio = document.getElementById("timeline-audio");
        audio.pause();
        audio.currentTime = 0;
        resetAudioButton(); // 確保下次打開時按鈕狀態正確
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
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('preferredLang') || 'zh-TW';
    setLanguage(savedLang);
});
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
document.addEventListener('click', function(e){
    if (e.target && e.target.classList.contains('close-btn')){
        if (e.target.closest('#detail-modal')) {
             closeModal();
        }
        if (e.target.closest('#image-modal')) {
             closeImageModal();
        }
    }
});
