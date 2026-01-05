document.addEventListener('DOMContentLoaded', () => {
    const clickArea = document.body;
    const container = document.getElementById('sticker-container');
    const flashOverlay = document.getElementById('flash-overlay');
    
    // 获取音频和文字元素
    const bgm = document.getElementById('bgm');
    const sfxMagic = document.getElementById('sfx-magic');
    const messageBox = document.getElementById('message-box');

    // 按钮相关
    const coffeeBtn = document.getElementById('coffee-btn');
    const qrModal = document.getElementById('qr-modal');
    const closeModal = document.querySelector('.close-modal');

    // 【新增】获取爱心气泡元素
    const loveBubble = document.getElementById('love-bubble');
    
    // --- 在这里配置你想对她说的话 ---
    const loveMessage = "2026.01.05 我们都爱吃比格披萨🍕"; 

    const characters = [
        'images/chiikawa.png',
        'images/hachiware.png',
        'images/usagi.png'
    ];

    const spacing = 45; 
    const points = [
        // L
        {x: -6, y: -2}, {x: -6, y: -1}, {x: -6, y: 0}, {x: -6, y: 1}, {x: -6, y: 2}, {x: -5, y: 2}, {x: -4, y: 2},
        // J
        {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: -1, y: 1.3},
        // N
        {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0}, {x: 3, y: -1}, {x: 3, y: -2}, {x: 3.8, y: -1}, {x: 4.6, y: 0}, {x: 5.4, y: 1}, {x: 6.2, y: -2}, {x: 6.2, y: -1}, {x: 6.2, y: 0}, {x: 6.2, y: 1}, {x: 6.2, y: 2}
    ];
    // --- 【新增】2. I❤U 坐标点 (尽量凑齐28个点以便一一对应) ---
    const pointsLove = [
        // I (5个) - 左侧竖线
        {x: -6, y: -2}, {x: -6, y: -1}, {x: -6, y: 0}, {x: -6, y: 1}, {x: -6, y: 2},
        
        // ❤ (14个) - 中间心形
        // 左半边心
        {x: -2, y: -1}, {x: -3, y: -2}, {x: -1, y: -2}, {x: -3.5, y: -0.5}, {x: -3, y: 0.5}, {x: -2, y: 1.5},
        // 中间凹陷和尖尖
        {x: 0, y: -1}, {x: 0, y: 3}, 
        // 右半边心
        {x: 2, y: -1}, {x: 3, y: -2}, {x: 1, y: -2}, {x: 3.5, y: -0.5}, {x: 3, y: 0.5}, {x: 2, y: 1.5},

        // U (9个) - 右侧U形
        {x: 5, y: -2}, {x: 5, y: -1}, {x: 5, y: 0}, {x: 5, y: 1}, // 左竖
        {x: 5.5, y: 2}, {x: 6.5, y: 2}, // 底部横
        {x: 7, y: 1}, {x: 7, y: 0}, {x: 7, y: -1}, {x: 7, y: -2} // 右竖
    ];
    
    let isAnimating = false;
    let hasPlayed = false; // 保证只触发一次，避免乱套

    // --- 1. 响应式参数设置 ---
    function getLayoutConfig() {
        const width = window.innerWidth;
        if (width < 768) {
            // 手机端配置
            return {
                spacing: 24,       // 间距大幅缩小 (45 -> 24)
                offset: 15         // 图片中心偏移量 (30px的一半)
            };
        } else {
            // 电脑端配置
            return {
                spacing: 45,       // 原本的间距
                offset: 25         // 原本的偏移量 (50px的一半)
            };
        }
    }

    clickArea.addEventListener('click', (e) => {
        // 如果点击的是按钮或者弹窗，不触发动画
        if (e.target.closest('#coffee-btn') || e.target.closest('.modal-content') || e.target.closest('.close-modal')) return;

        if (isAnimating || hasPlayed) return;
        isAnimating = true;
        hasPlayed = true; // 锁定，让这个流程只走一次，更有仪式感

        // 1. 播放音乐 (浏览器要求必须由用户交互触发)
        bgm.volume = 0.5; // 音量 50%
        bgm.play().catch(e => console.log("浏览器限制自动播放，需交互"));
        if(sfxMagic) sfxMagic.play();

        // 2. 隐藏原本的提示文字
        messageBox.style.opacity = 0;

        // 3. 闪光特效
        flashOverlay.classList.add('is-flashing');

        setTimeout(() => {
            startChiikawaRain(pointsLJN);
        }, 1000); 
    });

    function startChiikawaRain(targetPoints) {
        container.innerHTML = '';
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const shuffledPoints = [...targetPoints].sort(() => Math.random() - 0.5);        
        let maxDuration = 0; // 记录最慢的那个小可爱飞多久

        // 获取当前的布局配置
        const config = getLayoutConfig();


        shuffledPoints.forEach((point, index) => {
            const img = document.createElement('img');
            img.src = characters[Math.floor(Math.random() * characters.length)];
            img.className = 'sticker';

            const randomStartX = Math.random() * window.innerWidth * 0.8 + (window.innerWidth * 0.1); 
            const randomStartY = -100 - Math.random() * 500; 
            const startRotate = Math.random() * 360;

            img.style.left = randomStartX + 'px';
            img.style.top = randomStartY + 'px';
            img.style.transform = `rotate(${startRotate}deg) scale(0.5)`;

            container.appendChild(img);

            const flightDuration = 1.2 + Math.random(); 
            // 找出最晚完成动画的时间点
            const totalTime = 50 + index * 30 + flightDuration * 1000;
            if (totalTime > maxDuration) maxDuration = totalTime;

            setTimeout(() => {
                const targetX = centerX + point.x * spacing - 25;
                const targetY = centerY + point.y * spacing - 25;
                const endRotate = (Math.random() * 20) - 10; 

                img.style.left = targetX + 'px';
                img.style.top = targetY + 'px';
                img.style.transform = `rotate(${endRotate}deg) scale(1)`;
                img.style.transition = `all ${flightDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;

                setTimeout(() => {
                    img.classList.add('swaying');
                    const randomDelay = Math.random() * 1; 
                    img.style.animationDelay = `-${randomDelay}s`;
                }, (flightDuration * 1000) + 1200); 

            }, 50 + index * 30); 
        });

        // --- 4. 伟大时刻：所有动画结束后，开始打字机效果 ---
        setTimeout(() => {
            typeWriterEffect(loveMessage);
        }, maxDuration + 1500); 
    }

    function typeWriterEffect(text) {
        messageBox.style.opacity = 1; // 显示容器
        messageBox.innerText = ""; // 清空
        messageBox.style.color = "#d66d75"; // 换个深情的颜色
        messageBox.style.fontFamily = "'Courier New', cursive"; // 打字机字体
        
        let i = 0;
        const speed = 150; // 打字速度 (越小越快)

        function type() {
            if (i < text.length) {
                messageBox.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // --- 文字打完啦！ ---
                
                // 1. 稍微等一下 (0.5秒)
                setTimeout(() => {
                    // 2. 显示大按钮
                    coffeeBtn.classList.add('show');
                    // 3. 开始按钮的上下漂浮动画
                    coffeeBtn.classList.add('anim-floating');

                    // 【新增】显示“爱心气泡”
                    loveBubble.classList.add('show');
                }, 500);
            }
        }
        type();
    }
});
// --- 【新增】爱心气泡点击事件：变换阵型 ---
loveBubble.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发其他点击
        
        // 1. 播放魔法音效增加仪式感
        if(sfxMagic) {
            sfxMagic.currentTime = 0; // 从头播放
            sfxMagic.play();
        }
        
        // 2. 隐藏气泡自己 (任务完成)
        loveBubble.classList.remove('show');

        // 3. 执行变换动画
        transformStickersTo(pointsLove);
});

// --- 【新增】变换阵型函数 ---
function transformStickersTo(newPoints) {
        // 获取当前屏幕上所有已经存在的小可爱
        const existingStickers = document.querySelectorAll('.sticker');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 遍历每一个小可爱，给它们分配新的位置
        existingStickers.forEach((sticker, index) => {
            // 如果新的点阵数量比现有小可爱少，多余的就不动了(或者可以隐藏)
            if (index >= newPoints.length) return; 
            
            const point = newPoints[index];
            const targetX = centerX + point.x * spacing - 25;
            const targetY = centerY + point.y * spacing - 25;
            
            // 重新设置过渡时间和效果，让变换看起来顺滑
            // 稍微加一点随机延迟，让它们不是同时起步，更生动
            const delay = Math.random() * 0.5;
            sticker.style.transition = `all 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${delay}s`;
            
            // 设置新位置
            sticker.style.left = targetX + 'px';
            sticker.style.top = targetY + 'px';
            
            // 变换时稍微旋转一下，增加动感
            const newRotate = (Math.random() * 40) - 20;
            // 注意：要保留 swaying 类名，这样它们到达新位置后还会继续摇摆
            sticker.style.transform = `rotate(${newRotate}deg) scale(1)`;
        });
}

function createFloatingHearts() {

    const particlesContainer = document.getElementById('background-particles');
    const particleCount = 40; // 屏幕上同时存在的心心数量，越多越密集

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            generateOneHeart(particlesContainer);
        }, i * 300); // 错开生成时间，不要一股脑全出来
    }
}

function generateOneHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';

    // 随机位置 (水平 0% - 100%)
    heart.style.left = Math.random() * 100 + 'vw';
    
    // 随机大小 (0.5倍 到 1.5倍)
    const scale = 0.5 + Math.random();
    heart.style.transform += ` scale(${scale})`;

    // 随机漂浮速度 (10秒 到 25秒之间，越慢越梦幻)
    const duration = 10 + Math.random() * 15;
    heart.style.animationDuration = `${duration}s`;
    
    // 随机旋转终点，让飘动更自然
    const randomRotation = 45 + (Math.random() * 360);
    heart.style.setProperty('--rotation', `${randomRotation}deg`);

    container.appendChild(heart);

    // 动画结束后删除这个元素，并生成一个新的，维持数量平衡
    setTimeout(() => {
        heart.remove();
        generateOneHeart(container);
    }, duration * 1000);
}

// 网页加载完成后立即启动
createFloatingHearts();

/* =========================================
   新增JS：鼠标移动星光特效
========================================= */
document.addEventListener('mousemove', function(e) {
    // 为了性能，限制一下生成频率，比如每隔几次移动才生成一个
    if (Math.random() > 0.3) return; // 70%的概率跳过，调节疏密

    const sparkle = document.createElement('div');
    sparkle.className = 'mouse-sparkle';
    
    // 设置在鼠标当前位置
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';

    // 随机一点点颜色差异 (浅金到浅粉)
    const colors = ['#FFD700', '#ffb6c1', '#ffffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.backgroundColor = randomColor;
    sparkle.style.boxShadow = `0 0 10px ${randomColor}`;

    document.body.appendChild(sparkle);

    // 动画结束后移除
    setTimeout(() => {
        sparkle.remove();
    }, 800); // 和 CSS 里的动画时间一致
});



/* =========================================
   新增JS：打赏弹窗交互控制
========================================= */

// 获取元素
const coffeeBtn = document.getElementById('coffee-btn');
const qrModal = document.getElementById('qr-modal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.querySelector('.modal-content');

// 1. 打开弹窗
coffeeBtn.addEventListener('click', (e) => {
    // 阻止冒泡，防止触发背景的点击事件（如果有的话）
    e.stopPropagation(); 
    qrModal.classList.add('active');
});

// 2. 关闭弹窗的函数
function closePopup() {
    qrModal.classList.remove('active');
}

// 3. 监听关闭按钮点击
closeModal.addEventListener('click', closePopup);

// 4. 监听点击遮罩层背景关闭
// 当用户点击黑色半透明背景时，也要关闭弹窗，体验更好
qrModal.addEventListener('click', (e) => {
    // 核心判断：只有点击的是 overlay 本身，而不是里面的 content 时才关闭
    if (e.target === qrModal) {
        closePopup();
    }
});

// (可选) 监听 ESC 键关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal.classList.contains('active')) {
        closePopup();
    }

});

