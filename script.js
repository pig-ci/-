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
    window.scrollTo({ top: 0, behavior: 'instant' });
}
document.addEventListener("DOMContentLoaded", () => {
    // 設定觀察門檻：當元素進入視窗 10% 時觸發，底端留 50px 緩衝
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 貼上 Class，讓 CSS 處理 GPU 加速動畫
                entry.target.classList.add('is-visible');
                // 停止監聽以節省性能
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 獲取所有時間軸項目並啟動監聽
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));
});

/**
 * 彈窗控制功能
 */
function openModal(element) {
    const modal = document.getElementById("detail-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    // 1. 取得標題與隱藏內容
    const title = element.querySelector("h2") ? element.querySelector("h2").innerText : "";
    const detailHTML = element.querySelector(".full-text") ? element.querySelector(".full-text").innerHTML : "<p>內容準備中...</p>";

    // 2. 寫入彈窗
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

    // 3. 顯示彈窗並鎖定背景滾動
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // 恢復背景滾動
        
        // 清空內容避免殘留
        const modalTitle = document.getElementById("modal-title");
        const modalBody = document.getElementById("modal-body");
        if (modalTitle) modalTitle.innerText = "";
        if (modalBody) modalBody.innerHTML = "";
    }
}
window.onclick = function(event) {
    const modal = document.getElementById("detail-modal");
    if (event.target == modal) {
        closeModal();
    }
};
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
document.addEventListener('click', function(e){
    if(e.target && e.target.classList.contains('close-btn')){
        closeModal();
    }
});