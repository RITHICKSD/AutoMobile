document.addEventListener('DOMContentLoaded', function () {
    // --- State Management ---
    let currentDir = document.documentElement.dir || 'ltr';
    let charts = {};

    // --- Selectors ---
    const sidebar = document.querySelector('.dashboard-sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileClose = document.querySelector('.mobile-close');
    const navItems = document.querySelectorAll('.sidebar-nav li:not(.logout-item)');
    const viewport = document.getElementById('dashboard-content');
    const viewTitle = document.getElementById('current-view-title');
    const rtlToggles = [
        document.getElementById('dashboard-rtl-toggle'),
        document.getElementById('dashboard-header-rtl-toggle')
    ].filter(el => el);

    // --- Initialization ---
    setTimeout(() => {
        switchView('overview');
    }, 100);

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            if (!view) return;
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            switchView(view);
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // --- View Switcher ---
    function switchView(viewKey) {
        // Destroy old charts to prevent memory leaks
        Object.values(charts).forEach(chart => chart.destroy());
        charts = {};

        const views = {
            overview: {
                title: 'Command Center',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card">
                            <h4>VEHICLE STATUS</h4>
                            <div class="card-value">OPTIMAL</div>
                            <div class="card-meta"><i class="fas fa-check-circle"></i> ALL SYSTEMS NOMINAL</div>
                        </div>
                        <div class="dash-card">
                            <h4>TOTAL DISTANCE</h4>
                            <div class="card-value">12,450 km</div>
                            <div class="card-meta"><i class="fas fa-arrow-up"></i> 150 km since last mission</div>
                        </div>
                        <div class="dash-card">
                            <h4>FUEL ENGINE</h4>
                            <div class="card-value">85%</div>
                            <div class="card-meta"><i class="fas fa-gas-pump"></i> RANGE: 420 km</div>
                        </div>
                        <div class="dash-card">
                            <h4>TIRE PRESSURE</h4>
                            <div class="card-value">32 PSI</div>
                            <div class="card-meta"><i class="fas fa-info-circle"></i> PSI STABLE</div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>PERFORMANCE PULSE (LIVE)</h4>
                             <div class="chart-container">
                                <canvas id="pulseChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>MISSION DISTRIBUTION</h4>
                             <div class="chart-container">
                                <canvas id="distChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initPulseChart();
                    initDistChart();
                }
            },
            performance: {
                title: 'Performance Telemetry',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>TORQUE VS RPM MISSION DATA</h4>
                            <div class="chart-container" style="height: 400px;">
                                <canvas id="torqueChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>ACCELERATION CURVE</h4>
                            <div class="chart-container">
                                <canvas id="accelChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>LATERAL G-FORCE</h4>
                            <div class="chart-container">
                                <canvas id="gForceChart"></canvas>
                            </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initTorqueChart();
                    initAccelChart();
                    initGForceChart();
                }
            },
            vitals: {
                title: 'Vitals Monitor',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card">
                            <h4>ENGINE TEMP</h4>
                            <div class="card-value">92&deg;C</div>
                            <div class="card-meta">NOMINAL RANGE</div>
                        </div>
                        <div class="dash-card">
                            <h4>OIL PRESSURE</h4>
                            <div class="card-value">4.2 bar</div>
                            <div class="card-meta">STABLE</div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>SYSTEM TEMPERATURES</h4>
                            <div class="chart-container">
                                <canvas id="tempChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>TIRE PRESSURE (LIVE PSI)</h4>
                             <div class="chart-container">
                                <canvas id="tireChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>BATTERY HEALTH</h4>
                             <div class="chart-container">
                                <canvas id="batteryChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>COOLANT LEVEL</h4>
                             <div class="chart-container">
                                <canvas id="coolantChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>OIL LIFE ANALYSIS</h4>
                             <div class="chart-container">
                                <canvas id="oilLifeChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initTempChart();
                    initTireChart();
                    initBatteryChart();
                    initCoolantChart();
                    initOilLifeChart();
                }
            },
            missions: {
                title: 'Mission Log',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-2 free-view">
                             <h4>DISTANCE ACCUMULATION</h4>
                             <div class="chart-container">
                                <canvas id="missionDistChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2 free-view">
                             <h4>MISSION TYPE DISTRIBUTION</h4>
                             <div class="chart-container">
                                <canvas id="missionTypeChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-4 free-view">
                            <h4>OPERATIONAL TIMELINE</h4>
                            <div class="mission-timeline">
                                <div class="timeline-item">
                                    <div class="time">14:20</div>
                                    <div class="mission-info">
                                        <h5>NORTH SECTOR RECON</h5>
                                        <p>Route optimized for speed. Fuel efficiency: 92%.</p>
                                    </div>
                                    <div class="mission-stat">+45 KM</div>
                                </div>
                                <div class="timeline-item">
                                    <div class="time">09:15</div>
                                    <div class="mission-info">
                                        <h5>CITY GRID NAVIGATION</h5>
                                        <p>Heavy traffic encountered. Brake wear minimal.</p>
                                    </div>
                                    <div class="mission-stat">+12 KM</div>
                                </div>
                                <div class="timeline-item">
                                    <div class="time">YESTERDAY</div>
                                    <div class="mission-info">
                                        <h5>HIGH PERFORMANCE CALIBRATION</h5>
                                        <p>Engine peak torque tested. All sensors functional.</p>
                                    </div>
                                    <div class="mission-stat">+5 KM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initMissionDistChart();
                    initMissionTypeChart();
                }
            },
            analytics: {
                title: 'Analytics Hub',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-2">
                            <h4>ENERGY CONSUMPTION</h4>
                            <div class="chart-container">
                                <canvas id="energyChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>MONTHLY EFFICIENCY</h4>
                            <div class="chart-container">
                                <canvas id="efficiencyChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>FUEL CONSUMPTION TREND</h4>
                             <div class="chart-container">
                                <canvas id="fuelTrendChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>OPERATIONAL COST ANALYSIS</h4>
                             <div class="chart-container">
                                <canvas id="costAnalysisChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>RANGE FORECAST</h4>
                             <div class="chart-container">
                                <canvas id="rangeForecastChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>IO THROUGHPUT</h4>
                             <div class="chart-container">
                                <canvas id="ioChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>SYSTEM UPTIME</h4>
                             <div class="chart-container">
                                <canvas id="uptimeChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>RESOURCE ALLOCATION</h4>
                             <div class="chart-container">
                                <canvas id="resourceChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initEnergyChart();
                    initEfficiencyChart();
                    initFuelTrendChart();
                    initCostAnalysisChart();
                    initRangeForecastChart();
                    initUptimeChart();
                    initIOChart();
                    initResourceChart();
                }
            },
            security: {
                title: 'Security Uplink',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>GEOFENCE RADAR</h4>
                            <div class="tactical-radar">
                                <div class="radar-circle"></div>
                                <div class="scanner-sweep"></div>
                                <div class="vehicle-marker"></div>
                                <div class="status-overlay">GEO-LOCK ACTIVE</div>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>ACCESS LOGS</h4>
                            <ul class="access-list">
                                <li><i class="fas fa-key"></i> Remote Start: 14:05 <span class="badge">SECURE</span></li>
                                <li><i class="fas fa-lock"></i> Doors Locked: 09:30 <span class="badge">SECURE</span></li>
                                <li><i class="fas fa-user-check"></i> Driver Identified: 08:45 <span class="badge">SECURE</span></li>
                            </ul>
                        </div>
                    </div>
                `,
                init: () => { }
            },
            maintenance: {
                title: 'Maintenance Briefing',
                content: `
                    <div class="dashboard-grid">
                        <div class="dash-card">
                            <h4>BRAKE WEAR</h4>
                            <div class="progress-gauge" style="--val: 15%;"><span>15%</span></div>
                            <p class="gauge-label">EXCELLENT</p>
                        </div>
                        <div class="dash-card">
                            <h4>FLUID LEVELS</h4>
                            <div class="progress-gauge" style="--val: 85%;"><span>85%</span></div>
                            <p class="gauge-label">OPTIMAL</p>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>SERVICE FORECAST</h4>
                            <div class="chart-container">
                                <canvas id="serviceChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>COMPONENT HEALTH</h4>
                             <div class="chart-container">
                                <canvas id="healthChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>SERVICE HISTORY (COST)</h4>
                             <div class="chart-container">
                                <canvas id="historyChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initServiceChart();
                    initComponentHealthChart();
                    initServiceHistoryChart();
                }
            }
        };

        const view = views[viewKey] || views.overview;
        viewTitle.textContent = view.title;
        viewport.innerHTML = view.content;

        // Ensure DOM is updated before initializing charts
        requestAnimationFrame(() => {
            if (view.init) view.init();
        });
    }

    // --- Chart Initializers ---
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#8e959c', font: { family: 'Orbitron' } } }
        },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e959c' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e959c' } }
        }
    };

    function initPulseChart() {
        const ctx = document.getElementById('pulseChart').getContext('2d');
        charts.pulse = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00s', '10s', '20s', '30s', '40s', '50s'],
                datasets: [{
                    label: 'Power Pulse (HP)',
                    data: [120, 150, 450, 420, 600, 580],
                    borderColor: '#ff5e00',
                    backgroundColor: 'rgba(255, 94, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initDistChart() {
        const ctx = document.getElementById('distChart').getContext('2d');
        charts.dist = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Track', 'Tactical', 'Urban'],
                datasets: [{
                    data: [45, 25, 30],
                    backgroundColor: ['#ff5e00', '#ffd700', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initTorqueChart() {
        const ctx = document.getElementById('torqueChart').getContext('2d');
        charts.torque = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1000', '2000', '3000', '4000', '5000', '6000', '7000'],
                datasets: [{
                    label: 'Torque (Nm)',
                    data: [200, 350, 580, 750, 820, 780, 700],
                    borderColor: '#ffd700',
                    tension: 0.1
                }, {
                    label: 'HP',
                    data: [100, 220, 350, 480, 620, 710, 750],
                    borderColor: '#ff5e00',
                    tension: 0.1
                }]
            },
            options: chartDefaults
        });
    }

    function initTempChart() {
        const ctx = document.getElementById('tempChart').getContext('2d');
        charts.temp = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Engine', 'Transmission', 'Diff', 'Tires'],
                datasets: [{
                    label: 'Live Temp (C)',
                    data: [92, 85, 76, 45],
                    backgroundColor: 'rgba(0, 255, 136, 0.5)'
                }]
            },
            options: chartDefaults
        });
    }

    function initTireChart() {
        const ctx = document.getElementById('tireChart').getContext('2d');
        if (!ctx) return;
        charts.tire = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['FL', 'FR', 'RL', 'RR'],
                datasets: [{
                    label: 'PSI',
                    data: [32, 33, 31, 32],
                    backgroundColor: '#ffd700'
                }]
            },
            options: chartDefaults
        });
    }

    function initBatteryChart() {
        const ctx = document.getElementById('batteryChart').getContext('2d');
        if (!ctx) return;
        charts.battery = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Charged', 'Depleted'],
                datasets: [{
                    data: [94, 6],
                    backgroundColor: ['#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initCoolantChart() {
        const ctx = document.getElementById('coolantChart').getContext('2d');
        if (!ctx) return;
        charts.coolant = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Level', 'Pressure', 'Quality'],
                datasets: [{
                    data: [85, 40, 95],
                    backgroundColor: ['rgba(0, 255, 136, 0.5)', 'rgba(255, 94, 0, 0.5)', 'rgba(255, 215, 0, 0.5)']
                }]
            },
            options: chartDefaults
        });
    }

    function initOilLifeChart() {
        const ctx = document.getElementById('oilLifeChart').getContext('2d');
        if (!ctx) return;
        charts.oilLife = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Viscosity', 'Purity', 'Temp', 'Flow', 'Pressure'],
                datasets: [{
                    label: 'Oil Quality',
                    data: [90, 85, 92, 88, 95],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initAccelChart() {
        const ctx = document.getElementById('accelChart').getContext('2d');
        if (!ctx) return;
        charts.accel = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
                datasets: [{
                    label: 'KPH',
                    data: [0, 45, 98, 145, 185, 210],
                    borderColor: '#00ff88',
                    fill: false
                }]
            },
            options: chartDefaults
        });
    }

    function initGForceChart() {
        const ctx = document.getElementById('gForceChart').getContext('2d');
        if (!ctx) return;
        charts.gForce = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Lateral G',
                    data: [
                        { x: 0.1, y: 0.2 }, { x: 0.5, y: -0.3 }, { x: -0.4, y: 0.8 },
                        { x: 0.9, y: 0.1 }, { x: -0.2, y: -0.6 }, { x: 0.3, y: 0.4 }
                    ],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    x: { min: -1.5, max: 1.5, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { min: -1.5, max: 1.5, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    function initEnergyChart() {
        const ctx = document.getElementById('energyChart').getContext('2d');
        charts.energy = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Drive', 'Systems', 'Climate', 'Charging'],
                datasets: [{
                    data: [65, 15, 10, 10],
                    backgroundColor: ['rgba(255, 94, 0, 0.5)', 'rgba(255, 215, 0, 0.5)', 'rgba(44, 49, 54, 0.5)', 'rgba(0, 255, 136, 0.5)']
                }]
            },
            options: chartDefaults
        });
    }

    function initEfficiencyChart() {
        const ctx = document.getElementById('efficiencyChart').getContext('2d');
        charts.efficiency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: 'Efficiency index',
                    data: [94, 88, 91, 95],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: chartDefaults
        });
    }

    function initFuelTrendChart() {
        const ctx = document.getElementById('fuelTrendChart').getContext('2d');
        if (!ctx) return;
        charts.fuelTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['W1', 'W2', 'W3', 'W4'],
                datasets: [{
                    label: 'Consumption (L/100km)',
                    data: [12.5, 11.8, 13.2, 11.5],
                    borderColor: '#00ff88',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initCostAnalysisChart() {
        const ctx = document.getElementById('costAnalysisChart').getContext('2d');
        if (!ctx) return;
        charts.costAnalysis = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Fuel', 'Maintenance', 'Insurance', 'Tolls'],
                datasets: [{
                    data: [55, 25, 15, 5],
                    backgroundColor: ['#ff5e00', '#ffd700', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initRangeForecastChart() {
        const ctx = document.getElementById('rangeForecastChart').getContext('2d');
        if (!ctx) return;
        charts.rangeForecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Now', '+1h', '+2h', '+3h'],
                datasets: [{
                    label: 'Est. Range (KM)',
                    data: [420, 310, 190, 80],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true
                }]
            },
            options: chartDefaults
        });
    }

    function initUptimeChart() {
        const ctx = document.getElementById('uptimeChart').getContext('2d');
        if (!ctx) return;
        charts.uptime = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Online', 'Offline'],
                datasets: [{
                    data: [99.9, 0.1],
                    backgroundColor: ['#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initIOChart() {
        const ctx = document.getElementById('ioChart').getContext('2d');
        if (!ctx) return;
        charts.io = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Read', 'Write', 'Latency', 'Cache', 'Bus'],
                datasets: [{
                    label: 'Throughput',
                    data: [85, 92, 15, 78, 90],
                    borderColor: '#ff5e00',
                    backgroundColor: 'rgba(255, 94, 0, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initResourceChart() {
        const ctx = document.getElementById('resourceChart').getContext('2d');
        if (!ctx) return;
        charts.resource = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['CPU', 'RAM', 'GPU', 'DISK'],
                datasets: [{
                    label: 'Allocation %',
                    data: [45, 68, 82, 30],
                    backgroundColor: '#00ff88'
                }]
            },
            options: chartDefaults
        });
    }

    function initServiceChart() {
        const ctx = document.getElementById('serviceChart').getContext('2d');
        charts.service = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Brakes', 'Tires', 'Suspension', 'Fluids', 'Battery'],
                datasets: [{
                    label: 'Wear Level',
                    data: [15, 20, 10, 30, 5],
                    borderColor: '#ff5e00',
                    backgroundColor: 'rgba(255, 94, 0, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initComponentHealthChart() {
        const ctx = document.getElementById('healthChart').getContext('2d');
        if (!ctx) return;
        charts.health = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alternator', 'Exhaust', 'Turbo', 'Cooling'],
                datasets: [{
                    label: 'Health %',
                    data: [98, 85, 92, 88],
                    backgroundColor: '#00ff88'
                }]
            },
            options: chartDefaults
        });
    }

    function initServiceHistoryChart() {
        const ctx = document.getElementById('historyChart').getContext('2d');
        if (!ctx) return;
        charts.history = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2023', '2024', '2025', '2026'],
                datasets: [{
                    label: 'Maintenance Cost ($)',
                    data: [1200, 1500, 800, 450],
                    borderColor: '#ffd700',
                    fill: false
                }]
            },
            options: chartDefaults
        });
    }

    function initMissionDistChart() {
        const ctx = document.getElementById('missionDistChart').getContext('2d');
        charts.missionDist = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['M1', 'M2', 'M3', 'M4', 'M5'],
                datasets: [{
                    label: 'Km Travelled',
                    data: [45, 12, 5, 68, 30],
                    borderColor: '#00ff88',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initMissionTypeChart() {
        const ctx = document.getElementById('missionTypeChart').getContext('2d');
        if (!ctx) return;
        charts.missionType = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Recon', 'Delivery', 'Pursuit', 'Escort'],
                datasets: [{
                    data: [40, 20, 25, 15],
                    backgroundColor: ['#ff5e00', '#ffd700', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    // --- UI Interactions ---
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    mobileClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // --- RTL/LTR Toggle ---
    function updateRTLText(dir) {
        rtlToggles.forEach(btn => {
            const span = btn.querySelector('span');
            if (span) span.textContent = dir.toUpperCase();
        });
    }

    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            currentDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            document.documentElement.dir = currentDir;
            localStorage.setItem('docDir', currentDir);

            // Update text for all toggles
            updateRTLText(currentDir);

            // Reload views/charts to handle direction change if needed
            const activeItem = document.querySelector('.sidebar-nav li.active');
            if (activeItem) {
                const activeView = activeItem.getAttribute('data-view');
                switchView(activeView);
            }
        });
    });

    // --- Theme Toggle ---
    const themeToggles = [
        document.getElementById('dashboard-theme-toggle'),
        document.getElementById('dashboard-header-theme-toggle')
    ].filter(el => el);
    const body = document.body;

    function updateThemeIcon(isLight) {
        themeToggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (isLight) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);
        });
    });

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    }

    // Handle initial direction
    const savedDir = localStorage.getItem('docDir');
    if (savedDir) {
        currentDir = savedDir;
        document.documentElement.dir = currentDir;
        updateRTLText(currentDir);
    }
});
