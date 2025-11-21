// 生成本地图片路径的函数
// 为每个图片编号生成所有可能的路径（不同扩展名）
function getLocalImagePaths(serviceName, imageNumber) {
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    return extensions.map(ext => `images/${serviceName}/${serviceName}_${imageNumber}.${ext}`);
}

// 生成图片数组（支持多个图片）
// 为每个图片生成多个可能的路径（不同扩展名），加载时会自动选择第一个存在的
function generateImageArray(serviceName, count = 10) {
    const images = [];
    for (let i = 1; i <= count; i++) {
        // 为每个图片添加所有可能的扩展名路径
        const paths = getLocalImagePaths(serviceName, i);
        images.push(...paths);
    }
    return images;
}

// 检查并过滤图片，每个编号只保留第一个存在的图片
function filterValidImages(imagePaths, serviceName, maxNumber) {
    const foundImages = new Map(); // 使用Map来跟踪每个编号是否已找到图片
    const validImages = [];
    let checkedCount = 0;
    const totalPaths = imagePaths.length;
    
    return new Promise((resolve) => {
        imagePaths.forEach((imagePath, index) => {
            // 从路径中提取图片编号
            const match = imagePath.match(new RegExp(`${serviceName}_(\\d+)\\.`));
            if (!match) {
                checkedCount++;
                if (checkedCount === totalPaths) resolve(validImages);
                return;
            }
            
            const imageNumber = parseInt(match[1]);
            
            // 如果这个编号已经找到图片，跳过
            if (foundImages.has(imageNumber)) {
                checkedCount++;
                if (checkedCount === totalPaths) resolve(validImages);
                return;
            }
            
            const img = new Image();
            
            img.onload = function() {
                // 图片加载成功
                if (!foundImages.has(imageNumber)) {
                    foundImages.set(imageNumber, true);
                    validImages.push(imagePath);
                }
                checkedCount++;
                if (checkedCount === totalPaths) {
                    // 按编号排序
                    validImages.sort((a, b) => {
                        const numA = parseInt(a.match(new RegExp(`${serviceName}_(\\d+)\\.`))[1]);
                        const numB = parseInt(b.match(new RegExp(`${serviceName}_(\\d+)\\.`))[1]);
                        return numA - numB;
                    });
                    resolve(validImages);
                }
            };
            
            img.onerror = function() {
                // 图片加载失败，继续检查下一个
                checkedCount++;
                if (checkedCount === totalPaths) {
                    validImages.sort((a, b) => {
                        const numA = parseInt(a.match(new RegExp(`${serviceName}_(\\d+)\\.`))[1]);
                        const numB = parseInt(b.match(new RegExp(`${serviceName}_(\\d+)\\.`))[1]);
                        return numA - numB;
                    });
                    resolve(validImages);
                }
            };
            
            img.src = imagePath;
        });
        
        // 如果没有图片路径，立即返回
        if (totalPaths === 0) {
            resolve([]);
        }
    });
}

// 服务详情页面脚本
const serviceData = {
    homestay: {
        ja: {
            title: '民宿',
            subtitle: '快適な宿泊体験を提供',
            description: '当社の民宿サービスは、お客様に快適で思い出に残る宿泊体験を提供します。厳選された宿泊施設で、地元の文化と伝統を体験できます。',
            features: [
                '厳選された高品質な宿泊施設',
                '地元の文化体験プログラム',
                '24時間サポート体制',
                '多言語対応サービス'
            ],
            images: generateImageArray('homestay', 10) // 生成 homestay_1 到 homestay_10 的路径
        },
        zh: {
            title: '民宿',
            subtitle: '提供舒适的住宿体验',
            description: '我们的民宿服务为客户提供舒适且难忘的住宿体验。在精心挑选的住宿设施中，您可以体验当地的文化和传统。',
            features: [
                '精选高品质住宿设施',
                '当地文化体验项目',
                '24小时支持服务',
                '多语言服务'
            ],
            images: generateImageArray('homestay', 10) // 生成 homestay_1 到 homestay_10 的路径
        },
        en: {
            title: 'Homestay',
            subtitle: 'Comfortable accommodation experiences',
            description: 'Our homestay service provides guests with comfortable and memorable accommodation experiences. In carefully selected facilities, you can experience local culture and traditions.',
            features: [
                'Carefully selected high-quality accommodations',
                'Local cultural experience programs',
                '24/7 support system',
                'Multilingual service'
            ],
            images: generateImageArray('homestay', 10) // 生成 homestay_1 到 homestay_10 的路径
        }
    },
    visa: {
        ja: {
            title: 'ビザ申請',
            subtitle: 'ビザ申請サポートサービス',
            description: 'ビザ申請の複雑な手続きをサポートします。経験豊富なスタッフが、お客様のビザ申請をスムーズに進めるお手伝いをいたします。',
            features: [
                '各種ビザ申請サポート',
                '書類準備のサポート',
                '申請プロセスの案内',
                '専門家による相談サービス'
            ],
            images: [
                'https://via.placeholder.com/800x600/9b59b6/ffffff?text=Visa+1',
                'https://via.placeholder.com/800x600/16a085/ffffff?text=Visa+2',
                'https://via.placeholder.com/800x600/d35400/ffffff?text=Visa+3'
            ]
        },
        zh: {
            title: '签证申请',
            subtitle: '签证申请支持服务',
            description: '我们支持复杂的签证申请流程。经验丰富的员工将帮助您顺利推进签证申请。',
            features: [
                '各类签证申请支持',
                '文件准备支持',
                '申请流程指导',
                '专家咨询服务'
            ],
            images: [
                'https://via.placeholder.com/800x600/9b59b6/ffffff?text=Visa+1',
                'https://via.placeholder.com/800x600/16a085/ffffff?text=Visa+2',
                'https://via.placeholder.com/800x600/d35400/ffffff?text=Visa+3'
            ]
        },
        en: {
            title: 'Visa Application',
            subtitle: 'Visa application support services',
            description: 'We support the complex visa application process. Experienced staff will help you proceed smoothly with your visa application.',
            features: [
                'Support for various visa applications',
                'Document preparation support',
                'Application process guidance',
                'Expert consultation services'
            ],
            images: [
                'https://via.placeholder.com/800x600/9b59b6/ffffff?text=Visa+1',
                'https://via.placeholder.com/800x600/16a085/ffffff?text=Visa+2',
                'https://via.placeholder.com/800x600/d35400/ffffff?text=Visa+3'
            ]
        }
    },
    charter: {
        ja: {
            title: '観光チャーター',
            subtitle: '観光チャーターサービス',
            description: '快適で安全な観光チャーターサービスを提供します。専用車両で、お客様のご希望に合わせた観光プランをご提案いたします。',
            features: [
                '専用車両による快適な移動',
                'カスタマイズ可能な観光プラン',
                '経験豊富なドライバー',
                '多言語ガイドサービス'
            ],
            images: [
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Charter+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=Charter+2',
                'https://via.placeholder.com/800x600/c0392b/ffffff?text=Charter+3',
                'https://via.placeholder.com/800x600/d68910/ffffff?text=Charter+4',
                'https://via.placeholder.com/800x600/8e44ad/ffffff?text=Charter+5'
            ]
        },
        zh: {
            title: '旅游包车',
            subtitle: '观光包车服务',
            description: '我们提供舒适安全的观光包车服务。使用专用车辆，根据您的需求提供定制化的观光计划。',
            features: [
                '专用车辆舒适出行',
                '可定制的观光计划',
                '经验丰富的司机',
                '多语言导游服务'
            ],
            images: [
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Charter+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=Charter+2',
                'https://via.placeholder.com/800x600/c0392b/ffffff?text=Charter+3',
                'https://via.placeholder.com/800x600/d68910/ffffff?text=Charter+4',
                'https://via.placeholder.com/800x600/8e44ad/ffffff?text=Charter+5'
            ]
        },
        en: {
            title: 'Tour Charter',
            subtitle: 'Sightseeing charter services',
            description: 'We provide comfortable and safe sightseeing charter services. With dedicated vehicles, we offer customized tour plans according to your needs.',
            features: [
                'Comfortable travel with dedicated vehicles',
                'Customizable tour plans',
                'Experienced drivers',
                'Multilingual guide services'
            ],
            images: [
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Charter+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=Charter+2',
                'https://via.placeholder.com/800x600/c0392b/ffffff?text=Charter+3',
                'https://via.placeholder.com/800x600/d68910/ffffff?text=Charter+4',
                'https://via.placeholder.com/800x600/8e44ad/ffffff?text=Charter+5'
            ]
        }
    },
    it: {
        ja: {
            title: 'IT開発',
            subtitle: 'IT開発・システム構築',
            description: '最新の技術を活用したIT開発サービスを提供します。ウェブアプリケーション、モバイルアプリ、システム構築など、お客様のニーズに応じたソリューションを提供いたします。',
            features: [
                'ウェブアプリケーション開発',
                'モバイルアプリ開発',
                'システム構築・保守',
                'クラウドサービス導入'
            ],
            images: [
                'https://via.placeholder.com/800x600/2980b9/ffffff?text=IT+Development+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=IT+Development+2',
                'https://via.placeholder.com/800x600/e67e22/ffffff?text=IT+Development+3'
            ]
        },
        zh: {
            title: 'IT开发',
            subtitle: 'IT开发与系统构建',
            description: '我们提供利用最新技术的IT开发服务。根据客户需求提供Web应用程序、移动应用、系统构建等解决方案。',
            features: [
                'Web应用程序开发',
                '移动应用开发',
                '系统构建与维护',
                '云服务导入'
            ],
            images: [
                'https://via.placeholder.com/800x600/2980b9/ffffff?text=IT+Development+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=IT+Development+2',
                'https://via.placeholder.com/800x600/e67e22/ffffff?text=IT+Development+3'
            ]
        },
        en: {
            title: 'IT Development',
            subtitle: 'IT development and system construction',
            description: 'We provide IT development services utilizing the latest technology. We offer solutions such as web applications, mobile apps, and system construction according to your needs.',
            features: [
                'Web application development',
                'Mobile app development',
                'System construction and maintenance',
                'Cloud service implementation'
            ],
            images: [
                'https://via.placeholder.com/800x600/2980b9/ffffff?text=IT+Development+1',
                'https://via.placeholder.com/800x600/27ae60/ffffff?text=IT+Development+2',
                'https://via.placeholder.com/800x600/e67e22/ffffff?text=IT+Development+3'
            ]
        }
    },
    realestate: {
        ja: {
            title: '不動産仲介',
            subtitle: '不動産仲介サービス',
            description: '不動産の売買、賃貸、投資に関する専門的なサポートを提供します。お客様のニーズに最適な不動産物件をご提案いたします。',
            features: [
                '不動産売買仲介',
                '賃貸物件の紹介',
                '不動産投資コンサルティング',
                '法的サポートサービス'
            ],
            images: [
                'https://via.placeholder.com/800x600/95a5a6/ffffff?text=Real+Estate+1',
                'https://via.placeholder.com/800x600/7f8c8d/ffffff?text=Real+Estate+2',
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Real+Estate+3',
                'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Real+Estate+4'
            ]
        },
        zh: {
            title: '不动产中介',
            subtitle: '不动产中介服务',
            description: '我们提供房地产买卖、租赁、投资方面的专业支持。根据客户需求推荐最适合的房地产项目。',
            features: [
                '房地产买卖中介',
                '租赁房源介绍',
                '房地产投资咨询',
                '法律支持服务'
            ],
            images: [
                'https://via.placeholder.com/800x600/95a5a6/ffffff?text=Real+Estate+1',
                'https://via.placeholder.com/800x600/7f8c8d/ffffff?text=Real+Estate+2',
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Real+Estate+3',
                'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Real+Estate+4'
            ]
        },
        en: {
            title: 'Real Estate',
            subtitle: 'Real estate brokerage services',
            description: 'We provide professional support for real estate sales, rentals, and investments. We recommend the most suitable real estate properties according to your needs.',
            features: [
                'Real estate sales brokerage',
                'Rental property introductions',
                'Real estate investment consulting',
                'Legal support services'
            ],
            images: [
                'https://via.placeholder.com/800x600/95a5a6/ffffff?text=Real+Estate+1',
                'https://via.placeholder.com/800x600/7f8c8d/ffffff?text=Real+Estate+2',
                'https://via.placeholder.com/800x600/34495e/ffffff?text=Real+Estate+3',
                'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Real+Estate+4'
            ]
        }
    }
};

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 当前图片索引
let currentImageIndex = 0;
let currentImages = [];

// 加载服务详情
function loadServiceDetail() {
    const serviceType = getUrlParameter('service');
    
    if (!serviceType || !serviceData[serviceType]) {
        // 如果没有有效的服务类型，重定向到首页
        window.location.href = 'index.html';
        return;
    }

    // 获取当前语言，优先使用全局currentLang，否则从localStorage获取，最后使用默认值'ja'
    const lang = (typeof currentLang !== 'undefined' && currentLang) 
        ? currentLang 
        : (localStorage.getItem('preferredLanguage') || 'ja');
    const data = serviceData[serviceType][lang];

    // 更新页面内容
    document.getElementById('service-title').textContent = data.title;
    document.getElementById('service-subtitle').textContent = data.subtitle;
    document.getElementById('service-description-text').textContent = data.description;
    document.getElementById('service-breadcrumb').textContent = data.title;

    // 更新特征列表
    const featuresList = document.getElementById('service-features-list');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // 加载图片
    currentImages = data.images;
    loadGallery(currentImages);
}

// 加载图片画廊（只显示实际存在的图片）
async function loadGallery(images) {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">画像を読み込み中...</p>';
    
    // 从图片路径中提取服务名称
    const serviceNameMatch = images[0] ? images[0].match(/images\/([^\/]+)\//) : null;
    const serviceName = serviceNameMatch ? serviceNameMatch[1] : 'homestay';
    
    // 过滤出实际存在的图片（每个编号只保留第一个存在的）
    const validImages = await filterValidImages(images, serviceName, 10);
    
    // 渲染画廊
    renderGallery(validImages);
}

// 渲染图片画廊
function renderGallery(validImages) {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '';
    
    if (validImages.length === 0) {
        galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">画像がありません</p>';
        return;
    }
    
    // 更新当前图片数组（只包含有效的图片）
    currentImages = validImages;
    
    validImages.forEach((imageUrl, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = () => openImageModal(index);

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Gallery image ${index + 1}`;
        img.loading = 'lazy';

        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
    });
}

// 打开图片模态框
function openImageModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('image-modal');
    if (modal) {
        updateModalImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 初始化图片模态框事件
function initImageModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
    
    // 左右箭头键切换图片
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeImage(1);
            }
        }
    });
}

// 更新模态框图片
function updateModalImage() {
    const modalImage = document.getElementById('modal-image');
    if (modalImage && currentImages.length > 0) {
        modalImage.src = currentImages[currentImageIndex];
    }
}

// 切换图片
function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = currentImages.length - 1;
    } else if (currentImageIndex >= currentImages.length) {
        currentImageIndex = 0;
    }
    updateModalImage();
}

// 关闭图片模态框
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 更新语言时重新加载内容
const originalChangeLanguage = window.changeLanguage;
window.changeLanguage = function(lang) {
    if (originalChangeLanguage) {
        originalChangeLanguage(lang);
    }
    loadServiceDetail();
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化模态框
    initImageModal();
    
    // 等待translations.js加载
    setTimeout(() => {
        loadServiceDetail();
    }, 100);
});

