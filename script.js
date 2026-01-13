function switchPage(pageName) {
    // 1. 切換區塊：只針對變動的部分操作，減少排版重算
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        const isActive = section.id === `page-${pageName}`;
        section.classList.toggle('active-section', isActive);
    });

    // 2. 切換導覽標籤：精確匹配而不是使用 includes
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // 建議在 HTML 中加上 data-page="exchange" 屬性會比解析 onclick 字串更快
        const isTarget = link.getAttribute('onclick').includes(pageName);
        link.classList.toggle('active', isTarget);
    });

    // 3. 滾動優化：改用 'instant' 避免滑動中的動畫衝突
    window.scrollTo({ top: 0, behavior: 'instant' });
}
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions={root:null,rootMargin:'0px',threshold:0.05};
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // 動畫只執行一次
            }});},observerOptions);
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item=>{
        item.style.opacity = "0";
        item.style.transform = "translateY(50px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
    });});
function openModal(element) {
    const modal = document.getElementById("detail-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    // 1. 取得標題
    const title = element.querySelector("h2").innerText;
    
    // 2. 取得隱藏的詳細文字 HTML
    const detailHTML = element.querySelector(".full-text") ? element.querySelector(".full-text").innerHTML : "<p>內容準備中...</p>";

    // 3. 設定彈窗內容
    // 注意：這裡手動加上 class="modal-full-text"，避免用到原本 index.html 裡隱藏的 .full-text class
    modalTitle.innerText = title;
    modalBody.innerHTML = `
        <div class="content-wrapper">
            <div class="modal-full-text">
                ${detailHTML}
            </div>
        </div>
    `;

    // 4. 顯示彈窗並鎖定背景捲動
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}
function closeModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
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
}
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
window.onclick = function(event) {
    const modal = document.getElementById("detail-modal");
    if (event.target == modal) {
        closeModal();
    }
}
document.addEventListener('click', function(e){
    if(e.target && e.target.classList.contains('close-btn')){
        closeModal();
    }
});