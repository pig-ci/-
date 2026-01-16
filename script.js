let galleryImagesLoaded = false;
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
    // 懶加載邏輯：當切換到 gallery 頁面且圖片尚未加載時執行
    if (pageName === 'gallery' && !galleryImagesLoaded) {
        const galleryImages = document.querySelectorAll('.gallery-grid img[data-src]');
        galleryImages.forEach(img => {
            if (img.dataset.src) { // 檢查 data-src 是否存在
                img.src = img.dataset.src;
            }
        });
        galleryImagesLoaded = true; // 標記為已載入，避免重複執行
    }

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });
}

/**
 * 輔助函式：關閉手機版選單
 */
function closeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle) menuToggle.classList.remove('is-active');
    if (navLinksContainer) navLinksContainer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    
    document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", () => {
    /* --- 1. 時間軸滾動動畫 --- */
    const observerOptions = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
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

    /* --- 2. 漢堡選單控制 --- */
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
        if (overlay) overlay.addEventListener('click', closeMobileMenu);
    }
    
    // ▼▼▼ 【核心修正】使用事件委派監聽圖片點擊 ▼▼▼
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.addEventListener('click', function(event) {
            // 找到被點擊元素最近的 .gallery-item 父元素
            const galleryItem = event.target.closest('.gallery-item');
            if (galleryItem) {
                openImageModal(galleryItem);
            }
        });
    }
});

/**
 * 彈窗控制功能 (Modal)
 */
function openModal(element) {
    const modal = document.getElementById("detail-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const title = element.querySelector("h2") ? element.querySelector("h2").innerText : "";
    const detailHTML = element.querySelector(".full-text") ? element.querySelector(".full-text").innerHTML : "<p>內容準備中...</p>";

    if (modalTitle) modalTitle.innerText = title;
    if (modalBody) modalBody.innerHTML = `<div class="modal-full-text">${detailHTML}</div>`;
    
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) {
        modal.style.display = "none";
        // 只有在其他彈窗或選單都沒開啟時才恢復滾動
        const navLinksContainer = document.querySelector('.nav-links');
        const imageModal = document.getElementById("image-modal");
        if (!navLinksContainer.classList.contains('active') && imageModal.style.display !== 'block') {
            document.body.style.overflow = "auto"; 
        }
    }
}

/**
 * 圖片彈窗控制功能 (Image Lightbox) - 已修正
 */
function openImageModal(element) {
    const imageModal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img-src");
    const captionText = document.getElementById("modal-img-caption");

    const sourceImg = element.querySelector("img[data-src]");
    const sourceCaption = element.querySelector(".caption h3");

    if (imageModal && modalImg && sourceImg && sourceImg.dataset.src) {
        imageModal.style.display = "block";
        // 直接從 data-src 獲取最可靠的圖片路徑
        modalImg.src = sourceImg.dataset.src;
        captionText.innerHTML = sourceCaption ? sourceCaption.innerHTML : '';
        document.body.style.overflow = "hidden";
    }
}

function closeImageModal() {
    const imageModal = document.getElementById("image-modal");
    if (imageModal) {
        imageModal.style.display = "none";
        // 只有在其他彈窗或選單都沒開啟時才恢復滾動
        const navLinksContainer = document.querySelector('.nav-links');
        const detailModal = document.getElementById("detail-modal");
        if (!navLinksContainer.classList.contains('active') && detailModal.style.display !== 'block') {
            document.body.style.overflow = "auto";
        }
    }
}

/* --- 全域事件監聽 --- */
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
        closeModal();
    }
});