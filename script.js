document.addEventListener('DOMContentLoaded', () => {
    const rtlToggle = document.getElementById('rtl-toggle');
    const html = document.documentElement;

    // Active Page Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-links a');

    navLinksList.forEach(link => {
        // Remove existing active class
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (!href) return;

        const linkPath = href.split('/').pop();
        
        // Match path
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
            
            // Highlight parent dropdown if exists
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const dropbtn = dropdown.querySelector('.dropbtn');
                if (dropbtn) dropbtn.classList.add('active');
            }
        }
    });

    // Theme Toggle Logic
    const themeToggles = document.querySelectorAll('#theme-toggle, #dashboard-theme-toggle, #auth-theme-toggle');
    const body = document.body;

    function updateThemeIcons(isLight) {
        themeToggles.forEach(t => {
            const icon = t.querySelector('i');
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

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcons(isLight);
        });
    });

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcons(true);
    }

    // RTL Toggle Logic
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            html.setAttribute('dir', newDir);
            html.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');

            // Save preference
            localStorage.setItem('dir', newDir);
        });
    }

    // Check saved RTL preference
    const savedDir = localStorage.getItem('dir');
    if (savedDir) {
        html.setAttribute('dir', savedDir);
        html.setAttribute('lang', savedDir === 'rtl' ? 'ar' : 'en');
    }

    // Scroll Animations (Basic implementation)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Stats Counter Animation
    const statsSection = document.getElementById('stats');
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.stat-item .number').forEach(counter => {
                const target = +counter.parentElement.getAttribute('data-count');
                const updateCount = () => {
                    const count = +counter.innerText;
                    const speed = 200;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    // FAQ Interactions
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu/toggle dropdowns when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isDropdown = link.classList.contains('dropbtn');
                const isMobile = window.innerWidth <= 992;

                if (isDropdown) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parent = link.parentElement;

                    // Close other dropdowns
                    navLinks.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== parent) d.classList.remove('active');
                    });

                    parent.classList.toggle('active');
                } else {
                    // Selection made or normal link clicked
                    // Close all dropdowns
                    navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));

                    if (isMobile) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            });
        });

        // Close dropdowns/menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = navLinks.contains(e.target);
            const isClickOnHamburger = hamburger.contains(e.target);

            if (!isClickInsideMenu && !isClickOnHamburger) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    }
});
