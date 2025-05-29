// 专注时钟应用 - 移动版 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
    updateStatusBarTime();
});

// 更新状态栏时间
function updateStatusBarTime() {
    const timeElement = document.querySelector('.status-bar .time');
    
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    // 立即更新一次
    updateTime();
    
    // 每分钟更新一次
    setInterval(updateTime, 60000);
}

function initApp() {
    // 初始化页面导航
    initNavigation();
    
    // 初始化主页应用网格
    initAppGrid();
    
    // 初始化计时器
    initTimer();
    
    // 初始化任务交互
    initTaskInteractions();
    
    // 更新欢迎信息
    updateWelcomeMessage();
    
    // 添加触摸反馈
    addTouchFeedback();
}

// 底部导航功能
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        'home': document.querySelector('.home-page'),
        'timer': document.querySelector('.timer-page'),
        'tasks': document.querySelector('.tasks-page'),
        'stats': document.querySelector('.stats-page'),
        'settings': document.querySelector('.settings-page')
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标页面
            const targetPage = this.getAttribute('data-page');
            
            // 切换页面
            switchPage(targetPage);
            
            // 添加触觉反馈
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    });
    
    // 页面切换函数
    function switchPage(pageId) {
        // 更新导航项状态
        navItems.forEach(nav => {
            if (nav.getAttribute('data-page') === pageId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
        
        // 更新页面显示
        Object.keys(pages).forEach(key => {
            if (key === pageId) {
                pages[key].style.display = '';
            } else {
                pages[key].style.display = 'none';
            }
        });
    }
}

// 主页应用网格功能
function initAppGrid() {
    const appItems = document.querySelectorAll('.app-item');
    
    appItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标页面
            const targetPage = this.getAttribute('data-page');
            
            // 找到对应的导航项并触发点击
            const navItem = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
            if (navItem) {
                navItem.click();
            }
        });
    });
    
    // 当前专注卡片的播放按钮
    const focusPlayBtn = document.querySelector('.current-focus .control-btn');
    if (focusPlayBtn) {
        focusPlayBtn.addEventListener('click', function() {
            // 切换到计时器页面
            const timerNavItem = document.querySelector('.nav-item[data-page="timer"]');
            if (timerNavItem) {
                timerNavItem.click();
            }
            
            // 启动计时器
            const timerStartBtn = document.querySelector('.timer-page .timer-btn.primary');
            if (timerStartBtn) {
                setTimeout(() => {
                    timerStartBtn.click();
                }, 300);
            }
        });
    }
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
        duration: 25 * 60, // 秒
        remaining: 25 * 60,
        isRunning: false,
        interval: null
    };
    
    // 更新计时器显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timerState.remaining / 60);
        const seconds = timerState.remaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新进度环
        const progress = (timerState.duration - timerState.remaining) / timerState.duration;
        const circumference = 2 * Math.PI * 45;
        timerProgressFill.style.strokeDashoffset = circumference * (1 - progress);
    }
    
    // 设置计时器模式
    function setTimerMode(mode) {
        timerState.mode = mode;
        
        switch (mode) {
            case 'focus':
                timerState.duration = 25 * 60;
                break;
            case 'shortBreak':
                timerState.duration = 5 * 60;
                break;
            case 'longBreak':
                timerState.duration = 15 * 60;
                break;
        }
        
        timerState.remaining = timerState.duration;
        updateTimerDisplay();
        
        // 重置进度环
        const circumference = 2 * Math.PI * 45;
        timerProgressFill.style.strokeDasharray = circumference;
        timerProgressFill.style.strokeDashoffset = circumference;
    }
    
    // 启动计时器
    function startTimer() {
        if (timerState.isRunning) return;
        
        timerState.isRunning = true;
        startButton.innerHTML = '<i class="fas fa-pause"></i>';
        
        timerState.interval = setInterval(() => {
            timerState.remaining--;
            
            if (timerState.remaining <= 0) {
                clearInterval(timerState.interval);
                timerState.isRunning = false;
                startButton.innerHTML = '<i class="fas fa-play"></i>';
                
                // 播放提示音
                playNotificationSound();
                
                // 显示通知
                showNotification();
                
                // 自动切换到下一个模式，按照专注->短休息->长休息的顺序循环
                if (timerState.mode === 'focus') {
                    // 切换到短休息
                    timerTabs[1].click();
                } else if (timerState.mode === 'shortBreak') {
                    // 切换到长休息
                    timerTabs[2].click();
                } else {
                    // 长休息结束后切换回专注
                    timerTabs[0].click();
                }
            }
            
            updateTimerDisplay();
        }, 1000);
    }
    
    // 暂停计时器
    function pauseTimer() {
        if (!timerState.isRunning) return;
        
        clearInterval(timerState.interval);
        timerState.isRunning = false;
        startButton.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // 重置计时器
    function resetTimer() {
        pauseTimer();
        timerState.remaining = timerState.duration;
        updateTimerDisplay();
        
        // 重置进度环
        const circumference = 2 * Math.PI * 45;
        timerProgressFill.style.strokeDashoffset = circumference;
    }
    
    // 播放提示音
    function playNotificationSound() {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.5;
        
        oscillator.start();
        
        // 0.3秒后停止
        setTimeout(() => {
            oscillator.stop();
        }, 300);
    }
    
    // 显示通知
    function showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const title = timerState.mode === 'focus' ? '专注结束！' : '休息结束！';
            const body = timerState.mode === 'focus' ? '是时候休息一下了' : '准备开始新的专注';
            
            new Notification(title, {
                body: body,
                icon: '/favicon.ico'
            });
        }
    }
    
    // 初始化计时器
    setTimerMode('focus');
    
    // 绑定计时器标签切换事件
    timerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的活动状态
            timerTabs.forEach(t => t.classList.remove('active'));
            
            // 为当前点击的标签添加活动状态
            this.classList.add('active');
            
            // 根据标签文本设置计时器模式
            const tabText = this.textContent.trim();
            if (tabText === '专注') {
                setTimerMode('focus');
            } else if (tabText === '短休息') {
                setTimerMode('shortBreak');
            } else if (tabText === '长休息') {
                setTimerMode('longBreak');
            }
        });
    });
    
    // 绑定开始/暂停按钮事件
    startButton.addEventListener('click', function() {
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    // 绑定重置按钮事件
    resetButton.addEventListener('click', resetTimer);
    
    // 绑定跳过按钮事件
    skipButton.addEventListener('click', function() {
        resetTimer();
        
        // 按照专注->短休息->长休息的顺序循环
        if (timerState.mode === 'focus') {
            timerTabs[1].click(); // 切换到短休息
        } else if (timerState.mode === 'shortBreak') {
            timerTabs[2].click(); // 切换到长休息
        } else {
            timerTabs[0].click(); // 切换回专注模式
        }
    });

    
    // 请求通知权限
    document.addEventListener('click', function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            document.removeEventListener('click', requestNotificationPermission);
            Notification.requestPermission();
        }
    }, { once: true });
}

// 任务交互功能
function initTaskInteractions() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            const taskItem = this.closest('.task-item');
            
            // 切换完成状态
            this.classList.toggle('checked');
            
            if (this.classList.contains('checked')) {
                // 标记为已完成
                taskItem.classList.add('completed');
                
                // 添加完成图标
                this.innerHTML = '<i class="fas fa-check"></i>';
                
                // 添加触觉反馈
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate([50, 50, 50]);
                }
            } else {
                // 标记为未完成
                taskItem.classList.remove('completed');
                this.innerHTML = '';
            }
        });
    });
    
    // 任务过滤按钮
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 为当前点击的按钮添加活动状态
            this.classList.add('active');
            
            // 这里可以添加过滤逻辑
        });
    });
    
    // 任务选择
    const taskOptions = document.querySelectorAll('.task-option');
    taskOptions.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有选项的活动状态
            taskOptions.forEach(opt => opt.classList.remove('active'));
            
            // 为当前点击的选项添加活动状态
            this.classList.add('active');
        });
    });
}

// 更新欢迎信息
function updateWelcomeMessage() {
    const welcomeHeading = document.querySelector('.welcome-section h1');
    const welcomeText = document.querySelector('.welcome-section p');
    
    if (welcomeHeading && welcomeText) {
        const now = new Date();
        const hours = now.getHours();
        const year = now.getFullYear();
        
        // 设置年份
        welcomeHeading.textContent = year.toString();
        
        // 根据时间设置问候语
        let greeting = '';
        if (hours >= 5 && hours < 12) {
            greeting = '早上好';
        } else if (hours >= 12 && hours < 18) {
            greeting = '下午好';
        } else {
            greeting = '晚上好';
        }
        
        // 获取用户名，这里使用默认值
        const username = '用户';
        
        welcomeText.textContent = `${greeting}，${username}`;
    }
}

// 添加触摸反馈
function addTouchFeedback() {
    const buttons = document.querySelectorAll('button, .btn-icon, .nav-item, .task-item, .task-checkbox, .app-item');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
        
        button.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });
    });
}

// 在modern.html中添加切换到移动版的链接
function addMobileLinkToDesktop() {
    // 这个函数会在桌面版的modern.html中执行，为其添加切换到移动版的链接
    if (document.querySelector('.top-actions') && !document.querySelector('.switch-version')) {
        const topActions = document.querySelector('.top-actions');
        const switchLink = document.createElement('a');
        switchLink.href = 'mobile.html';
        switchLink.className = 'switch-version';
        switchLink.innerHTML = '<i class="fas fa-mobile-alt"></i>';
        switchLink.title = '切换到移动版';
        topActions.insertBefore(switchLink, topActions.firstChild);
    }
}

// 检测是否为移动设备
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// 根据设备类型自动重定向
function autoRedirect() {
    const currentPage = window.location.pathname.split('/').pop();
    const isMobile = isMobileDevice();
    
    if (isMobile && currentPage === 'modern.html') {
        window.location.href = 'mobile.html';
    } else if (!isMobile && currentPage === 'mobile.html') {
        window.location.href = 'modern.html';
    }
}

// 页面加载完成后执行自动重定向
document.addEventListener('DOMContentLoaded', function() {
    // 暂时注释掉自动重定向，让用户可以手动切换
    // autoRedirect();
});