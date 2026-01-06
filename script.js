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
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
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
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(50px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
    });
});