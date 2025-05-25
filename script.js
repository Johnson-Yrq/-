// 全局变量
let charts = {};
let currentTheme = 'light';
let dataUpdateInterval;
let sidebarCollapsed = false;

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 首先检查登录状态
    checkLoginStatus();
    
    initializeTheme();
    initializeTime();
    initializeSidebar();
    initializeCharts();
    initializeTabs();
    initializeDeviceGrid();
    startDataUpdates();
    setupEventListeners();
    
    // 初始化用户信息
    initializeUserInfo();
});

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!isLoggedIn || isLoggedIn !== 'true' || !currentUser) {
        // 未登录，跳转到登录页面
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// 初始化用户信息
function initializeUserInfo() {
    const currentUser = sessionStorage.getItem('currentUser');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (currentUser) {
        // 更新用户信息显示
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        
        if (userNameElement) {
            userNameElement.textContent = currentUser === 'admin' ? '管理员' : currentUser;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = '系统管理员';
        }
        
        // 添加退出登录功能
        addLogoutFunctionality();
    }
}

// 添加退出登录功能
function addLogoutFunctionality() {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        // 创建退出按钮
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = '退出登录';
        logoutBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        
        logoutBtn.addEventListener('click', logout);
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        userInfo.style.position = 'relative';
        userInfo.appendChild(logoutBtn);
    }
}

// 退出登录功能
function logout() {
    // 确认退出
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('loginTime');
        
        // 跳转到登录页面
        window.location.href = 'login.html';
    }
}

// 侧边栏功能
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    const menuItems = document.querySelectorAll('.menu-item');

    // 侧边栏折叠/展开
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        sidebarCollapsed = !sidebarCollapsed;
    });

    // 移动端菜单切换
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // 菜单项点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
            
            // 更新活动状态
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // 移动端关闭侧边栏
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// 页面切换功能
function switchSection(sectionName) {
    // 隐藏所有内容区域
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 显示目标区域
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 更新页面标题
    updatePageTitle(sectionName);
    
    // 根据页面类型初始化特定图表
    initializeSectionCharts(sectionName);
}

// 更新页面标题
function updatePageTitle(sectionName) {
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        'overview': '总览看板',
        'lab-data': '检验科数据',
        'poct-data': 'POCT检验',
        'devices': '设备管理',
        'quality': '质控分析',
        'reagents': '试剂管理',
        'alerts': '警报中心',
        'settings': '系统设置'
    };
    
    pageTitle.textContent = titles[sectionName] || '总览看板';
}

// 根据页面初始化特定图表
function initializeSectionCharts(sectionName) {
    switch(sectionName) {
        case 'lab-data':
            if (!charts.labDetail) {
                createLabDetailChart();
            }
            if (!charts.labTestDistribution) {
                createLabTestDistributionChart();
            }
            if (!charts.criticalValues) {
                createCriticalValuesChart();
            }
            if (!charts.labEfficiency) {
                createLabEfficiencyChart();
            }
            break;
        case 'poct-data':
            if (!charts.poctDetail) {
                createPOCTDetailChart();
            }
            if (!charts.poctTestTypes) {
                createPOCTTestTypesChart();
            }
            if (!charts.poctTimeAnalysis) {
                createPOCTTimeAnalysisChart();
            }
            if (!charts.poctUtilization) {
                createPOCTUtilizationChart();
            }
            if (!charts.poctPerformance) {
                createPOCTPerformanceChart();
            }
            if (!charts.poctStatus) {
                createPOCTStatusChart();
            }
            if (!charts.poctComparison) {
                createPOCTComparisonChart();
            }
            if (!charts.poctQuality) {
                createPOCTQualityChart();
            }
            if (!charts.poctEfficiency) {
                createPOCTEfficiencyChart();
            }
            break;
        case 'quality':
            if (!charts.qualityDetail) {
                createQualityDetailChart();
            }
            if (!charts.qualityDept) {
                createQualityDeptChart();
            }
            if (!charts.qualityItems) {
                createQualityItemsChart();
            }
            if (!charts.qualityIssues) {
                createQualityIssuesChart();
            }
            break;
        case 'reagents':
            if (!charts.labReagentCost) {
                createLabReagentCostChart();
            }
            if (!charts.poctReagentDist) {
                createPOCTReagentDistChart();
            }
            if (!charts.reagentTrend) {
                createReagentTrendChart();
            }
            if (!charts.reagentCostStructure) {
                createReagentCostStructureChart();
            }
            if (!charts.reagentEfficiency) {
                createReagentEfficiencyChart();
            }
            if (!charts.reagentSupplier) {
                createReagentSupplierChart();
            }
            if (!charts.inventoryWarning) {
                createInventoryWarningChart();
            }
            if (!charts.inventoryTurnover) {
                createInventoryTurnoverChart();
            }
            // 添加新的高级图表
            if (!charts.reagentHeatmap) {
                createReagentHeatmapChart();
            }
            if (!charts.reagentEfficiencyRadar) {
                createReagentEfficiencyRadarChart();
            }
            if (!charts.reagentCostForecast) {
                createReagentCostForecastChart();
            }
            break;
    }
}

// 主题切换功能
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeSwitch = document.getElementById('themeSwitch');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
    
    themeToggle.addEventListener('click', toggleTheme);
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
    updateChartsTheme();
}

function updateThemeButton() {
    const themeIcon = document.querySelector('.theme-icon');
    
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun theme-icon';
    } else {
        themeIcon.className = 'fas fa-moon theme-icon';
    }
}

// 时间显示功能
function initializeTime() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
}

// 图表初始化
function initializeCharts() {
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;
    Chart.defaults.backgroundColor = 'rgba(26, 115, 232, 0.1)';
    
    createLabDataChart();
    createPOCTChart();
    createDeviceStatusChart();
    createQCTrendChart();
    createReagentCharts();
}

// 检验科数据图表
function createLabDataChart() {
    const ctx = document.getElementById('labDataChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.labData = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '常规检验',
                data: [120, 135, 128, 145, 152, 98, 76],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '急诊检验',
                data: [45, 52, 48, 61, 68, 38, 29],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '危急值',
                data: [3, 5, 2, 4, 7, 2, 1],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// POCT图表
function createPOCTChart() {
    const ctx = document.getElementById('poctChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.poct = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['急诊科', '骨科一病区', '骨科二病区', 'ICU', '手术室', '其他科室'],
            datasets: [{
                data: [35, 28, 22, 18, 15, 12],
                backgroundColor: [
                    '#1a73e8',
                    '#4285f4',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                },
                tooltip: {
                    titleColor: textColor,
                    bodyColor: textColor,
                    backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: currentTheme === 'dark' ? '#4b5563' : '#e5e7eb',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${context.parsed}次 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 设备状态图表
function createDeviceStatusChart() {
    const ctx = document.getElementById('deviceStatusChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.deviceStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['生化分析仪', '血液分析仪', '免疫分析仪', 'POCT设备', '血气分析仪', '尿液分析仪'],
            datasets: [{
                label: '在线',
                data: [4, 3, 2, 8, 2, 3],
                backgroundColor: '#059669'
            }, {
                label: '维护中',
                data: [0, 1, 0, 1, 0, 0],
                backgroundColor: '#d97706'
            }, {
                label: '离线',
                data: [0, 0, 0, 1, 0, 1],
                backgroundColor: '#6b7280'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 质控趋势图表
function createQCTrendChart() {
    const ctx = document.getElementById('qcTrendChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.qcTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '质控达标率',
                data: generateQCData(30),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '平均达标率',
                data: Array(30).fill(95),
                borderColor: '#059669',
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 试剂用量图表
function createReagentCharts() {
    createLabReagentChart();
    createPOCTReagentChart();
}

function createLabReagentChart() {
    const ctx = document.getElementById('labReagentChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.labReagent = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['生化试剂', '免疫试剂', '血液试剂', '微生物试剂', '分子试剂'],
            datasets: [{
                label: '本月用量',
                data: [850, 620, 480, 320, 180],
                backgroundColor: '#1a73e8',
                borderRadius: 4
            }, {
                label: '上月用量',
                data: [780, 580, 460, 310, 160],
                backgroundColor: '#4285f4',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '盒';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

function createPOCTReagentChart() {
    const ctx = document.getElementById('poctReagentChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctReagent = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['血糖试纸', '血气试剂', 'CRP试剂', 'PCT试剂', 'D-二聚体试剂'],
            datasets: [{
                label: '本月用量',
                data: [1200, 380, 260, 180, 150],
                backgroundColor: '#059669',
                borderRadius: 4
            }, {
                label: '上月用量',
                data: [1150, 360, 240, 170, 140],
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '盒';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 详细页面图表
function createLabDetailChart() {
    const ctx = document.getElementById('labDetailChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.labDetail = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '生化检验',
                data: generateRandomData(30, 80, 120),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4
            }, {
                label: '免疫检验',
                data: generateRandomData(30, 60, 100),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4
            }, {
                label: '血液检验',
                data: generateRandomData(30, 40, 80),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

function createPOCTDetailChart() {
    const ctx = document.getElementById('poctDetailChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctDetail = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['急诊科', '骨科一病区', '骨科二病区', 'ICU', '手术室', '门诊', '康复科', '内分泌科'],
            datasets: [{
                label: '血糖检测',
                data: [45, 32, 28, 35, 20, 15, 12, 18],
                backgroundColor: '#1a73e8',
                borderRadius: 4
            }, {
                label: 'CRP检测',
                data: [25, 18, 15, 22, 12, 8, 6, 10],
                backgroundColor: '#059669',
                borderRadius: 4
            }, {
                label: '血气分析',
                data: [18, 8, 6, 28, 15, 3, 2, 4],
                backgroundColor: '#d97706',
                borderRadius: 4
            }, {
                label: '心肌标志物',
                data: [12, 5, 4, 15, 8, 2, 1, 3],
                backgroundColor: '#dc2626',
                borderRadius: 4
            }, {
                label: '凝血功能',
                data: [8, 4, 3, 12, 18, 1, 0, 2],
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        footer: function(tooltipItems) {
                            let sum = 0;
                            tooltipItems.forEach(function(tooltipItem) {
                                sum += tooltipItem.parsed.y;
                            });
                            return '科室总计: ' + sum + ' 次';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

function createQualityDetailChart() {
    const ctx = document.getElementById('qualityDetailChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.qualityDetail = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '生化质控',
                data: generateQCData(30),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '免疫质控',
                data: generateQCData(30),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '血液质控',
                data: generateQCData(30),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 标签页功能
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${targetTab}-content`).classList.add('active');
    
    // 根据标签页初始化对应图表
    switch(targetTab) {
        case 'reagent-analysis':
            if (!charts.reagentTrend) {
                createReagentTrendChart();
            }
            if (!charts.reagentCostStructure) {
                createReagentCostStructureChart();
            }
            if (!charts.reagentEfficiency) {
                createReagentEfficiencyChart();
            }
            if (!charts.reagentSupplier) {
                createReagentSupplierChart();
            }
            break;
        case 'reagent-inventory':
            if (!charts.inventoryWarning) {
                createInventoryWarningChart();
            }
            if (!charts.inventoryTurnover) {
                createInventoryTurnoverChart();
            }
            break;
        case 'poct-reagent':
            if (!charts.poctReagentDist) {
                createPOCTReagentDistChart();
            }
            break;
        case 'lab-reagent':
            if (!charts.labReagentCost) {
                createLabReagentCostChart();
            }
            break;
    }
}

// 设备网格初始化
function initializeDeviceGrid() {
    const deviceGrid = document.getElementById('deviceGrid');
    if (!deviceGrid) return;
    
    const devices = [
        { 
            name: '生化分析仪-01', 
            status: 'online', 
            location: '检验科', 
            type: '生化分析仪',
            workload: 85,
            uptime: 98.5,
            lastMaintenance: '2024-03-15',
            tests: 245,
            efficiency: 92
        },
        { 
            name: '生化分析仪-02', 
            status: 'online', 
            location: '检验科', 
            type: '生化分析仪',
            workload: 78,
            uptime: 97.2,
            lastMaintenance: '2024-03-12',
            tests: 198,
            efficiency: 89
        },
        { 
            name: '血液分析仪-01', 
            status: 'online', 
            location: '检验科', 
            type: '血液分析仪',
            workload: 92,
            uptime: 99.1,
            lastMaintenance: '2024-03-20',
            tests: 320,
            efficiency: 95
        },
        { 
            name: '血液分析仪-02', 
            status: 'maintenance', 
            location: '检验科', 
            type: '血液分析仪',
            workload: 0,
            uptime: 85.5,
            lastMaintenance: '2024-03-25',
            tests: 0,
            efficiency: 0
        },
        { 
            name: '免疫分析仪-01', 
            status: 'online', 
            location: '检验科', 
            type: '免疫分析仪',
            workload: 67,
            uptime: 96.8,
            lastMaintenance: '2024-03-10',
            tests: 142,
            efficiency: 88
        },
        { 
            name: 'POCT-急诊-01', 
            status: 'online', 
            location: '急诊科', 
            type: 'POCT设备',
            workload: 95,
            uptime: 99.5,
            lastMaintenance: '2024-03-22',
            tests: 68,
            efficiency: 97
        },
        { 
            name: 'POCT-急诊-02', 
            status: 'online', 
            location: '急诊科', 
            type: 'POCT设备',
            workload: 88,
            uptime: 98.2,
            lastMaintenance: '2024-03-18',
            tests: 52,
            efficiency: 94
        },
        { 
            name: 'POCT-骨科-01', 
            status: 'online', 
            location: '骨科一病区', 
            type: 'POCT设备',
            workload: 72,
            uptime: 97.5,
            lastMaintenance: '2024-03-16',
            tests: 38,
            efficiency: 90
        },
        { 
            name: 'POCT-骨科-02', 
            status: 'offline', 
            location: '骨科二病区', 
            type: 'POCT设备',
            workload: 0,
            uptime: 65.2,
            lastMaintenance: '2024-02-28',
            tests: 0,
            efficiency: 0
        },
        { 
            name: '血气分析仪-01', 
            status: 'online', 
            location: 'ICU', 
            type: '血气分析仪',
            workload: 89,
            uptime: 98.8,
            lastMaintenance: '2024-03-14',
            tests: 156,
            efficiency: 93
        },
        { 
            name: '血气分析仪-02', 
            status: 'online', 
            location: '急诊科', 
            type: '血气分析仪',
            workload: 83,
            uptime: 97.9,
            lastMaintenance: '2024-03-19',
            tests: 128,
            efficiency: 91
        },
        { 
            name: '尿液分析仪-01', 
            status: 'online', 
            location: '检验科', 
            type: '尿液分析仪',
            workload: 75,
            uptime: 96.5,
            lastMaintenance: '2024-03-11',
            tests: 89,
            efficiency: 87
        }
    ];
    
    deviceGrid.innerHTML = '';
    devices.forEach(device => {
        const deviceElement = createDeviceElement(device);
        deviceGrid.appendChild(deviceElement);
    });
}

function createDeviceElement(device) {
    const deviceDiv = document.createElement('div');
    deviceDiv.className = 'device-item';
    
    const statusText = {
        'online': '在线运行',
        'maintenance': '维护中',
        'offline': '离线'
    };
    
    const statusIcon = {
        'online': 'fas fa-check-circle',
        'maintenance': 'fas fa-tools',
        'offline': 'fas fa-times-circle'
    };
    
    deviceDiv.innerHTML = `
        <div class="device-header">
        <div class="device-name">${device.name}</div>
        <div class="device-status ${device.status}">
            <i class="${statusIcon[device.status]}"></i>
            ${statusText[device.status]}
        </div>
        </div>
        <div class="device-info">
            <div class="device-location">${device.location} - ${device.type}</div>
            <div class="device-metrics">
                <div class="metric">
                    <span class="metric-label">工作负载:</span>
                    <span class="metric-value">${device.workload}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">运行时间:</span>
                    <span class="metric-value">${device.uptime}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">今日检测:</span>
                    <span class="metric-value">${device.tests}次</span>
                </div>
                <div class="metric">
                    <span class="metric-label">效率:</span>
                    <span class="metric-value">${device.efficiency}%</span>
                </div>
            </div>
            <div class="device-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${device.workload}%"></div>
                </div>
            </div>
            <div class="device-actions">
                <button class="btn-sm" onclick="showDeviceDetails('${device.name}')">详情</button>
                <button class="btn-sm" onclick="manageDevice('${device.name}')">管理</button>
            </div>
        </div>
    `;
    
    return deviceDiv;
}

// 设备详情和管理功能
function showDeviceDetails(deviceName) {
    // 这里可以实现设备详情模态框
    console.log('显示设备详情:', deviceName);
}

function manageDevice(deviceName) {
    // 这里可以实现设备管理功能
    console.log('管理设备:', deviceName);
}

// 数据更新功能
function startDataUpdates() {
    // 定期更新数据
    dataUpdateInterval = setInterval(() => {
        updateOverviewData();
        updateAlertData();
        updateDeviceStatus();
        updateRealtimeCharts();
        updateDeviceManagement();
    }, 30000); // 每30秒更新一次
    
    // 初始更新
    updateOverviewData();
    
    // 每分钟更新一次设备状态
    setInterval(updateDeviceStatus, 60000);
    
    // 每5分钟更新设备管理数据
    setInterval(updateDeviceManagement, 300000);
}

function updateOverviewData() {
    // 模拟数据更新
    const updates = {
        totalTests: Math.floor(Math.random() * 100) + 1200,
        criticalValues: Math.floor(Math.random() * 10) + 8,
        onlineDevices: `${Math.floor(Math.random() * 3) + 20}/24`,
        lowStock: Math.floor(Math.random() * 5) + 5
    };
    
    Object.keys(updates).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = updates[key];
        }
    });
}

function updateAlertData() {
    const alertBadge = document.getElementById('alertBadge');
    const alertCount = Math.floor(Math.random() * 5) + 1;
    if (alertBadge) {
        alertBadge.textContent = alertCount;
    }
}

// 事件监听器设置
function setupEventListeners() {
    // 刷新设备按钮
    const refreshBtn = document.getElementById('refreshDevices');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            initializeDeviceGrid();
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }
    
    // 时间段选择器
    const selectors = [
        'labDataPeriod', 'poctDataPeriod', 'qcAnalysisPeriod',
        'labDetailPeriod', 'poctDetailPeriod', 'qualityDetailPeriod'
    ];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            selector.addEventListener('change', function() {
                updateChartData(selectorId, this.value);
            });
        }
    });
    
    // 设置页面的刷新间隔
    const refreshInterval = document.getElementById('refreshInterval');
    if (refreshInterval) {
        refreshInterval.addEventListener('change', function() {
            const interval = parseInt(this.value) * 1000;
            clearInterval(dataUpdateInterval);
            dataUpdateInterval = setInterval(() => {
                updateOverviewData();
                updateAlertData();
            }, interval);
        });
    }
}

// 图表主题更新
function updateChartsTheme() {
    const textColor = currentTheme === 'dark' ? '#f1f5f9' : '#111827';
    const gridColor = currentTheme === 'dark' ? '#374151' : '#e5e7eb';
    
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            // 更新轴颜色
            if (chart.options.scales) {
                if (chart.options.scales.x && chart.options.scales.x.grid) {
                    chart.options.scales.x.grid.color = gridColor;
                }
                if (chart.options.scales.y && chart.options.scales.y.grid) {
                    chart.options.scales.y.grid.color = gridColor;
                }
                if (chart.options.scales.x && chart.options.scales.x.ticks) {
                    chart.options.scales.x.ticks.color = textColor;
                }
                if (chart.options.scales.y && chart.options.scales.y.ticks) {
                    chart.options.scales.y.ticks.color = textColor;
                }
            }
            
            // 更新图例颜色
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            // 更新工具提示颜色
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.titleColor = textColor;
                chart.options.plugins.tooltip.bodyColor = textColor;
                chart.options.plugins.tooltip.backgroundColor = currentTheme === 'dark' ? '#374151' : '#ffffff';
                chart.options.plugins.tooltip.borderColor = currentTheme === 'dark' ? '#4b5563' : '#e5e7eb';
            }
            
            // 更新环形图的边框颜色
            if (chart.data && chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                    if (dataset.borderColor && Array.isArray(dataset.backgroundColor)) {
                        dataset.borderColor = currentTheme === 'dark' ? '#1e293b' : '#ffffff';
                    }
                });
            }
            
            chart.update();
        }
    });
}

// 图表数据更新函数
function updateChartData(selectorId, period) {
    switch(selectorId) {
        case 'labDataPeriod':
            updateLabDataChart(period);
            break;
        case 'poctDataPeriod':
            updatePOCTChart(period);
            break;
        case 'qcAnalysisPeriod':
            updateQCTrendChart(period);
            break;
        case 'labDetailPeriod':
            updateLabDetailChart(period);
            break;
        case 'poctDetailPeriod':
            updatePOCTDetailChart(period);
            break;
        case 'qualityDetailPeriod':
            updateQualityDetailChart(period);
            break;
    }
}

function updateLabDataChart(period) {
    if (!charts.labData) return;
    
    const data = generateLabData(period);
    charts.labData.data.labels = data.labels;
    charts.labData.data.datasets.forEach((dataset, index) => {
        dataset.data = data.datasets[index];
    });
    charts.labData.update();
}

function updatePOCTChart(period) {
    if (!charts.poct) return;
    
    const data = generatePOCTData(period);
    charts.poct.data.datasets[0].data = data;
    charts.poct.update();
}

function updateQCTrendChart(period) {
    if (!charts.qcTrend) return;
    
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const data = generateQCData(days);
    const labels = generateDateLabels(days);
    
    charts.qcTrend.data.labels = labels;
    charts.qcTrend.data.datasets[0].data = data;
    charts.qcTrend.data.datasets[1].data = Array(days).fill(95);
    charts.qcTrend.update();
}

function updateLabDetailChart(period) {
    if (!charts.labDetail) return;
    
    const days = period === 'today' ? 24 : period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const labels = generateDateLabels(days);
    
    charts.labDetail.data.labels = labels;
    charts.labDetail.data.datasets.forEach(dataset => {
        dataset.data = generateRandomData(days, 40, 120);
    });
    charts.labDetail.update();
}

function updatePOCTDetailChart(period) {
    if (!charts.poctDetail) return;
    
    charts.poctDetail.data.datasets.forEach(dataset => {
        dataset.data = generateRandomData(6, 5, 50);
    });
    charts.poctDetail.update();
}

function updateQualityDetailChart(period) {
    if (!charts.qualityDetail) return;
    
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const labels = generateDateLabels(days);
    
    charts.qualityDetail.data.labels = labels;
    charts.qualityDetail.data.datasets.forEach(dataset => {
        dataset.data = generateQCData(days);
    });
    charts.qualityDetail.update();
}

// 数据生成辅助函数
function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
}

function generateQCData(days) {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push(Math.random() * 8 + 92); // 92-100% 之间的随机数
    }
    return data;
}

function generateRandomData(length, min, max) {
    const data = [];
    for (let i = 0; i < length; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

function generateLabData(period) {
    const days = period === 'today' ? 24 : period === 'week' ? 7 : 30;
    const labels = period === 'today' ? 
        Array.from({length: 24}, (_, i) => `${i}:00`) :
        period === 'week' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] :
        generateDateLabels(30);
    
    return {
        labels: labels,
        datasets: [
            generateRandomData(days, 80, 150),
            generateRandomData(days, 30, 70),
            generateRandomData(days, 1, 8)
        ]
    };
}

function generatePOCTData(period) {
    return [
        Math.floor(Math.random() * 20) + 25,
        Math.floor(Math.random() * 15) + 20,
        Math.floor(Math.random() * 15) + 15,
        Math.floor(Math.random() * 10) + 15,
        Math.floor(Math.random() * 10) + 10,
        Math.floor(Math.random() * 8) + 8
    ];
}

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (dataUpdateInterval) {
        clearInterval(dataUpdateInterval);
    }
});

// 响应式处理
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
    }
});

// 检验项目分布图表
function createLabTestDistributionChart() {
    const ctx = document.getElementById('labTestDistributionChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.labTestDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['生化检验', '免疫检验', '血液检验', '微生物检验', '分子检验'],
            datasets: [{
                data: [45, 25, 18, 8, 4],
                backgroundColor: [
                    '#1a73e8',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                }
            }
        }
    });
}

// 危急值趋势图表
function createCriticalValuesChart() {
    const ctx = document.getElementById('criticalValuesChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.criticalValues = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '危急值数量',
                data: generateRandomData(30, 2, 12),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '处理时长(分钟)',
                data: generateRandomData(30, 5, 25),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 检验效率图表
function createLabEfficiencyChart() {
    const ctx = document.getElementById('labEfficiencyChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.labEfficiency = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '样本处理量',
                data: [320, 285, 298, 315, 342, 198, 156],
                backgroundColor: '#1a73e8',
                yAxisID: 'y'
            }, {
                label: '平均处理时间(分钟)',
                data: [25, 28, 22, 24, 20, 30, 35],
                backgroundColor: '#059669',
                type: 'line',
                borderColor: '#059669',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 各科室质控对比图表
function createQualityDeptChart() {
    const ctx = document.getElementById('qualityDeptChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.qualityDept = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['检验科', '急诊科', '骨科一病区', '骨科二病区', 'ICU', '手术室'],
            datasets: [{
                label: '质控达标率',
                data: [96.8, 94.2, 95.5, 93.8, 97.2, 95.0],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                pointBackgroundColor: '#1a73e8',
                pointBorderColor: '#1a73e8',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#1a73e8'
            }, {
                label: '目标达标率',
                data: [95, 95, 95, 95, 95, 95],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.05)',
                pointBackgroundColor: '#059669',
                pointBorderColor: '#059669',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#059669'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    min: 85,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 质控项目分布图表
function createQualityItemsChart() {
    const ctx = document.getElementById('qualityItemsChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.qualityItems = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['生化质控', '免疫质控', '血液质控', '微生物质控', '血气质控'],
            datasets: [{
                label: '在控项目',
                data: [18, 12, 8, 4, 6],
                backgroundColor: '#059669'
            }, {
                label: '警告项目',
                data: [2, 1, 1, 0, 0],
                backgroundColor: '#d97706'
            }, {
                label: '失控项目',
                data: [0, 1, 0, 1, 0],
                backgroundColor: '#dc2626'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 失控原因分析图表
function createQualityIssuesChart() {
    const ctx = document.getElementById('qualityIssuesChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.qualityIssues = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['试剂质量', '设备故障', '操作错误', '环境因素', '标准品问题'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#dc2626',
                    '#d97706',
                    '#1a73e8',
                    '#059669',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                }
            }
        }
    });
}

// POCT检测项目分布图表
function createPOCTTestTypesChart() {
    const ctx = document.getElementById('poctTestTypesChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.poctTestTypes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['血糖检测', 'CRP检测', '血气分析', '心肌标志物', '凝血功能', 'D-二聚体', '肌钙蛋白', '其他检测'],
            datasets: [{
                data: [180, 120, 85, 65, 45, 38, 28, 35],
                backgroundColor: [
                    '#1a73e8',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#8b5cf6',
                    '#06b6d4',
                    '#ec4899',
                    '#6b7280'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${context.parsed}次 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 增强的POCT使用时段分析图表
function createPOCTTimeAnalysisChart() {
    const ctx = document.getElementById('poctTimeAnalysisChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctTimeAnalysis = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [{
                label: '急诊科',
                data: [8, 6, 4, 12, 28, 45, 38, 52, 48, 35, 25, 18],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'ICU',
                data: [15, 12, 10, 18, 22, 28, 25, 32, 28, 24, 20, 16],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: '骨科病区',
                data: [2, 1, 1, 5, 15, 25, 20, 28, 22, 18, 12, 8],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: '手术室',
                data: [5, 3, 2, 8, 18, 22, 15, 25, 20, 15, 10, 7],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// POCT设备利用率图表
function createPOCTUtilizationChart() {
    const ctx = document.getElementById('poctUtilizationChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctUtilization = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['急诊科', '骨科一病区', '骨科二病区', 'ICU', '手术室', '门诊'],
            datasets: [{
                label: '设备利用率',
                data: [85, 72, 68, 92, 76, 45],
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    if (value >= 80) return '#059669';
                    else if (value >= 60) return '#d97706';
                    else return '#dc2626';
                },
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 检验科试剂成本分析图表
function createLabReagentCostChart() {
    const ctx = document.getElementById('labReagentCostChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.labReagentCost = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '日均成本',
                data: generateRandomData(30, 8000, 12000),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '预算基线',
                data: Array(30).fill(10000),
                borderColor: '#059669',
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '¥' + (value / 1000).toFixed(1) + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// POCT试剂科室分布图表
function createPOCTReagentDistChart() {
    const ctx = document.getElementById('poctReagentDistChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctReagentDist = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['急诊科', '骨科一病区', '骨科二病区', 'ICU', '手术室', '门诊'],
            datasets: [{
                label: '试剂用量',
                data: [90, 65, 55, 85, 45, 30],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                pointBackgroundColor: '#1a73e8',
                pointBorderColor: '#1a73e8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 试剂用量趋势分析图表
function createReagentTrendChart() {
    const ctx = document.getElementById('reagentTrendChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.reagentTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '生化试剂 (盒)',
                data: generateReagentTrendData(30, 25, 35),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: '免疫试剂 (盒)',
                data: generateReagentTrendData(30, 18, 28),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'POCT试剂 (盒)',
                data: generateReagentTrendData(30, 35, 50),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: '总成本 (万元)',
                data: generateCostTrendData(30, 8, 15),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                type: 'bar',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '万';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 试剂成本结构分析图表
function createReagentCostStructureChart() {
    const ctx = document.getElementById('reagentCostStructureChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.reagentCostStructure = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['生化试剂', '免疫试剂', '血液试剂', 'POCT试剂', '其他试剂'],
            datasets: [{
                data: [35, 28, 20, 12, 5],
                backgroundColor: [
                    '#1a73e8',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                }
            }
        }
    });
}

// 试剂效率分析图表
function createReagentEfficiencyChart() {
    const ctx = document.getElementById('reagentEfficiencyChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.reagentEfficiency = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['生化试剂', '免疫试剂', '血液试剂', 'POCT试剂'],
            datasets: [{
                label: '使用量 (盒)',
                data: [850, 620, 480, 1200],
                backgroundColor: '#1a73e8',
                yAxisID: 'y'
            }, {
                label: '单位成本 (元/盒)',
                data: [480, 650, 350, 180],
                backgroundColor: '#059669',
                type: 'line',
                borderColor: '#059669',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 试剂供应商分布图表
function createReagentSupplierChart() {
    const ctx = document.getElementById('reagentSupplierChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.reagentSupplier = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['罗氏诊断', '雅培', '贝克曼库尔特', '西门子', '迈瑞', '其他'],
            datasets: [{
                data: [28, 22, 18, 15, 12, 5],
                backgroundColor: [
                    '#1a73e8',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#8b5cf6',
                    '#6b7280'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                }
            }
        }
    });
}

// 增强的库存预警统计图表
function createInventoryWarningChart() {
    const ctx = document.getElementById('inventoryWarningChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.inventoryWarning = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['生化试剂', '免疫试剂', '血液试剂', 'POCT试剂', '尿液试剂', '血气试剂'],
            datasets: [{
                label: '正常库存',
                data: [38, 28, 25, 18, 15, 12],
                backgroundColor: '#059669',
                stack: 'stack1'
            }, {
                label: '库存不足',
                data: [5, 3, 2, 4, 2, 1],
                backgroundColor: '#d97706',
                stack: 'stack1'
            }, {
                label: '即将过期',
                data: [2, 1, 1, 1, 1, 0],
                backgroundColor: '#dc2626',
                stack: 'stack1'
            }, {
                label: '紧急采购',
                data: [1, 0, 0, 2, 0, 1],
                backgroundColor: '#8b5cf6',
                stack: 'stack1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        footer: function(tooltipItems) {
                            let total = 0;
                            tooltipItems.forEach(function(tooltipItem) {
                                const datasetIndex = tooltipItem.datasetIndex;
                                const dataIndex = tooltipItem.dataIndex;
                                const chart = tooltipItem.chart;
                                chart.data.datasets.forEach(dataset => {
                                    total += dataset.data[dataIndex];
                                });
                            });
                            return '总库存: ' + total + ' 种';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        stepSize: 5
                    }
                }
            }
        }
    });
}

// 增强的库存周转率分析图表
function createInventoryTurnoverChart() {
    const ctx = document.getElementById('inventoryTurnoverChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.inventoryTurnover = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '生化试剂',
                data: [2.1, 2.3, 2.2, 2.4, 2.3, 2.5],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: '免疫试剂',
                data: [1.8, 1.9, 1.7, 1.8, 1.9, 2.0],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'POCT试剂',
                data: [3.2, 3.5, 3.4, 3.6, 3.5, 3.7],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: '血液试剂',
                data: [2.0, 2.1, 1.9, 2.2, 2.1, 2.3],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: '目标线 (2.5次/月)',
                data: Array(6).fill(2.5),
                borderColor: '#6b7280',
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label + ' 周转率分析';
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return label + ': ' + value + ' 次/月';
                        },
                        afterBody: function(tooltipItems) {
                            const value = tooltipItems[0].parsed.y;
                            let efficiency = '';
                            if (value >= 3.0) efficiency = '(优秀)';
                            else if (value >= 2.5) efficiency = '(良好)';
                            else if (value >= 2.0) efficiency = '(一般)';
                            else efficiency = '(需改进)';
                            return '效率评级: ' + efficiency;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '次/月';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
} 

// 新增：试剂库存热力图
function createReagentHeatmapChart() {
    const ctx = document.getElementById('reagentHeatmapChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    // 模拟热力图数据
    const heatmapData = [];
    const departments = ['急诊科', '骨科一区', '骨科二区', 'ICU', '手术室', '门诊'];
    const reagents = ['血糖试纸', 'CRP试剂', '血气试剂', '心肌标志物', '凝血试剂'];
    
    departments.forEach((dept, i) => {
        reagents.forEach((reagent, j) => {
            heatmapData.push({
                x: dept,
                y: reagent,
                v: Math.floor(Math.random() * 100) + 10
            });
        });
    });
    
    // 使用散点图模拟热力图效果
    charts.reagentHeatmap = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: '试剂使用强度',
                data: heatmapData.map(item => ({
                    x: departments.indexOf(item.x),
                    y: reagents.indexOf(item.y),
                    intensity: item.v
                })),
                backgroundColor: function(context) {
                    const intensity = context.parsed.intensity;
                    const alpha = intensity / 100;
                    return `rgba(26, 115, 232, ${alpha})`;
                },
                pointRadius: 15,
                pointHoverRadius: 18
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const point = tooltipItems[0];
                            return departments[point.parsed.x] + ' - ' + reagents[point.parsed.y];
                        },
                        label: function(context) {
                            return '使用强度: ' + context.parsed.intensity + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -0.5,
                    max: departments.length - 0.5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return departments[value] || '';
                        },
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    min: -0.5,
                    max: reagents.length - 0.5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return reagents[value] || '';
                        },
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 新增：试剂效率雷达图
function createReagentEfficiencyRadarChart() {
    const ctx = document.getElementById('reagentEfficiencyRadarChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.reagentEfficiencyRadar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['成本控制', '库存周转', '质量合规', '供应稳定', '使用效率', '环保指标'],
            datasets: [{
                label: '生化试剂',
                data: [85, 78, 92, 88, 82, 76],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                pointBackgroundColor: '#1a73e8',
                pointBorderColor: '#1a73e8',
                pointRadius: 5
            }, {
                label: '免疫试剂',
                data: [78, 85, 88, 82, 90, 80],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                pointBackgroundColor: '#059669',
                pointBorderColor: '#059669',
                pointRadius: 5
            }, {
                label: 'POCT试剂',
                data: [92, 95, 85, 90, 88, 85],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                pointBackgroundColor: '#d97706',
                pointBorderColor: '#d97706',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: textColor,
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 新增：试剂成本预测图表
function createReagentCostForecastChart() {
    const ctx = document.getElementById('reagentCostForecastChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    // 生成历史数据和预测数据
    const historicalMonths = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const forecastMonths = ['7月', '8月', '9月', '10月', '11月', '12月'];
    const allMonths = [...historicalMonths, ...forecastMonths];
    
    const historicalCosts = [28.5, 30.2, 29.8, 31.5, 32.1, 30.8];
    const forecastCosts = [31.2, 32.5, 33.1, 34.2, 33.8, 35.0];
    
    charts.reagentCostForecast = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allMonths,
            datasets: [{
                label: '历史成本',
                data: [...historicalCosts, ...Array(6).fill(null)],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: '预测成本',
                data: [...Array(5).fill(null), historicalCosts[5], ...forecastCosts],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointStyle: 'triangle'
            }, {
                label: '预算上限',
                data: Array(12).fill(35),
                borderColor: '#dc2626',
                borderDash: [10, 5],
                pointRadius: 0,
                fill: false
            }, {
                label: '预算下限',
                data: Array(12).fill(25),
                borderColor: '#059669',
                borderDash: [10, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (value !== null) {
                                return label + ': ¥' + value + '万元';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 20,
                    max: 40,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '¥' + value + '万';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            },
            elements: {
                point: {
                    backgroundColor: function(context) {
                        const index = context.dataIndex;
                        return index >= 6 ? '#d97706' : '#1a73e8';
                    }
                }
            }
        }
    });
}

// 新增：POCT设备状态概览图表
function createPOCTStatusChart() {
    const ctx = document.getElementById('poctStatusChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    
    charts.poctStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['在线运行', '维护中', '故障', '离线'],
            datasets: [{
                data: [16, 1, 0, 1],
                backgroundColor: [
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#6b7280'
                ],
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${context.parsed}台 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 新增：POCT设备检测量对比图表
function createPOCTComparisonChart() {
    const ctx = document.getElementById('poctComparisonChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['急诊科-01', '急诊科-02', 'ICU-01', '骨科-01', '骨科-02', '手术室-01'],
            datasets: [{
                label: '血糖检测',
                data: [245, 198, 156, 132, 98, 67],
                backgroundColor: '#1a73e8',
                borderRadius: 4
            }, {
                label: 'CRP检测',
                data: [89, 76, 98, 45, 34, 23],
                backgroundColor: '#059669',
                borderRadius: 4
            }, {
                label: '血气分析',
                data: [67, 45, 123, 12, 8, 89],
                backgroundColor: '#d97706',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// 新增：POCT质量指标趋势图表
function createPOCTQualityChart() {
    const ctx = document.getElementById('poctQualityChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctQuality = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: '准确率 (%)',
                data: generateRandomData(30, 95, 99),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: '及时率 (%)',
                data: generateRandomData(30, 92, 98),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: '故障率 (%)',
                data: generateRandomData(30, 0.5, 3),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 10
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 85,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 5,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 新增：POCT综合效率分析图表
function createPOCTEfficiencyChart() {
    const ctx = document.getElementById('poctEfficiencyChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctEfficiency = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['设备利用率', '检测准确率', '响应速度', '成本效益', '维护效率', '用户满意度'],
            datasets: [{
                label: '急诊科POCT',
                data: [92, 98, 95, 88, 90, 94],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                pointBackgroundColor: '#1a73e8',
                pointBorderColor: '#1a73e8',
                pointRadius: 5
            }, {
                label: 'ICU POCT',
                data: [88, 97, 93, 92, 95, 96],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                pointBackgroundColor: '#dc2626',
                pointBorderColor: '#dc2626',
                pointRadius: 5
            }, {
                label: '骨科POCT',
                data: [85, 96, 89, 86, 88, 91],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                pointBackgroundColor: '#059669',
                pointBorderColor: '#059669',
                pointRadius: 5
            }, {
                label: '手术室POCT',
                data: [90, 99, 97, 89, 93, 95],
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                pointBackgroundColor: '#d97706',
                pointBorderColor: '#d97706',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    min: 70,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    },
                    ticks: {
                        color: textColor,
                        stepSize: 10,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 更新POCT部分的图表初始化
function initializeSectionCharts(sectionName) {
    switch(sectionName) {
        case 'lab-data':
            if (!charts.labDetail) {
                createLabDetailChart();
            }
            if (!charts.labTestDistribution) {
                createLabTestDistributionChart();
            }
            if (!charts.criticalValues) {
                createCriticalValuesChart();
            }
            if (!charts.labEfficiency) {
                createLabEfficiencyChart();
            }
            break;
        case 'poct-data':
            if (!charts.poctDetail) {
                createPOCTDetailChart();
            }
            if (!charts.poctTestTypes) {
                createPOCTTestTypesChart();
            }
            if (!charts.poctTimeAnalysis) {
                createPOCTTimeAnalysisChart();
            }
            if (!charts.poctUtilization) {
                createPOCTUtilizationChart();
            }
            if (!charts.poctPerformance) {
                createPOCTPerformanceChart();
            }
            if (!charts.poctStatus) {
                createPOCTStatusChart();
            }
            if (!charts.poctComparison) {
                createPOCTComparisonChart();
            }
            if (!charts.poctQuality) {
                createPOCTQualityChart();
            }
            if (!charts.poctEfficiency) {
                createPOCTEfficiencyChart();
            }
            break;
        case 'devices':
            if (!charts.deviceHealth) {
                createDeviceHealthChart();
            }
            if (!charts.maintenancePrediction) {
                createMaintenancePredictionChart();
            }
            break;
        case 'quality':
            if (!charts.qualityDetail) {
                createQualityDetailChart();
            }
            if (!charts.qualityDept) {
                createQualityDeptChart();
            }
            if (!charts.qualityItems) {
                createQualityItemsChart();
            }
            if (!charts.qualityIssues) {
                createQualityIssuesChart();
            }
            break;
        case 'reagents':
            if (!charts.labReagentCost) {
                createLabReagentCostChart();
            }
            if (!charts.poctReagentDist) {
                createPOCTReagentDistChart();
            }
            if (!charts.reagentTrend) {
                createReagentTrendChart();
            }
            if (!charts.reagentCostStructure) {
                createReagentCostStructureChart();
            }
            if (!charts.reagentEfficiency) {
                createReagentEfficiencyChart();
            }
            if (!charts.reagentSupplier) {
                createReagentSupplierChart();
            }
            if (!charts.inventoryWarning) {
                createInventoryWarningChart();
            }
            if (!charts.inventoryTurnover) {
                createInventoryTurnoverChart();
            }
            // 添加新的高级图表
            if (!charts.reagentHeatmap) {
                createReagentHeatmapChart();
            }
            if (!charts.reagentEfficiencyRadar) {
                createReagentEfficiencyRadarChart();
            }
            if (!charts.reagentCostForecast) {
                createReagentCostForecastChart();
            }
            break;
    }
}

// 增强设备状态更新功能
function updateDeviceStatus() {
    const devices = document.querySelectorAll('.device-item');
    devices.forEach(device => {
        const workloadElement = device.querySelector('.progress-fill');
        const metricsElements = device.querySelectorAll('.metric-value');
        
        if (workloadElement && Math.random() > 0.7) {
            // 30% 概率更新工作负载
            const newWorkload = Math.max(0, Math.min(100, 
                parseInt(workloadElement.style.width) + (Math.random() - 0.5) * 10));
            workloadElement.style.width = newWorkload + '%';
            
            // 更新相关指标
            if (metricsElements[0]) {
                metricsElements[0].textContent = Math.round(newWorkload) + '%';
            }
        }
    });
}

function updateRealtimeCharts() {
    // 更新实时图表数据
    if (charts.poctTimeAnalysis) {
        updatePOCTTimeAnalysisRealtime();
    }
    
    if (charts.deviceStatus) {
        updateDeviceStatusRealtime();
    }
    
    if (charts.reagentTrend) {
        updateReagentTrendRealtime();
    }
}

function updatePOCTTimeAnalysisRealtime() {
    const chart = charts.poctTimeAnalysis;
    const currentHour = new Date().getHours();
    
    // 模拟当前时段的数据更新
    chart.data.datasets.forEach(dataset => {
        const hourIndex = Math.floor(currentHour / 2);
        if (hourIndex < dataset.data.length) {
            dataset.data[hourIndex] = Math.max(0, dataset.data[hourIndex] + (Math.random() - 0.5) * 5);
        }
    });
    
    chart.update('none');
}

function updateDeviceStatusRealtime() {
    const chart = charts.deviceStatus;
    
    // 随机更新设备状态
    chart.data.datasets.forEach(dataset => {
        dataset.data = dataset.data.map(value => 
            Math.max(0, value + Math.floor((Math.random() - 0.5) * 2))
        );
    });
    
    chart.update('none');
}

function updateReagentTrendRealtime() {
    const chart = charts.reagentTrend;
    const today = new Date();
    const todayStr = today.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    
    // 如果今天的数据不存在，添加新数据点
    if (chart.data.labels[chart.data.labels.length - 1] !== todayStr) {
        chart.data.labels.push(todayStr);
        
        chart.data.datasets.forEach((dataset, index) => {
            if (index < 3) { // 试剂数据
                const lastValue = dataset.data[dataset.data.length - 1];
                const newValue = Math.max(0, lastValue + (Math.random() - 0.5) * 8);
                dataset.data.push(Math.round(newValue));
            } else { // 成本数据
                const newValue = Math.random() * 7 + 8;
                dataset.data.push(Math.round(newValue * 10) / 10);
            }
        });
        
        // 保持30天的数据窗口
        if (chart.data.labels.length > 30) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }
        
        chart.update();
    }
}

// 新增数据生成函数
function generateReagentTrendData(days, min, max) {
    const data = [];
    let current = Math.floor((min + max) / 2);
    
    for (let i = 0; i < days; i++) {
        const change = (Math.random() - 0.5) * 6;
        current = Math.max(min, Math.min(max, current + change));
        data.push(Math.round(current));
    }
    return data;
}

function generateCostTrendData(days, min, max) {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push(Math.round((Math.random() * (max - min) + min) * 10) / 10);
    }
    return data;
}

// 新增：设备健康度监控
function createDeviceHealthChart() {
    const ctx = document.getElementById('deviceHealthChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.deviceHealth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24), // 24小时数据
            datasets: [{
                label: '生化分析仪-01',
                data: generateHealthData(24, 85, 95),
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                fill: false
            }, {
                label: '血液分析仪-01',
                data: generateHealthData(24, 90, 98),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false
            }, {
                label: 'POCT-急诊-01',
                data: generateHealthData(24, 88, 96),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                tension: 0.4,
                fill: false
            }, {
                label: '健康阈值',
                data: Array(24).fill(85),
                borderColor: '#dc2626',
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return '设备健康度监控 - ' + tooltipItems[0].label;
                        },
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            let status = '';
                            if (value >= 95) status = '(优秀)';
                            else if (value >= 90) status = '(良好)';
                            else if (value >= 85) status = '(正常)';
                            else status = '(需注意)';
                            return label + ': ' + value + '% ' + status;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 新增：POCT实时性能监控
function createPOCTPerformanceChart() {
    const ctx = document.getElementById('poctPerformanceChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    charts.poctPerformance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['响应时间', '准确率', '可用性', '吞吐量', '错误率'],
            datasets: [{
                label: '急诊科POCT',
                data: [95, 98, 99, 85, 2],
                backgroundColor: [
                    value => value >= 90 ? '#059669' : value >= 80 ? '#d97706' : '#dc2626'
                ]
            }, {
                label: 'ICU POCT',
                data: [92, 97, 98, 88, 1.5],
                backgroundColor: [
                    value => value >= 90 ? '#059669' : value >= 80 ? '#d97706' : '#dc2626'
                ]
            }, {
                label: '骨科POCT',
                data: [88, 96, 96, 82, 3],
                backgroundColor: [
                    value => value >= 90 ? '#059669' : value >= 80 ? '#d97706' : '#dc2626'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                    }
                }
            }
        }
    });
}

// 新增：设备维护预测图表
function createMaintenancePredictionChart() {
    const ctx = document.getElementById('maintenancePredictionChart');
    if (!ctx) return;
    
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    // 生成设备维护预测数据
    const devices = ['生化分析仪-01', '生化分析仪-02', '血液分析仪-01', '免疫分析仪-01', 'POCT-急诊-01', 'POCT-骨科-01'];
    const maintenanceDays = [15, 8, 25, 12, 6, 20]; // 距离下次维护的天数
    
    charts.maintenancePrediction = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: devices,
            datasets: [{
                label: '距离维护天数',
                data: maintenanceDays,
                backgroundColor: maintenanceDays.map(days => {
                    if (days <= 7) return '#dc2626';      // 紧急
                    else if (days <= 14) return '#d97706'; // 警告
                    else return '#059669';                 // 正常
                }),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const days = context.parsed.y;
                            let urgency = '';
                            if (days <= 7) urgency = '(紧急维护)';
                            else if (days <= 14) urgency = '(计划维护)';
                            else urgency = '(正常状态)';
                            return days + ' 天 ' + urgency;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + ' 天';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// 辅助函数：生成时间标签
function generateTimeLabels(hours) {
    const labels = [];
    for (let i = 0; i < hours; i++) {
        const hour = (new Date().getHours() - hours + i + 24) % 24;
        labels.push(hour.toString().padStart(2, '0') + ':00');
    }
    return labels;
}

// 辅助函数：生成设备健康度数据
function generateHealthData(points, min, max) {
    const data = [];
    let current = (min + max) / 2;
    
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * 3;
        current = Math.max(min - 5, Math.min(max, current + change));
        data.push(Math.round(current * 10) / 10);
    }
    return data;
}

// 增强的设备管理实时更新
function updateDeviceManagement() {
    // 更新设备状态
    const deviceItems = document.querySelectorAll('.device-item');
    deviceItems.forEach(item => {
        const statusElement = item.querySelector('.device-status');
        const metricsElements = item.querySelectorAll('.metric-value');
        const progressFill = item.querySelector('.progress-fill');
        
        // 随机更新某些设备的状态
        if (Math.random() > 0.9) {
            // 10% 概率更新状态
            const currentWorkload = parseInt(progressFill.style.width);
            const newWorkload = Math.max(0, Math.min(100, currentWorkload + (Math.random() - 0.5) * 10));
            
            progressFill.style.width = newWorkload + '%';
            if (metricsElements[0]) {
                metricsElements[0].textContent = Math.round(newWorkload) + '%';
            }
            
            // 更新检测次数
            if (metricsElements[2]) {
                const currentTests = parseInt(metricsElements[2].textContent);
                const newTests = currentTests + Math.floor(Math.random() * 3);
                metricsElements[2].textContent = newTests + '次';
            }
        }
    });
    
    // 更新实时图表
    if (charts.deviceHealth) {
        updateDeviceHealthRealtime();
    }
    
    if (charts.poctPerformance) {
        updatePOCTPerformanceRealtime();
    }
}

function updateDeviceHealthRealtime() {
    const chart = charts.deviceHealth;
    const currentHour = new Date().getHours();
    
    // 添加新的时间点
    const newLabel = currentHour.toString().padStart(2, '0') + ':00';
    if (chart.data.labels[chart.data.labels.length - 1] !== newLabel) {
        chart.data.labels.push(newLabel);
        
        // 为每个设备添加新的健康度数据
        chart.data.datasets.forEach((dataset, index) => {
            if (index < 3) { // 跳过阈值线
                const lastValue = dataset.data[dataset.data.length - 1];
                const newValue = Math.max(70, Math.min(100, lastValue + (Math.random() - 0.5) * 5));
                dataset.data.push(Math.round(newValue * 10) / 10);
            }
        });
        
        // 保持24小时窗口
        if (chart.data.labels.length > 24) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => {
                if (dataset.data.length > 24) {
                    dataset.data.shift();
                }
            });
        }
        
        chart.update('none');
    }
}

function updatePOCTPerformanceRealtime() {
    const chart = charts.poctPerformance;
    
    // 随机更新性能数据
    chart.data.datasets.forEach(dataset => {
        dataset.data = dataset.data.map((value, index) => {
            if (index === 4) { // 错误率数据，应该降低
                return Math.max(0, value + (Math.random() - 0.7) * 0.5);
            } else { // 其他指标，应该提高
                return Math.max(70, Math.min(100, value + (Math.random() - 0.3) * 2));
            }
        });
    });
    
    chart.update('none');
}

// 增强数据更新功能
function startDataUpdates() {
    // 定期更新数据
    dataUpdateInterval = setInterval(() => {
        updateOverviewData();
        updateAlertData();
        updateDeviceStatus();
        updateRealtimeCharts();
        updateDeviceManagement();
    }, 30000); // 每30秒更新一次
    
    // 初始更新
    updateOverviewData();
    
    // 每分钟更新一次设备状态
    setInterval(updateDeviceStatus, 60000);
    
    // 每5分钟更新设备管理数据
    setInterval(updateDeviceManagement, 300000);
}

// ... existing code ... 