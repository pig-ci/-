function switchPage(pageName) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    const targetSection = document.getElementById(`page-${pageName}`);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(pageName)) {
            link.classList.add('active');
        }
    });
    window.scrollTo(0, 0);
}
document.addEventListener("DOMContentLoaded", () => {
    
    const observerOptions={root:null,rootMargin:'0px',threshold:0.2};
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

    const title = element.querySelector("h2").innerText;
    // 取得該區塊內所有的文字內容（包含原本隱藏的詳細文字）
    const detailText = element.querySelector(".full-text") ? element.querySelector(".full-text").innerHTML : "內容準備中...";
    const thoughts = element.querySelector(".thoughts") ? element.querySelector(".thoughts").innerHTML : "";

    modalTitle.innerText = title;
    modalBody.innerHTML = `
        <div class="content-wrapper">
            ${detailText}
            ${thoughts ? `<div style="margin-top:40px; padding:20px; background:#eee; border-radius:15px; font-style:italic;">${thoughts}</div>` : ''}
        </div>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // 鎖定背景捲動
}

function closeModal() {
    const modal = document.getElementById("detail-modal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 恢復背景捲動
}

// 點擊事件監聽
window.onclick = function(event) {
    const modal = document.getElementById("detail-modal");
    if (event.target == modal) {
        closeModal();
    }
}

// 綁定關閉按鈕（針對之後動態產生的 close-btn）
document.addEventListener('click', function(e){
    if(e.target && e.target.classList.contains('close-btn')){
        closeModal();
    }
});