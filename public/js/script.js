// 滚动动画
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 为需要动画的元素添加观察
document.querySelectorAll('.service-card, .project-card').forEach(card => {
    observer.observe(card);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // 向下滚动
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // 向上滚动
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// 表单提交处理已移除 - 现在使用Google Forms链接

// 添加鼠标移动视差效果
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        
        hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    }
});

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 添加服务卡片悬停效果
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// 添加项目卡片悬停效果
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// 动态文字效果
let dynamicTextInterval = null;
let dynamicTextElements = null;

function createDynamicText() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    // 如果已经存在，先移除
    const existingDynamic = heroContent.querySelector('.dynamic-text');
    const existingDynamicMobile = heroContent.querySelector('.dynamic-text-mobile');
    if (existingDynamic) existingDynamic.remove();
    if (existingDynamicMobile) existingDynamicMobile.remove();
    
    // 清除之前的定时器
    if (dynamicTextInterval) {
        clearInterval(dynamicTextInterval);
    }
    
    // 创建PC版本的动态文字
    const dynamicText = document.createElement('div');
    dynamicText.className = 'dynamic-text';
    const textSpan = document.createElement('span');
    dynamicText.appendChild(textSpan);
    
    // 创建移动端版本的动态文字
    const dynamicTextMobile = document.createElement('div');
    dynamicTextMobile.className = 'dynamic-text-mobile';
    const textSpanMobile = document.createElement('span');
    dynamicTextMobile.appendChild(textSpanMobile);
    
    // 添加到页面
    heroContent.appendChild(dynamicText);
    heroContent.appendChild(dynamicTextMobile);
    
    // 保存元素引用
    dynamicTextElements = {
        textSpan: textSpan,
        textSpanMobile: textSpanMobile
    };

    let currentIndex = 0;

    function getTexts() {
        // 确保 translations 和 currentLang 已定义
        if (typeof translations === 'undefined' || typeof currentLang === 'undefined') {
            return ['未来を創造する']; // 默认文本
        }
        return translations[currentLang] && translations[currentLang]['hero.dynamic'] 
            ? translations[currentLang]['hero.dynamic'] 
            : ['未来を創造する'];
    }

    function updateText() {
        const texts = getTexts();
        if (texts && texts.length > 0) {
            textSpan.textContent = texts[currentIndex];
            textSpanMobile.textContent = texts[currentIndex];
            currentIndex = (currentIndex + 1) % texts.length;
        }
    }

    // 初始显示
    updateText();

    // 每3秒更新一次文字
    dynamicTextInterval = setInterval(updateText, 3000);
}

// 更新动态文本的语言
function updateDynamicTextLanguage() {
    if (dynamicTextElements) {
        const texts = typeof translations !== 'undefined' && typeof currentLang !== 'undefined'
            ? (translations[currentLang] && translations[currentLang]['hero.dynamic'] 
                ? translations[currentLang]['hero.dynamic'] 
                : ['未来を創造する'])
            : ['未来を創造する'];
        
        if (texts && texts.length > 0) {
            dynamicTextElements.textSpan.textContent = texts[0];
            dynamicTextElements.textSpanMobile.textContent = texts[0];
        }
    }
}

// 在页面加载时初始化动态文字
document.addEventListener('DOMContentLoaded', () => {
    // 延迟一下确保 translations.js 已加载
    setTimeout(() => {
        createDynamicText();
    }, 100);
});

// 重写 changeLanguage 函数以更新动态文本
if (typeof changeLanguage !== 'undefined') {
    const originalChangeLanguage = changeLanguage;
    window.changeLanguage = function(lang) {
        originalChangeLanguage(lang);
        updateDynamicTextLanguage();
    };
} 