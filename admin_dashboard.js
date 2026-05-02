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
    const rtlToggle = document.getElementById('dashboard-rtl-toggle');

    // --- Initialization ---
    setTimeout(() => {
        switchView('fleet');
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
            fleet: {
                title: 'Fleet Control',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>TOTAL FLEET</h4><div class="card-value">1,240</div><div class="card-meta">ACTIVE</div></div>
                        <div class="dash-card mini"><h4>ON MISSION</h4><div class="card-value">894</div><div class="card-meta">DEPLOYED</div></div>
                        <div class="dash-card mini"><h4>READY STATUS</h4><div class="card-value">96%</div><div class="card-meta">OPTIMAL</div></div>
                        <div class="dash-card mini"><h4>FUEL LEVEL</h4><div class="card-value">84%</div><div class="card-meta">RESERVE</div></div>
                        <div class="dash-card mini"><h4>AVG SPEED</h4><div class="card-value">62 km/h</div><div class="card-meta">NOMINAL</div></div>
                        <div class="dash-card mini"><h4>MAINTENANCE</h4><div class="card-value">12</div><div class="card-meta">DUE SOON</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>GLOBAL FLEET DISTRIBUTION</h4>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="fleetDistChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>MISSION VELOCITY</h4>
                             <div class="chart-container">
                                <canvas id="velocityChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>DEPOT CAPACITY</h4>
                             <div class="chart-container">
                                <canvas id="depotChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>FUEL EFFICIENCY TRENDS</h4>
                             <div class="chart-container">
                                <canvas id="fuelEfficiencyChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>PILOT READINESS RADAR</h4>
                             <div class="chart-container">
                                <canvas id="pilotReadinessChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initFleetDistChart();
                    initVelocityChart();
                    initDepotChart();
                    initFuelEfficiencyChart();
                    initPilotReadinessChart();
                }
            },
            revenue: {
                title: 'Financial Intelligence',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>GROSS REVENUE</h4><div class="card-value">$4.2M</div><div class="card-meta">+12%</div></div>
                        <div class="dash-card mini"><h4>NET PROFIT</h4><div class="card-value">$1.8M</div><div class="card-meta">+8%</div></div>
                        <div class="dash-card mini"><h4>OPEX</h4><div class="card-value">$2.4M</div><div class="card-meta">STABLE</div></div>
                        <div class="dash-card mini"><h4>ACTIVE ORDERS</h4><div class="card-value">1,240</div><div class="card-meta">PROCESSING</div></div>
                        <div class="dash-card mini"><h4>VALUATION</h4><div class="card-value">$25M</div><div class="card-meta">ESTIMATED</div></div>
                        <div class="dash-card mini"><h4>NET MARGIN</h4><div class="card-value">42.8%</div><div class="card-meta">TARGET: 45%</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>REVENUE VS OPERATIONAL COST</h4>
                            <div class="chart-container" style="height: 350px;">
                                <canvas id="revenueChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>REGIONAL PROFITABILITY</h4>
                            <div class="chart-container">
                                <canvas id="profitChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>EXPENDITURE BREAKDOWN</h4>
                            <div class="chart-container">
                                <canvas id="expenseChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>MONTHLY SALES TARGETS</h4>
                            <div class="chart-container">
                                <canvas id="salesTargetChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>TRANSACTION VELOCITY</h4>
                            <div class="chart-container">
                                <canvas id="transVelocityChart"></canvas>
                            </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initRevenueChart();
                    initProfitChart();
                    initExpenseChart();
                    initSalesTargetChart();
                    initTransVelocityChart();
                }
            },
            users: {
                title: 'Command Personnel',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>TOTAL USERS</h4><div class="card-value">45.2k</div><div class="card-meta">+582</div></div>
                        <div class="dash-card mini"><h4>ACTIVE PILOTS</h4><div class="card-value">8.9k</div><div class="card-meta">ON-MISSION</div></div>
                        <div class="dash-card mini"><h4>ADMINS</h4><div class="card-value">42</div><div class="card-meta">LOGGED IN</div></div>
                        <div class="dash-card mini"><h4>AVG RATING</h4><div class="card-value">4.8</div><div class="card-meta">OPTIMAL</div></div>
                        <div class="dash-card mini"><h4>RETENTION</h4><div class="card-value">92%</div><div class="card-meta">HIGH</div></div>
                        <div class="dash-card mini"><h4>CHURN RATE</h4><div class="card-value">1.2%</div><div class="card-meta">NOMINAL</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>USER REGISTRATION GROWTH</h4>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="userGrowthChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>PERSONNEL DISTRIBUTIONS</h4>
                             <div class="chart-container">
                                <canvas id="roleDistChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>DRIVER RATINGS radar</h4>
                             <div class="chart-container">
                                <canvas id="ratingChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>SESSION DURATION TRENDS</h4>
                             <div class="chart-container">
                                <canvas id="sessionDurationChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>GEOGRAPHIC ACTIVE USERS</h4>
                             <div class="chart-container">
                                <canvas id="geoUserChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initUserGrowthChart();
                    initRoleDistChart();
                    initRatingChart();
                    initSessionDurationChart();
                    initGeoUserChart();
                }
            },
            systems: {
                title: 'System Integrity',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>SERVER LOAD</h4><div class="card-value">42%</div><div class="card-meta">STABLE</div></div>
                        <div class="dash-card mini"><h4>DB HEALTH</h4><div class="card-value">99.9%</div><div class="card-meta">NOMINAL</div></div>
                        <div class="dash-card mini"><h4>LATENCY</h4><div class="card-value">12ms</div><div class="card-meta">FAST</div></div>
                        <div class="dash-card mini"><h4>UPLINK</h4><div class="card-value">5.2G</div><div class="card-meta">SECURE</div></div>
                        <div class="dash-card mini"><h4>DISK SPACE</h4><div class="card-value">12TB</div><div class="card-meta">45% REMAIN</div></div>
                        <div class="dash-card mini"><h4>UPTIME</h4><div class="card-value">99.99%</div><div class="card-meta">TARGET: 100%</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                             <h4>NETWORK LATENCY TRENDS (MS)</h4>
                             <div class="chart-container" style="height: 300px;">
                                <canvas id="latencyChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>TRAFFIC DISTRIBUTION</h4>
                             <div class="chart-container">
                                <canvas id="trafficDistChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>INFRASRUCTURE NODES LOAD</h4>
                             <div class="chart-container">
                                <canvas id="nodesLoadChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>REQUEST FREQUENCY</h4>
                             <div class="chart-container">
                                <canvas id="requestFreqChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>ERROR RATE TRENDS</h4>
                             <div class="chart-container">
                                <canvas id="errorRateChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initLatencyChart();
                    initTrafficDistChart();
                    initNodesLoadChart();
                    initRequestFreqChart();
                    initErrorRateChart();
                }
            },
            logistics: {
                title: 'Logistical Network',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>ORDERS IN FLIGHT</h4><div class="card-value">142</div><div class="card-meta">DELIVERING</div></div>
                        <div class="dash-card mini"><h4>STOCK LEVEL</h4><div class="card-value">82%</div><div class="card-meta">NOMINAL</div></div>
                        <div class="dash-card mini"><h4>DEPOTS</h4><div class="card-value">12</div><div class="card-meta">OPERATIONAL</div></div>
                        <div class="dash-card mini"><h4>AVG TRANSIT</h4><div class="card-value">2.4h</div><div class="card-meta">FAST</div></div>
                        <div class="dash-card mini"><h4>THROUGHPUT</h4><div class="card-value">4.2M</div><div class="card-meta">TOTAL</div></div>
                        <div class="dash-card mini"><h4>REFILL RATE</h4><div class="card-value">94%</div><div class="card-meta">OPTIMAL</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>SUPPLY CHAIN STATUS</h4>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="supplyChainChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>REGIONAL DENSITY</h4>
                             <div class="chart-container">
                                <canvas id="densityChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>LOGISTICS EFFICIENCY</h4>
                             <div class="chart-container">
                                <canvas id="efficiencyChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>DELIVERY TIME HISTOGRAM</h4>
                             <div class="chart-container">
                                <canvas id="deliveryTimeChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>FLEET IDLE TIME</h4>
                             <div class="chart-container">
                                <canvas id="idleTimeChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initSupplyChainChart();
                    initDensityChart();
                    initLogisticsEfficiencyChart();
                    initDeliveryTimeChart();
                    initIdleTimeChart();
                }
            },
            incidents: {
                title: 'Tactical Alerts',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>OPEN ALERTS</h4><div class="card-value">12</div><div class="card-meta">CRITICAL: 2</div></div>
                        <div class="dash-card mini"><h4>RESOLVED</h4><div class="card-value">45</div><div class="card-meta">TODAY</div></div>
                        <div class="dash-card mini"><h4>AVG RESPONSE</h4><div class="card-value">12m</div><div class="card-meta">-2m</div></div>
                        <div class="dash-card mini"><h4>GUARD UPTIME</h4><div class="card-value">99.9%</div><div class="card-meta">NOMINAL</div></div>
                        <div class="dash-card mini"><h4>BREACHES</h4><div class="card-value">0</div><div class="card-meta">SECURE</div></div>
                        <div class="dash-card mini"><h4>INCIDENT RATE</h4><div class="card-value">0.4/h</div><div class="card-meta">LOW</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>INCIDENT HISTORY</h4>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="incidentChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>ALERT SEVERITY DISTRIBUTION</h4>
                            <div class="chart-container">
                                <canvas id="severityDistChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>RESPONSE TIME TRENDS</h4>
                            <div class="chart-container">
                                <canvas id="responseTimeChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>GEOGRAPHIC ALERTS</h4>
                            <div class="chart-container">
                                <canvas id="geoAlertChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                            <h4>PERSONNEL RESPONSE LOAD</h4>
                            <div class="chart-container">
                                <canvas id="responseLoadChart"></canvas>
                            </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initIncidentChart();
                    initSeverityDistChart();
                    initResponseTimeChart();
                    initGeoAlertChart();
                    initResponseLoadChart();
                }
            },
            resources: {
                title: 'Resource Planning',
                content: `
                    <div class="data-strip-horizontal">
                        <div class="dash-card mini"><h4>PARTS IN STOCK</h4><div class="card-value">12k</div><div class="card-meta">82%</div></div>
                        <div class="dash-card mini"><h4>ORDER VELOCITY</h4><div class="card-value">45/d</div><div class="card-meta">STABLE</div></div>
                        <div class="dash-card mini"><h4>LEAD TIME</h4><div class="card-value">2.4d</div><div class="card-meta">OPTIMAL</div></div>
                        <div class="dash-card mini"><h4>WASTE RATE</h4><div class="card-value">1.2%</div><div class="card-meta">-0.5%</div></div>
                        <div class="dash-card mini"><h4>SKU COUNT</h4><div class="card-value">842</div><div class="card-meta">ACTIVE</div></div>
                        <div class="dash-card mini"><h4>SUPPLIERS</h4><div class="card-value">24</div><div class="card-meta">ON-CONTRACT</div></div>
                    </div>
                    <div class="dashboard-grid">
                        <div class="dash-card grid-span-4">
                            <h4>FLEET RESOURCE ALLOCATION</h4>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="fleetResourceChart"></canvas>
                            </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>INVENTORY TURNOVER</h4>
                             <div class="chart-container">
                                <canvas id="turnoverChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>PARTS SCRAPPING RATE</h4>
                             <div class="chart-container">
                                <canvas id="scrapRateChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>SUPPLIER RELIABILITY RADAR</h4>
                             <div class="chart-container">
                                <canvas id="supplierRadarChart"></canvas>
                             </div>
                        </div>
                        <div class="dash-card grid-span-2">
                             <h4>PROCUREMENT CYCLE ANALYSIS</h4>
                             <div class="chart-container">
                                <canvas id="procureCycleChart"></canvas>
                             </div>
                        </div>
                    </div>
                `,
                init: () => {
                    initFleetResourceChart();
                    initTurnoverChart();
                    initScrapRateChart();
                    initSupplierRadarChart();
                    initProcureCycleChart();
                }
            }
        };

        const view = views[viewKey] || views.fleet;
        viewTitle.textContent = view.title;
        viewport.innerHTML = view.content;

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

    function initFleetDistChart() {
        const ctx = document.getElementById('fleetDistChart').getContext('2d');
        charts.fleetDist = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'],
                datasets: [{
                    label: 'Active Vehicles',
                    data: [420, 380, 290, 110, 40],
                    backgroundColor: 'rgba(255, 94, 0, 0.6)'
                }, {
                    label: 'On-Mission',
                    data: [350, 310, 220, 90, 24],
                    backgroundColor: 'rgba(255, 215, 0, 0.6)'
                }]
            },
            options: chartDefaults
        });
    }

    function initVelocityChart() {
        const ctx = document.getElementById('velocityChart').getContext('2d');
        charts.velocity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                datasets: [{
                    label: 'Missions / Hour',
                    data: [45, 120, 480, 520, 300, 150],
                    borderColor: '#ff5e00',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(255, 94, 0, 0.1)'
                }]
            },
            options: chartDefaults
        });
    }

    function initDepotChart() {
        const ctx = document.getElementById('depotChart').getContext('2d');
        charts.depot = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'In Transit', 'Reserved'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#00ff88', '#ff5e00', '#ffd700'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [45000, 52000, 48000, 61000, 75000, 42000, 38000],
                    borderColor: '#00ff88',
                    tension: 0.4
                }, {
                    label: 'Operating Cost ($)',
                    data: [30000, 31000, 29000, 34000, 38000, 25000, 24000],
                    borderColor: '#ff5e00',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initProfitChart() {
        const ctx = document.getElementById('profitChart').getContext('2d');
        charts.profit = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Sector A', 'Sector B', 'Sector C', 'Sector D'],
                datasets: [{
                    data: [85, 65, 90, 45],
                    backgroundColor: ['rgba(255, 215, 0, 0.5)', 'rgba(0, 255, 136, 0.5)', 'rgba(255, 94, 0, 0.5)', 'rgba(44, 49, 54, 0.5)']
                }]
            },
            options: chartDefaults
        });
    }

    function initExpenseChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        charts.expense = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Maintenance', 'Fuel', 'Personnel', 'Infras.'],
                datasets: [{
                    data: [35, 40, 15, 10],
                    backgroundColor: ['#ffd700', '#ff5e00', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Registrations',
                    data: [1200, 1800, 2400, 3100, 3800, 4200],
                    borderColor: '#ffd700',
                    fill: false
                }]
            },
            options: chartDefaults
        });
    }

    function initRoleDistChart() {
        const ctx = document.getElementById('roleDistChart').getContext('2d');
        charts.roles = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pilots', 'Command', 'Support', 'Admins'],
                datasets: [{
                    data: [70, 15, 10, 5],
                    backgroundColor: ['#ff5e00', '#ffd700', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initRatingChart() {
        const ctx = document.getElementById('ratingChart').getContext('2d');
        charts.ratings = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Safety', 'Speed', 'Efficiency', 'Logistics', 'Tactical'],
                datasets: [{
                    label: 'Avg. Rating',
                    data: [92, 85, 88, 75, 95],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initLatencyChart() {
        const ctx = document.getElementById('latencyChart').getContext('2d');
        charts.latency = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T-50', 'T-40', 'T-30', 'T-20', 'T-10', 'Now'],
                datasets: [{
                    label: 'Uplink (ms)',
                    data: [12, 15, 8, 22, 14, 10],
                    borderColor: '#ffd700',
                    tension: 0.1
                }]
            },
            options: chartDefaults
        });
    }

    function initTrafficDistChart() {
        const ctx = document.getElementById('trafficDistChart').getContext('2d');
        charts.traffic = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['API Hub', 'Satellite Uplink', 'Fleet Proxy', 'Cache'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#ff5e00', '#ffd700', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initNodesLoadChart() {
        const ctx = document.getElementById('nodesLoadChart').getContext('2d');
        charts.nodes = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Node-1', 'Node-2', 'Node-3', 'Node-4', 'Node-5', 'Node-6'],
                datasets: [{
                    label: 'CPU %',
                    data: [45, 62, 88, 30, 42, 55],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: chartDefaults
        });
    }

    function initSupplyChainChart() {
        const ctx = document.getElementById('supplyChainChart').getContext('2d');
        charts.supply = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Throughput Index',
                    data: [82, 85, 92, 88],
                    borderColor: '#00ff88',
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 136, 0.1)'
                }]
            },
            options: chartDefaults
        });
    }

    function initDensityChart() {
        const ctx = document.getElementById('densityChart').getContext('2d');
        charts.density = new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Tactical Hub Density',
                    data: [
                        { x: 10, y: 20, r: 15 }, { x: 30, y: 40, r: 25 },
                        { x: 50, y: 10, r: 10 }, { x: 70, y: 60, r: 20 }
                    ],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: chartDefaults
        });
    }

    function initLogisticsEfficiencyChart() {
        const ctx = document.getElementById('efficiencyChart').getContext('2d');
        charts.efficiency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Route A', 'Route B', 'Route C'],
                datasets: [{
                    label: 'Efficiency %',
                    data: [94, 82, 88],
                    backgroundColor: '#ffd700'
                }]
            },
            options: chartDefaults
        });
    }

    function initIncidentChart() {
        const ctx = document.getElementById('incidentChart').getContext('2d');
        charts.incidents = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Logged Events',
                    data: [12, 5, 45, 120, 85, 30],
                    borderColor: '#ff5e00',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initFleetResourceChart() {
        const ctx = document.getElementById('fleetResourceChart').getContext('2d');
        charts.resources = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Armor', 'Tires', 'Ammo', 'Fuel', 'Medical'],
                datasets: [{
                    label: 'Fleet-wide Stock %',
                    data: [85, 40, 65, 92, 30],
                    backgroundColor: '#00ff88'
                }]
            },
            options: chartDefaults
        });
    }

    // --- New Chart Initializers ---

    function initFuelEfficiencyChart() {
        const ctx = document.getElementById('fuelEfficiencyChart').getContext('2d');
        charts.fuel = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
                datasets: [{
                    label: 'Km / L',
                    data: [8.2, 8.5, 7.9, 9.1, 8.8],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true
                }]
            },
            options: chartDefaults
        });
    }

    function initPilotReadinessChart() {
        const ctx = document.getElementById('pilotReadinessChart').getContext('2d');
        charts.readiness = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Tactical', 'Stamina', 'Skill', 'Response', 'Econ'],
                datasets: [{
                    label: 'Avg Readiness',
                    data: [85, 90, 75, 95, 80],
                    borderColor: '#ff5e00',
                    backgroundColor: 'rgba(255, 94, 0, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initSalesTargetChart() {
        const ctx = document.getElementById('salesTargetChart').getContext('2d');
        charts.sales = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Actual',
                    data: [1.2, 1.5, 1.8, 2.1],
                    backgroundColor: '#ff5e00'
                }, {
                    label: 'Target',
                    data: [1.5, 1.5, 2.0, 2.5],
                    backgroundColor: 'rgba(255,255,255,0.1)'
                }]
            },
            options: chartDefaults
        });
    }

    function initTransVelocityChart() {
        const ctx = document.getElementById('transVelocityChart').getContext('2d');
        charts.transVel = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '06:00', '12:00', '18:00'],
                datasets: [{
                    label: 'TX / Min',
                    data: [120, 450, 890, 600],
                    borderColor: '#00ff88',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initSessionDurationChart() {
        const ctx = document.getElementById('sessionDurationChart').getContext('2d');
        charts.sessions = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mobile', 'Desktop', 'Console', 'API'],
                datasets: [{
                    label: 'Avg Min',
                    data: [12, 45, 120, 5],
                    backgroundColor: '#ffd700'
                }]
            },
            options: chartDefaults
        });
    }

    function initGeoUserChart() {
        const ctx = document.getElementById('geoUserChart').getContext('2d');
        charts.geo = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Urban', 'Rural', 'Industrial', 'Tactical'],
                datasets: [{
                    data: [55, 15, 25, 5],
                    backgroundColor: ['#ff5e00', '#ffd700', '#00ff88', '#2c3136'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initRequestFreqChart() {
        const ctx = document.getElementById('requestFreqChart').getContext('2d');
        charts.reqFreq = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T-60', 'T-40', 'T-20', 'Now'],
                datasets: [{
                    label: 'Req/s',
                    data: [4200, 5800, 3100, 8900],
                    borderColor: '#00ff88',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 136, 0.05)'
                }]
            },
            options: chartDefaults
        });
    }

    function initErrorRateChart() {
        const ctx = document.getElementById('errorRateChart').getContext('2d');
        charts.errors = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T-60', 'T-40', 'T-20', 'Now'],
                datasets: [{
                    label: 'Error %',
                    data: [0.1, 0.5, 0.2, 1.4],
                    borderColor: '#ff5e00',
                    borderDash: [5, 5]
                }]
            },
            options: chartDefaults
        });
    }

    function initDeliveryTimeChart() {
        const ctx = document.getElementById('deliveryTimeChart').getContext('2d');
        charts.delivery = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['<1h', '1-3h', '3-6h', '6h+'],
                datasets: [{
                    label: 'Orders',
                    data: [420, 850, 230, 45],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: chartDefaults
        });
    }

    function initIdleTimeChart() {
        const ctx = document.getElementById('idleTimeChart').getContext('2d');
        charts.idle = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Idle', 'Maintenance'],
                datasets: [{
                    data: [82, 12, 6],
                    backgroundColor: ['#00ff88', '#ffd700', '#ff5e00'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initSeverityDistChart() {
        const ctx = document.getElementById('severityDistChart').getContext('2d');
        charts.severity = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Critical', 'High', 'Medium', 'Low'],
                datasets: [{
                    data: [5, 12, 45, 80],
                    backgroundColor: [
                        'rgba(255, 94, 0, 0.7)',
                        'rgba(255, 215, 0, 0.7)',
                        'rgba(0, 255, 136, 0.7)',
                        'rgba(44, 49, 54, 0.7)'
                    ],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initResponseTimeChart() {
        const ctx = document.getElementById('responseTimeChart').getContext('2d');
        charts.respTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: 'Avg Response Min',
                    data: [18, 15, 12, 11],
                    borderColor: '#ffd700',
                    tension: 0.4
                }]
            },
            options: chartDefaults
        });
    }

    function initGeoAlertChart() {
        const ctx = document.getElementById('geoAlertChart').getContext('2d');
        charts.geoAlert = new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Alert Clusters',
                    data: [
                        { x: 20, y: 30, r: 10 }, { x: 40, y: 10, r: 25 },
                        { x: 10, y: 40, r: 15 }, { x: 50, y: 25, r: 8 }
                    ],
                    backgroundColor: '#ff5e00'
                }]
            },
            options: chartDefaults
        });
    }

    function initResponseLoadChart() {
        const ctx = document.getElementById('responseLoadChart').getContext('2d');
        charts.load = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Team Alpha', 'Team Beta', 'Team Gamma'],
                datasets: [{
                    label: 'Active Cases',
                    data: [4, 8, 2],
                    backgroundColor: '#00ff88'
                }]
            },
            options: chartDefaults
        });
    }

    function initTurnoverChart() {
        const ctx = document.getElementById('turnoverChart').getContext('2d');
        charts.turnover = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Sold', 'In Stock', 'Reserved'],
                datasets: [{
                    data: [45, 40, 15],
                    backgroundColor: ['#00ff88', '#ffd700', '#ff5e00'],
                    borderWidth: 0
                }]
            },
            options: chartDefaults
        });
    }

    function initScrapRateChart() {
        const ctx = document.getElementById('scrapRateChart').getContext('2d');
        charts.scrap = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['M1', 'M2', 'M3', 'M4'],
                datasets: [{
                    label: 'Scrap %',
                    data: [2.1, 1.8, 1.4, 0.9],
                    borderColor: '#ff5e00',
                    fill: false
                }]
            },
            options: chartDefaults
        });
    }

    function initSupplierRadarChart() {
        const ctx = document.getElementById('supplierRadarChart').getContext('2d');
        charts.supplier = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Quality', 'Lead Time', 'Cost', 'Volume', 'Support'],
                datasets: [{
                    label: 'Avg Performance',
                    data: [90, 75, 85, 95, 80],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)'
                }]
            },
            options: chartDefaults
        });
    }

    function initProcureCycleChart() {
        const ctx = document.getElementById('procureCycleChart').getContext('2d');
        charts.procure = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: 'Cycle Days',
                    data: [14, 12, 15, 10],
                    borderColor: '#00ff88',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 136, 0.1)'
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
        if (rtlToggle) {
            const span = rtlToggle.querySelector('span');
            if (span) span.textContent = dir.toUpperCase();
        }
    }

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            currentDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            document.documentElement.dir = currentDir;
            localStorage.setItem('docDir', currentDir);

            // Update text
            updateRTLText(currentDir);

            const activeItem = document.querySelector('.sidebar-nav li.active');
            if (activeItem) {
                const activeView = activeItem.getAttribute('data-view');
                switchView(activeView);
            }
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('dashboard-theme-toggle');
    const body = document.body;

    function updateThemeIcon(isLight) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isLight) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);
        });
    }

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) updateThemeIcon(true);
    }

    // Handle initial direction
    const savedDir = localStorage.getItem('docDir');
    if (savedDir) {
        currentDir = savedDir;
        document.documentElement.dir = currentDir;
        updateRTLText(currentDir);
    }
});
