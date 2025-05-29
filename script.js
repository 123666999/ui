document.addEventListener('DOMContentLoaded', function() {
    // 页面切换功能
    const tabs = document.querySelectorAll('.tab');
    const pages = document.querySelectorAll('.page');
    
    // 设置当前活动页面
    function setActivePage(pageId) {
        // 更新标签状态
        tabs.forEach(tab => {
            if (tab.getAttribute('data-page') === pageId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 显示目标页面
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });
        
        // 保存当前活动页面到本地存储，确保刷新后仍然保持状态
        localStorage.setItem('activePage', pageId);
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPageId = this.getAttribute('data-page');
            setActivePage(targetPageId);
        });
    });
    
    // 页面加载时恢复上次活动的页面
    const savedActivePage = localStorage.getItem('activePage');
    if (savedActivePage) {
        setActivePage(savedActivePage);
    }

    
    // 计时器功能
    let timerInterval;
    let timeLeft = 25 * 60; // 默认25分钟
    let isRunning = false;
    let currentMode = 'work'; // 'work', 'shortBreak', 'longBreak'
    
    const timerDisplay = document.querySelector('.timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const skipBtn = document.getElementById('skip-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    
    // 更新计时器显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新进度环
        let totalTime;
        switch(currentMode) {
            case 'work': totalTime = 25 * 60; break;
            case 'shortBreak': totalTime = 5 * 60; break;
            case 'longBreak': totalTime = 15 * 60; break;
        }
        
        const progress = 1 - (timeLeft / totalTime);
        timerProgress.style.background = `conic-gradient(#FF6B6B ${progress * 360}deg, transparent ${progress * 360}deg)`;
    }
    
    // 开始/暂停计时器
    startBtn.addEventListener('click', function() {
        if (isRunning) {
            // 暂停计时器
            clearInterval(timerInterval);
            startBtn.innerHTML = '<i class="fas fa-play"></i>';
            isRunning = false;
        } else {
            // 开始计时器
            timerInterval = setInterval(function() {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    // 计时结束
                    clearInterval(timerInterval);
                    startBtn.innerHTML = '<i class="fas fa-play"></i>';
                    isRunning = false;
                    
                    // 播放提示音效（模拟）
                    alert('时间到！');
                    
                    // 自动切换到下一个模式
                    if (currentMode === 'work') {
                        // 完成的番茄数量+1（这里只是模拟）
                        const completedPomodoros = parseInt(document.querySelector('.stat-value').textContent);
                        document.querySelector('.stat-value').textContent = completedPomodoros + 1;
                        
                        // 切换到休息模式
                        setTimerMode('shortBreak');
                    } else {
                        // 休息结束，切换回工作模式
                        setTimerMode('work');
                    }
                }
            }, 1000);
            
            startBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isRunning = true;
        }
    });
    
    // 重置计时器
    resetBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        setTimerMode(currentMode);
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
        isRunning = false;
    });
    
    // 跳过当前计时
    skipBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        if (currentMode === 'work') {
            setTimerMode('shortBreak');
        } else {
            setTimerMode('work');
        }
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
        isRunning = false;
    });
    
    // 设置计时器模式
    function setTimerMode(mode) {
        currentMode = mode;
        
        // 更新模式按钮状态
        modeBtns.forEach((btn, index) => {
            if ((mode === 'work' && index === 0) || 
                (mode === 'shortBreak' && index === 1) || 
                (mode === 'longBreak' && index === 2)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 设置对应的时间
        switch(mode) {
            case 'work':
                timeLeft = 25 * 60;
                break;
            case 'shortBreak':
                timeLeft = 5 * 60;
                break;
            case 'longBreak':
                timeLeft = 15 * 60;
                break;
        }
        
        updateTimerDisplay();
    }
    
    // 模式按钮点击事件
    modeBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            clearInterval(timerInterval);
            if (index === 0) setTimerMode('work');
            else if (index === 1) setTimerMode('shortBreak');
            else if (index === 2) setTimerMode('longBreak');
            startBtn.innerHTML = '<i class="fas fa-play"></i>';
            isRunning = false;
        });
    });
    
    // 初始化计时器显示
    updateTimerDisplay();
    
    // 任务管理功能
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const addTaskBtn = document.querySelector('.add-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.btn.secondary');
    const saveBtn = document.querySelector('.btn.primary');
    
    // 任务复选框点击事件
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            const taskContent = this.nextElementSibling;
            taskContent.classList.toggle('completed');
            
            // 更新任务完成数量（模拟）
            if (this.classList.contains('checked')) {
                const completedTasks = parseInt(document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent);
                document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent = completedTasks + 1;
            }
        });
    });
    
    // 打开任务编辑弹窗
    addTaskBtn.addEventListener('click', function() {
        taskModal.style.display = 'flex';
    });
    
    // 关闭任务编辑弹窗
    function closeModal() {
        taskModal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 点击弹窗外部关闭弹窗
    taskModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // 保存任务（模拟）
    saveBtn.addEventListener('click', function() {
        const taskName = document.querySelector('.modal-body input[type="text"]').value;
        const pomodoroCount = document.querySelector('.modal-body input[type="number"]').value;
        
        if (taskName.trim() !== '') {
            // 创建新任务元素
            const taskList = document.querySelector('.task-list');
            const newTask = document.createElement('div');
            newTask.className = 'task-item';
            newTask.innerHTML = `
                <div class="task-checkbox"></div>
                <div class="task-content">${taskName}</div>
                <div class="task-pomodoros">0/${pomodoroCount}</div>
            `;
            
            // 添加到任务列表
            taskList.appendChild(newTask);
            
            // 为新任务添加点击事件
            const newCheckbox = newTask.querySelector('.task-checkbox');
            newCheckbox.addEventListener('click', function() {
                this.classList.toggle('checked');
                this.nextElementSibling.classList.toggle('completed');
            });
            
            closeModal();
        }
    });
    
    // 设置页面交互
    const toggles = document.querySelectorAll('.setting-toggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // 开关切换
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // 主题颜色选择
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 更改主题颜色（模拟）
            const color = window.getComputedStyle(this).backgroundColor;
            document.documentElement.style.setProperty('--theme-color', color);
            
            // 更新UI元素颜色
            const elements = document.querySelectorAll('.mode-btn.active, .control-btn.primary, .add-btn, .filter-btn.active, .stat-value, .tab.active');
            elements.forEach(el => {
                el.style.backgroundColor = color;
            });
        });
    });
});