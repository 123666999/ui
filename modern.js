// 现代风格番茄工作法应用 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

function initApp() {
    // 初始化导航菜单
    initNavigation();
    
    // 初始化计时器
    initTimer();
    
    // 初始化任务交互
    initTaskInteractions();
    
    // 初始化图表交互
    initChartInteractions();
    
    // 更新欢迎信息
    updateWelcomeMessage();
}

// 导航菜单功能
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航项的活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 为当前点击的导航项添加活动状态
            this.classList.add('active');
            
            // 这里可以添加页面切换逻辑
            // 例如：showPage(this.getAttribute('data-page'));
        });
    });
}

// 计时器功能
function initTimer() {
    const timerTabs = document.querySelectorAll('.timer-tab');
    const timerDisplay = document.querySelector('.timer-display');
    const startButton = document.querySelector('.timer-btn.primary');
    const resetButton = document.querySelector('.timer-btn.secondary:first-child');
    const skipButton = document.querySelector('.timer-btn.secondary:last-child');
    const timerProgressFill = document.querySelector('.timer-progress-fill');
    
    // 计时器状态
    let timerState = {
        mode: 'focus', // focus, shortBreak, longBreak
        duration: 25 * 60, // 默认25分钟（以秒为单位）
        remaining: 25 * 60,
        isRunning: false,
        interval: null
    };
    
    // 设置不同模式的持续时间（以秒为单位）
    const durations = {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
    };
    
    // 添加SVG渐变定义
    const svg = document.querySelector('.timer-progress');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#818cf8');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#4f46e5');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
    
    // 切换计时器模式
    timerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的活动状态
            timerTabs.forEach(t => t.classList.remove('active'));
            
            // 为当前点击的标签添加活动状态
            this.classList.add('active');
            
            // 根据标签文本设置模式
            const tabText = this.textContent.trim();
            if (tabText === '专注') {
                timerState.mode = 'focus';
            } else if (tabText === '短休息') {
                timerState.mode = 'shortBreak';
            } else if (tabText === '长休息') {
                timerState.mode = 'longBreak';
            }
            
            // 重置计时器
            resetTimer();
        });
    });
    
    // 开始/暂停计时器
    startButton.addEventListener('click', function() {
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    // 重置计时器
    resetButton.addEventListener('click', resetTimer);
    
    // 跳过当前计时
    skipButton.addEventListener('click', function() {
        resetTimer();
        // 这里可以添加切换到下一个模式的逻辑
    });
    
    // 开始计时器
    function startTimer() {
        if (!timerState.isRunning) {
            timerState.isRunning = true;
            startButton.innerHTML = '<i class="fas fa-pause"></i>';
            
            timerState.interval = setInterval(function() {
                if (timerState.remaining > 0) {
                    timerState.remaining--;
                    updateTimerDisplay();
                    updateTimerProgress();
                } else {
                    // 计时结束
                    clearInterval(timerState.interval);
                    timerState.isRunning = false;
                    startButton.innerHTML = '<i class="fas fa-play"></i>';
                    
                    // 播放提示音
                    playNotificationSound();
                    
                    // 这里可以添加自动切换到下一个模式的逻辑
                }
            }, 1000);
        }
    }
    
    // 暂停计时器
    function pauseTimer() {
        if (timerState.isRunning) {
            clearInterval(timerState.interval);
            timerState.isRunning = false;
            startButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // 重置计时器
    function resetTimer() {
        // 停止当前计时
        if (timerState.isRunning) {
            clearInterval(timerState.interval);
            timerState.isRunning = false;
            startButton.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // 重置剩余时间
        timerState.duration = durations[timerState.mode];
        timerState.remaining = timerState.duration;
        
        // 更新显示
        updateTimerDisplay();
        updateTimerProgress();
    }
    
    // 更新计时器显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timerState.remaining / 60);
        const seconds = timerState.remaining % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 更新计时器进度
    function updateTimerProgress() {
        const progress = timerState.remaining / timerState.duration;
        const circumference = 2 * Math.PI * 45; // 圆的周长 (2πr)
        const offset = circumference * (1 - progress);
        
        timerProgressFill.style.strokeDasharray = `${circumference}`;
        timerProgressFill.style.strokeDashoffset = `${offset}`;
    }
    
    // 播放提示音
    function playNotificationSound() {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建振荡器
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 设置音量
        gainNode.gain.value = 0.1;
        
        // 设置频率（声音的音调）
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        // 开始播放
        oscillator.start();
        
        // 0.3秒后停止
        setTimeout(function() {
            oscillator.stop();
        }, 300);
    }
    
    // 初始化计时器显示
    resetTimer();
}

// 任务交互功能
function initTaskInteractions() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const taskItem = this.closest('.task-item');
            
            // 切换任务完成状态
            if (this.classList.contains('checked')) {
                this.classList.remove('checked');
                taskItem.classList.remove('completed');
            } else {
                this.classList.add('checked');
                taskItem.classList.add('completed');
                
                // 添加完成样式
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.backgroundColor = 'var(--primary-color)';
                this.style.borderColor = 'var(--primary-color)';
                this.style.color = 'white';
                
                // 为任务标题添加删除线
                const taskTitle = taskItem.querySelector('.task-title');
                taskTitle.style.textDecoration = 'line-through';
                taskTitle.style.color = 'var(--text-light)';
            }
        });
    });
}

// 图表交互功能
function initChartInteractions() {
    const periodButtons = document.querySelectorAll('.period-btn');
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // 切换图表周期
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // 为当前点击的按钮添加活动状态
            this.classList.add('active');
            
            // 这里可以添加切换不同周期数据的逻辑
            // 例如：loadChartData(this.textContent.trim());
            
            // 模拟数据变化的动画效果
            animateChartBars();
        });
    });
    
    // 为图表条添加悬停效果
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.querySelector('.bar-tooltip').style.opacity = '1';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.querySelector('.bar-tooltip').style.opacity = '0';
        });
    });
    
    // 模拟图表数据变化的动画
    function animateChartBars() {
        chartBars.forEach(bar => {
            // 生成随机高度（20% - 90%）
            const randomHeight = Math.floor(Math.random() * 70) + 20 + '%';
            const randomHours = (Math.random() * 4 + 0.5).toFixed(1);
            
            // 应用动画
            bar.style.transition = 'height 0.5s ease-in-out';
            bar.style.height = randomHeight;
            
            // 更新提示文本
            bar.querySelector('.bar-tooltip').textContent = `${randomHours}小时`;
        });
    }
}

// 更新欢迎信息
function updateWelcomeMessage() {
    const welcomeHeading = document.querySelector('.welcome-section h1');
    const welcomeDate = document.querySelector('.welcome-section p');
    
    // 获取当前时间
    const now = new Date();
    const hours = now.getHours();
    
    // 根据时间设置问候语
    let greeting;
    if (hours >= 5 && hours < 12) {
        greeting = '早上好';
    } else if (hours >= 12 && hours < 18) {
        greeting = '下午好';
    } else {
        greeting = '晚上好';
    }
    
    // 更新问候语
    welcomeHeading.textContent = `${greeting}，用户名`;
    
    // 获取星期几
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[now.getDay()];
    
    // 获取日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 更新日期显示
    welcomeDate.textContent = `今天是星期${weekday}，${year}年${month}月${day}日`;
}

// 主题切换功能（暗色/亮色模式）
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // 保存用户偏好
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // 更新主题图标
    const themeIcon = document.querySelector('.btn-icon:nth-child(2) i');
    if (isDarkMode) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// 初始化主题设置
function initThemeSettings() {
    const themeButton = document.querySelector('.btn-icon:nth-child(2)');
    const themeIcon = themeButton.querySelector('i');
    
    // 检查用户之前的偏好
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    }
    
    // 添加主题切换事件
    themeButton.addEventListener('click', toggleDarkMode);
}

// 页面加载完成后初始化主题设置
document.addEventListener('DOMContentLoaded', function() {
    initThemeSettings();
});