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
    const brushPath = document.getElementById('brush-path');

    const magicLever = document.getElementById('magic-lever');
    
    // --- 在这里配置你想对她说的话 ---
    const loveMessage = "2026.01.06 今天说什么都要运动🏋️‍"; 

    const characters = [
        'images/chiikawa.png',
        'images/hachiware.png',
        'images/usagi.png'
    ];

    const spacing = 45; 
    const pointsLJN = [
        // L
        {x: -6, y: -2}, {x: -6, y: -1}, {x: -6, y: 0}, {x: -6, y: 1}, {x: -6, y: 2}, {x: -5, y: 2}, {x: -4, y: 2},
        // J
        {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: -1, y: 1.3},
        // N
        {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0}, {x: 3, y: -1}, {x: 3, y: -2}, {x: 3.8, y: -1}, {x: 4.6, y: 0}, {x: 5.4, y: 1}, {x: 6.2, y: -2}, {x: 6.2, y: -1}, {x: 6.2, y: 0}, {x: 6.2, y: 1}, {x: 6.2, y: 2}
    ];
    // --- 【新增】2. I❤U 坐标点 (尽量凑齐28个点以便一一对应) ---
    const pointsLove = [
        // I (4个) - 左侧竖线
        {x: -5.5, y: -2}, {x: -5.5, y: -0.5}, {x: -5.5, y: 1}, {x: -5.5, y: 2.5},
        
        // ❤ (14个) - 中间心形
        // 左半边心
        {x: -2, y: -2.5}, {x: -3, y: -2}, {x: -1, y: -2}, {x: -3.5, y: -0.5}, {x: -3, y: 0.5}, {x: -2, y: 1.5},
        // 中间凹陷和尖尖
        {x: 0, y: -1}, {x: 0, y: 3}, 
        // 右半边心
        {x: 2, y: -2.5}, {x: 3, y: -2}, {x: 1, y: -2}, {x: 3.5, y: -0.5}, {x: 3, y: 0.5}, {x: 2, y: 1.5},

        // U (10个) - 右侧U形
        {x: 5, y: -2}, {x: 5, y: -1}, {x: 5, y: 0}, {x: 5, y: 1}, // 左竖
        {x: 6, y: 2}, {x: 7, y: 2}, // 底部横
        {x: 8, y: 1}, {x: 8, y: 0}, {x: 8, y: -1}, {x: 8, y: -2} // 右竖
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
        if (e.target.closest('#coffee-btn') || e.target.closest('.modal-content') || e.target.closest('.close-modal') || e.target.closest('#magic-lever')) return;

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
        container.classList.remove('spinning');
        brushPath.setAttribute('d', ''); 
        brushPath.classList.remove('drawing');
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

        // 执行超级变换！
        transformStickersToMagic(pointsLove);
});

// --- 【新增】变换阵型函数 ---
function transformStickersToMagic(newPoints) {
        const stickers = document.querySelectorAll('.sticker');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = 250; // 圆圈的半径

        // 阶段 1: 全体变成一个大圆圈
        stickers.forEach((sticker, index) => {
            // 计算圆上的位置
            // 让它们均匀分布在圆周上
            const angle = (index / stickers.length) * Math.PI * 2;
            const circleX = centerX + Math.cos(angle) * radius - 25;
            const circleY = centerY + Math.sin(angle) * radius - 25;

            // 移除摇摆，准备加速
            sticker.classList.remove('swaying');
            
            // 设置移动到圆圈的动画 (0.8秒到位)
            sticker.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            sticker.style.left = circleX + 'px';
            sticker.style.top = circleY + 'px';
            // 顺便让图片自己也转一下，增加混乱感
            sticker.style.transform = `rotate(${angle * 57.3 + 90}deg) scale(1.1)`; 
        });

        // 阶段 2: 容器开始整体旋转 (制造旋风效果)
        // 稍微延迟一点点，等它们开始动了再转，视觉效果更好
        setTimeout(() => {
            // 给容器加上 'spinning' 类，触发 CSS 里的 720度旋转
            container.classList.add('spinning');
        }, 100);

        // 阶段 3: 旋转结束(1.5秒后)，瞬间变身 I❤U
        setTimeout(() => {
            // 此时 CSS 动画旋转了 720度 (正好转回原点)，所以视觉上不会跳变
            
            // 遍历所有贴图，去新的位置
            stickers.forEach((sticker, index) => {
                if (index >= newPoints.length) return;
                const point = newPoints[index];
                const targetX = centerX + point.x * spacing - 25;
                const targetY = centerY + point.y * spacing - 25;

                // 此时我们需要让它们“炸”开去新位置
                // transition 设快一点，有种“释放”的感觉
                sticker.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                
                sticker.style.left = targetX + 'px';
                sticker.style.top = targetY + 'px';
                sticker.style.transform = `rotate(0deg) scale(1)`; // 归位

                // 重新开始可爱的摇摆
                setTimeout(() => {
                    sticker.classList.add('swaying');
                }, 700); 
            });

            // 移除容器的旋转类，重置状态 (虽然已经转回0度了，但要清空 animation 以防万一)
            // 等贴图都飞走了再移除，不然会闪一下
            setTimeout(() => {
                container.classList.remove('spinning');
            }, 1000);

            // 【新增】Phase 4: 在小可爱就位后，开始画红线
            // 延迟 800ms，等它们差不多站好并开始摇摆了再画
            setTimeout(() => {
                drawConnectingLine();
                // 【新增】画完线后，显示摇杆
                setTimeout(() => {
                    magicLever.classList.add('show');
                }, 4000); // 等线画完(3.5s)再出来
            }, 800);

        }, 1600); // 1.6秒后执行 (100ms延迟 + 1.5s旋转)
}

function drawConnectingLine() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 辅助函数：将网格坐标转为屏幕像素坐标
        // 这里的 spacing (45) 需要和上面定义的 spacing 变量保持一致
        const getPos = (x, y) => {
            return `${centerX + x * 45 - 25 + 25} ${centerY + y * 45 - 25 + 25}`; 
            // 注：小可爱定位是 left/top (x*45 - 25)，那是左上角。
            // 画线我们要画在中心，所以 +25 补回来，也就是 centerX + x*45
        };
        const gp = (x, y) => `${centerX + x * 45} ${centerY + y * 45}`; // 简化版写法

        // --- 1. 定义 "I" 的笔画路径 ---
        // 从上到下画一条直线
        const pathI = `M ${gp(-5.5, -2)} L ${gp(-5.5, 2.5)}`;

        // --- 2. 定义 "❤" 的笔画路径 ---
        // 我们需要沿着心形的边缘画一圈。
        // 顺序：下尖尖 -> 左上弯 -> 中间凹陷 -> 右上弯 -> 回到下尖尖
        const pathHeart = `
            M ${gp(0, 3)} 
            L ${gp(-2, 1.5)} 
            L ${gp(-3, 0.5)} 
            L ${gp(-3.5, -0.5)} 
            L ${gp(-3, -2)}
            L ${gp(-2, -2.5)}  
            L ${gp(-1, -2)} 
            L ${gp(0, -1)} 
            L ${gp(1, -2)} 
            L ${gp(2, -2.5)} 
            L ${gp(3, -2)} 
            L ${gp(3.5, -0.5)} 
            L ${gp(3, 0.5)} 
            L ${gp(2, 1.5)} 
            L ${gp(0, 3)}
        `;

        // --- 3. 定义 "U" 的笔画路径 ---
        // 从左上 -> 下 -> 右拐 -> 上
        const pathU = `
            M ${gp(5, -2)} 
            L ${gp(5, 1)} 
            Q ${gp(5, 1)} ${gp(6, 2)}
            L ${gp(7, 2)} 
            Q ${gp(7, 2)} ${gp(8, 1)}
            L ${gp(8, -2)}
        `;

        // 将三段路径合并，用空格隔开
        // M 代表移动画笔（抬笔），L 代表画线（落笔）
        // 这样就会画完 I，抬笔去画 心，再抬笔去画 U
        const finalPath = `${pathI} ${pathHeart} ${pathU}`;

        // --- 执行绘制 ---
        brushPath.setAttribute('d', finalPath);

        const pathLength = brushPath.getTotalLength();
        brushPath.style.strokeDasharray = pathLength;
        brushPath.style.strokeDashoffset = pathLength;
        
        brushPath.getBoundingClientRect(); // 强制重绘

        // 开始动画
        brushPath.classList.add('drawing');
    }


    // === 【新增】摇杆交互逻辑 ===
    magicLever.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 1. 摇杆下拉动画
        // 如果正在拉动中，不要重复触发
        if (magicLever.classList.contains('pulled')) return;
        magicLever.classList.add('pulled');

        // 2. 播放一点小音效 (如果有的话，这里复用magic)
        if(sfxMagic) {
            sfxMagic.currentTime = 0; 
            sfxMagic.play();
        }

        // 3. 生成掉落小可爱
        spawnFallingSticker();

        // 4. 摇杆复位 (0.3秒后)
        setTimeout(() => {
            magicLever.classList.remove('pulled');
        }, 300);
    });

    function spawnFallingSticker() {
        const img = document.createElement('img');
        // 随机选一张图
        img.src = characters[Math.floor(Math.random() * characters.length)];
        img.className = 'falling-sticker';
        
        // 随机水平位置 (屏幕宽度 5% - 95%)
        const randomX = Math.random() * 90 + 5; 
        img.style.left = randomX + 'vw';
        
        // 添加到 body 直接显示
        document.body.appendChild(img);

        // 动画结束后移除元素 (2秒后)，防止页面堆积太多卡顿
        // *如果你想让它们堆在底部不消失，就把下面这行注释掉*
        // 但建议移除，不然玩一百次页面会卡
        setTimeout(() => {
           // img.remove(); // 如果你想让它们堆起来，就不要移除这一行
        }, 2000); 
    }    
});


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

