/**
 * 頁面切換功能
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

    // 切換頁面後，自動收合手機版選單與遮罩
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
    
    // 恢復背景滾動
    document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", () => {
    /* --- 1. 時間軸滾動動畫 (Intersection Observer) --- */
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

    /* --- 2. 漢堡選單與遮罩控制 --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (menuToggle && navLinksContainer) {
        // 點擊漢堡按鈕
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinksContainer.classList.contains('active');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                menuToggle.classList.add('is-active');
                navLinksContainer.classList.add('active');
                if (overlay) overlay.classList.add('active');
                // 防止選單開啟時後方頁面滾動
                document.body.style.overflow = "hidden";
            }
        });

        // 點擊遮罩層收合選單
        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }
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
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="content-wrapper">
                <div class="modal-full-text">
                    ${detailHTML}
                </div>
            </div>
        `;
    }

    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) {
        modal.style.display = "none";
        // 只有在手機選單也沒開啟的情況下才恢復滾動
        const navLinksContainer = document.querySelector('.nav-links');
        if (!navLinksContainer.classList.contains('active')) {
            document.body.style.overflow = "auto"; 
        }
        
        const modalTitle = document.getElementById("modal-title");
        const modalBody = document.getElementById("modal-body");
        if (modalTitle) modalTitle.innerText = "";
        if (modalBody) modalBody.innerHTML = "";
    }
}

/* --- 全域事件監聽 --- */
window.onclick = function(event) {
    const modal = document.getElementById("detail-modal");
    if (event.target == modal) {
        closeModal();
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
        closeMobileMenu();
    }
});
document.addEventListener('click', function(e){
    if(e.target && e.target.classList.contains('close-btn')){
        closeModal();
    }
});