document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;

    // ── Active Page Highlighting ──────────────────────────────────────────────
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = href.split('/').pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const dropbtn = dropdown.querySelector('.dropbtn');
                if (dropbtn) dropbtn.classList.add('active');
            }
        }
    });

    // ── Theme Toggle (all buttons across all pages) ───────────────────────────
    const THEME_SELECTOR = [
        '#theme-toggle',
        '#theme-toggle-nav',
        '#dashboard-theme-toggle',
        '#dashboard-header-theme-toggle',
        '#auth-theme-toggle'
    ].join(', ');

    const themeToggles = document.querySelectorAll(THEME_SELECTOR);
    const body = document.body;

    function updateThemeIcons(isLight) {
        themeToggles.forEach(t => {
            const icon = t.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon', !isLight);
                icon.classList.toggle('fa-sun',  isLight);
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

    // Restore saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        updateThemeIcons(true);
    }

    // ── RTL Toggle (all buttons across all pages) ─────────────────────────────
    const RTL_SELECTOR = [
        '#rtl-toggle',
        '#rtl-toggle-nav',
        '#dashboard-rtl-toggle',
        '#dashboard-header-rtl-toggle'
    ].join(', ');

    function updateRTLText(dir) {
        document.querySelectorAll(RTL_SELECTOR).forEach(t => {
            const span = t.querySelector('span');
            if (span) span.textContent = dir.toUpperCase();
        });
    }

    document.querySelectorAll(RTL_SELECTOR).forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = html.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            html.setAttribute('dir', newDir);
            html.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
            updateRTLText(newDir);
            localStorage.setItem('docDir', newDir);
        });
    });

    // Restore saved direction
    const savedDir = localStorage.getItem('docDir');
    if (savedDir) {
        html.setAttribute('dir', savedDir);
        html.setAttribute('lang', savedDir === 'rtl' ? 'ar' : 'en');
        updateRTLText(savedDir);
    }

    // ── Scroll Reveal ─────────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Stats Counter Animation ───────────────────────────────────────────────
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.stat-item .number').forEach(counter => {
                    const target = +counter.parentElement.getAttribute('data-count');
                    const update = () => {
                        const count = +counter.innerText;
                        const inc = target / 200;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(update, 1);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    update();
                });
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ── FAQ Accordion ─────────────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
    });

    // ── Mobile Hamburger Menu ─────────────────────────────────────────────────
    const hamburger  = document.querySelector('.hamburger');
    const navLinks   = document.querySelector('.nav-links');
    const mobileControls = document.querySelector('.mobile-nav-controls');

    if (hamburger && navLinks) {
        const openMenu = () => {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            if (mobileControls) mobileControls.classList.add('active');
        };

        const closeMenu = () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            if (mobileControls) mobileControls.classList.remove('active');
            navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        };

        hamburger.addEventListener('click', e => {
            e.stopPropagation();
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', e => {
                const isDropbtn = link.classList.contains('dropbtn');
                const isMobile  = window.innerWidth <= 992;

                if (isDropbtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parent = link.parentElement;
                    navLinks.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== parent) d.classList.remove('active');
                    });
                    parent.classList.toggle('active');
                } else {
                    navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
                    if (isMobile) closeMenu();
                }
            });
        });

        document.addEventListener('click', e => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }
});
