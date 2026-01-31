let galleryImagesLoaded = false;
let currentOpenEventKey = "";
const translations = {};
async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`無法載入語言檔: ${lang}`);
        translations[lang] = await response.json();
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        const detailModal = document.getElementById("detail-modal");
        if (detailModal && detailModal.style.display === "block" && currentOpenEventKey) {
            document.getElementById("modal-title").textContent = translations[lang][currentOpenEventKey + "-title"] || "";
            document.getElementById("modal-details").textContent = translations[lang][currentOpenEventKey + "-details"] || "";
            document.getElementById("modal-thought").textContent = translations[lang][currentOpenEventKey + "-thought"] || "";
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
function openModal(element) {
    // 1. 獲取標題：從點擊的元素中尋找 h2
    const title = element.querySelector('h2').textContent;
    
    // 2. 獲取詳細內容：從點擊的元素中尋找 .full-text 的內容
    const fullTextContent = element.querySelector('.full-text').innerHTML;

    // 3. 填充到彈窗中
    document.getElementById("modal-title").textContent = title;
    
    // 這裡我們把內容放入 modal-body-container
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `<div class="modal-full-text">${fullTextContent}</div>`;

    // 4. 顯示彈窗
    const modal = document.getElementById("detail-modal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; 
}
function closeModal() {
    const modal = document.getElementById("detail-modal");
    if (modal && modal.style.display === 'block') {
        modal.style.display = "none";
        const navLinksContainer = document.querySelector('.nav-links');
        const imageModal = document.getElementById("image-modal");
        if (!navLinksContainer.classList.contains('active') && imageModal.style.display !== 'block') {
            document.body.style.overflow = "auto"; 
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
