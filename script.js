let galleryImagesLoaded = false;
const translations = {
    'zh-TW': {
        // 導覽列
        'nav-exchange': '台日交流',
        'nav-education': '實人教育',
        'nav-interview': '特殊採訪',
        'nav-gallery': '影像專區',
        'nav-contact': '聯絡我們',
        // 頁面一：台日交流 (預設頁面)
        'exchange-hero-title': '台日交流歷程',
        'exchange-hero-subtitle': '台日交流',
        // 時間軸事件 2024.01
        'event-202401-title': '「台日交流的起點，一封信！」',
        'event-202401-details': '——手寫信關心能登半島',
        'event-202401-thought': '有意義，可以關心其他國際的事情——可可',
        // 時間軸事件 2024.05
        'event-202405-title': '「福島地獄交流挑戰記——用三個月學會日文」',
        'event-202405-details': '——日本福島交流',
        'event-202405-thought': '第一次去日本跟那麼多人交流，我體驗到了當地的文化...——貝貝',
        // 時間軸事件 2025.01
        'event-202501-title': '福島學生來台',
        'event-202501-thought': '在這次的交流中，我們練習到了日文，也讓日本人了解在台灣將軍村的文化...——Andrew',
        // 時間軸事件 2025.09
        'event-202509-title': '三崎小學教師來台',
        // 時間軸事件 2025.11
        'event-202511-title': '壓力超大——三浦市百位教師線上觀摩台日交流',
        // 時間軸事件 2025.12
        'event-202512-title': '直接體驗日本小學——三崎小學校入班學習',
        // 時間軸事件 2026.01
        'event-202601-title': '訪問山口廣輝',
        // 頁面二：實人教育
        'edu-hero-title': '實人教育',
        'edu-hero-subtitle': '探討教育理念與實踐哲學',
        'edu-card1-title': '教育理念',
        'edu-card1-content': '實人教育是一個以「原型教育」為核心的非學制態實驗教育團體，目前由 30 位小四至國三的孩子組成。實人強調三種核心生命動力：生存力、生活力、生命力，並以五實原則作為學習根本：誠實、踏實、實驗、實踐、真實',
        'edu-card2-title': '簡介',
        'edu-card3-title': '結語',
        // 頁面三：特殊採訪
        'interview-hero-title': '特殊採訪',
        'interview-hero-subtitle': '深入報導與專訪紀錄',
        // 頁面四：影像專區
        'gallery-hero-title': '影像專區',
        'gallery-hero-subtitle': '捕捉交流的精彩瞬間',
        // 頁面五：聯絡我們
        'contact-hero-title': '聯絡我們',
        'contact-hero-subtitle': '如有任何問題或建議，歡迎與我們聯繫',
        'contact-info-title': '聯繫資訊',
        'contact-credits-title': '製作人員名單',
        'contact-faq-title': '常見問答 (FAQ)'
    },
    'ja': {
        // 導覽列
        'nav-exchange': '日台交流',
        'nav-education': '実人教育',
        'nav-interview': '特別インタビュー',
        'nav-gallery': 'フォトギャラリー',
        'nav-contact': 'お問い合わせ',
        // 頁面一：台日交流
        'exchange-hero-title': '日台交流の歩み',
        'exchange-hero-subtitle': '日台交流',
        // 時間軸事件 2024.01
        'event-202401-title': '「交流の原点、一通の手紙から」',
        'event-202401-details': '——能登半島への寄せ書き',
        'event-202401-thought': '意味のあることで、国際的な出来事に関心を持つきっかけになった。——Coco',
        // 時間軸事件 2024.05
        'event-202405-title': '「福島地獄の交流挑戦記——3ヶ月で日本語をマスター」',
        'event-202405-details': '——日本福島交流',
        'event-202405-thought': '初めて日本で多くの人と交流し、現地の文化を体験しました...——Beibei',
        // 時間軸事件 2025.01
        'event-202501-title': '福島の学生が台湾へ',
        'event-202501-thought': '日本語を練習し、日本の方々に台湾の将軍村の文化を知ってもらえました...——Andrew',
        // 時間軸事件 2025.09
        'event-202509-title': '三崎小学校教師の訪台',
        // 時間軸事件 2025.11
        'event-202511-title': 'プレッシャー最大——100名の教師によるオンライン参観',
        // 時間軸事件 2025.12
        'event-202512-title': '日本小学校体験——三崎小学校への入級学習',
        // 時間軸事件 2026.01
        'event-202601-title': '山口広輝氏へのインタビュー',
        // 頁面二：實人教育
        'edu-hero-title': '実人教育',
        'edu-hero-subtitle': '教育理念と実践哲学の探求',
        'edu-card1-title': '教育理念',
        'edu-card1-content': '実人教育は、「原型教育」を核とした、制度にとらわれないオルタナティブ教育団体です。現在、小学4年生から中学3年生まで、30名の子供たちが在籍しています。実人では、3つの核心的な生命力として「生存力」「生活力」「生命力」を大切にしています。また、学習の根幹として「五実原則」を掲げています。それは、誠実、踏実、実験、実践、そして真実の5つです。',
        'edu-card2-title': '紹介',
        'edu-card3-title': '結び',
        // 頁面三：特殊採訪
        'interview-hero-title': '特別インタビュー',
        'interview-hero-subtitle': '詳細レポートとインタビュー記録',
        // 頁面四：影像專區
        'gallery-hero-title': 'ギャラリー',
        'gallery-hero-subtitle': '交流の輝かしい瞬間',
        // 頁面五：聯絡我們
        'contact-hero-title': 'お問い合わせ',
        'contact-hero-subtitle': 'ご質問やご提案がございましたら、お気軽にご連絡ください',
        'contact-info-title': '連絡先情報',
        'contact-credits-title': '制作チーム',
        'contact-faq-title': 'よくある質問 (FAQ)'
    }
};
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
function setLanguage(lang) {
    // 1. 尋找所有帶有 data-i18n 屬性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    localStorage.setItem('preferredLang', lang);
    document.documentElement.lang = lang;
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
