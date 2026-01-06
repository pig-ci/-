// 頁面切換功能
function switchPage(pageName) {
    // 1. 隱藏所有頁面區塊
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });

    // 2. 顯示目標頁面
    const targetSection = document.getElementById(`page-${pageName}`);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }

    // 3. 更新導覽列的 Active 狀態
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // 簡單判斷：如果 onclick 屬性包含頁面名稱，設為 active
        if (link.getAttribute('onclick').includes(pageName)) {
            link.classList.add('active');
        }
    });

    // 切換後回到頂部
    window.scrollTo(0, 0);
}

// 進階功能：時間軸滾動動畫 (Intersection Observer)
document.addEventListener("DOMContentLoaded", () => {
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 元素出現 20% 時觸發
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // 動畫只執行一次
            }
        });
    }, observerOptions);

    // 選取所有時間軸項目
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        // 初始化樣式 (先隱藏並往下移)
        item.style.opacity = "0";
        item.style.transform = "translateY(50px)";
        item.style.transition = "all 0.6s ease-out";
        
        // 開始觀察
        observer.observe(item);
    });
});