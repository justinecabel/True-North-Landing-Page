const foundedDate = new Date(1997, 7, 24); // August 24, 1997 (month is 0-based)
const today = new Date();
let years = today.getFullYear() - foundedDate.getFullYear();

if (
    today.getMonth() < foundedDate.getMonth() ||
    (today.getMonth() === foundedDate.getMonth() && today.getDate() < foundedDate.getDate())
) {
    years--;
}

window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-GFXY68JSLE');

window.__jsonReadyPromise = Promise.resolve();

function setSystemTheme() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = systemTheme;
}

window.addEventListener('DOMContentLoaded', function () {
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: light)');

    setSystemTheme();
    if (systemThemeQuery.addEventListener) {
        systemThemeQuery.addEventListener('change', setSystemTheme);
    } else {
        systemThemeQuery.addListener(setSystemTheme);
    }
    document.querySelectorAll('img').forEach(img => {
        img.draggable = false;
    });
    const getScrollTop = () => (
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    );
    const updateNavContrast = () => {
        document.body.classList.toggle('nav-scrolled', getScrollTop() > 2);
    };
    let navContrastTicking = false;
    const scheduleNavContrastUpdate = () => {
        if (navContrastTicking) return;
        navContrastTicking = true;
        window.requestAnimationFrame(() => {
            updateNavContrast();
            navContrastTicking = false;
        });
    };
    updateNavContrast();
    window.addEventListener('scroll', scheduleNavContrastUpdate, { passive: true });
    document.addEventListener('scroll', scheduleNavContrastUpdate, { passive: true, capture: true });
    window.addEventListener('resize', updateNavContrast, { passive: true });
    window.setInterval(updateNavContrast, 250);

    const taglines = document.querySelectorAll('.tagline > div');
    let current = 0;

    function showTagline(idx) {
        taglines.forEach((el, i) => {
            el.classList.toggle('active', i === idx);
        });
    }

    function nextTagline() {
        current = (current + 1) % taglines.length;
        showTagline(current);
    }

    function handleTaglineMode() {
        if (window.innerWidth < 900) {
            if (taglines.length > 0) {
                showTagline(0);
                if (!window._taglineInterval) {
                    window._taglineInterval = setInterval(nextTagline, 4000);
                }
            }
        } else {
            taglines.forEach(el => el.classList.add('active'));
            if (window._taglineInterval) {
                clearInterval(window._taglineInterval);
                window._taglineInterval = null;
            }
        }
    }

    handleTaglineMode();
    window.addEventListener('resize', handleTaglineMode);

    const navMsgBtn = document.getElementById('nav-message-us');
    const heroMsgBtn = document.getElementById('message-us');
    if (navMsgBtn && heroMsgBtn) {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                navMsgBtn.style.opacity = '0';
                navMsgBtn.style.pointerEvents = 'none';
            } else {
                navMsgBtn.style.opacity = '1';
                navMsgBtn.style.pointerEvents = '';
            }
        }, { threshold: 0.1 });
        observer.observe(heroMsgBtn);
    }

    const yearsSpan = document.getElementById('years-operating');
    if (yearsSpan) yearsSpan.textContent = years;

    const listPromise = fetch('./json/list.json')
        .then(res => res.json())
        .then(data => {
            const listContainer = document.getElementById('list_accre');
            if (!listContainer) return;
            const fragment = document.createDocumentFragment();

            for (const key in data) {
                const item = data[key];
                if (item.active === 'true') {
                    const img = document.createElement('img');
                    img.src = item.logo;
                    img.alt = `${key} Logo`;
                    img.loading = 'lazy';
                    img.draggable = false;
                    img.style.cursor = 'pointer';
                    img.addEventListener('click', function (e) {
                        e.preventDefault();
                        const modal = document.getElementById('cert-modal');
                        const modalImg = document.getElementById('cert-modal-img');
                        modalImg.src = (item.url && item.url !== '#') ? item.url : item.logo;
                        modalImg.alt = img.alt;
                        modalImg.style.display = 'block';
                        modal.style.display = 'flex';
                    });
                    fragment.appendChild(img);
                }
            }

            listContainer.appendChild(fragment);
            const modal = document.getElementById('cert-modal');
            const modalClose = document.getElementById('cert-modal-close');
            modalClose.onclick = function () {
                modal.style.display = 'none';
                document.getElementById('cert-modal-img').src = '';
            };
            modal.onclick = function (e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.getElementById('cert-modal-img').src = '';
                }
            };
        })
        .catch(error => console.error('Error loading accreditations:', error));

    const vesselPromise = fetch('./json/vessel.json')
        .then(res => res.json())
        .then(data => {
            let principals = Object.entries(data);
            for (let i = principals.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [principals[i], principals[j]] = [principals[j], principals[i]];
            }

            const vessels = principals.flatMap(([principal, vesselsObj]) =>
                Object.values(vesselsObj).map(vessel => ({ ...vessel, principal }))
            );

            const marquee = document.querySelector('#hm1 .marquee');
            if (!marquee || vessels.length === 0) return;
            const fragment = document.createDocumentFragment();

            vessels.forEach((vessel, index) => {
                const item = document.createElement('div');
                item.className = 'item';
                const loadingStrategy = index < 3 ? 'eager' : 'lazy';
                item.innerHTML = `
                    <img src="${vessel.image}" alt="${vessel.text}" width="200" height="150" loading="${loadingStrategy}" draggable="false">
                    <span class="vessel-details hidden">IMO: ${vessel.desc.imo}<br>GRT: ${vessel.desc.grt}<br>Type: ${vessel.desc.type}<br>Flag: ${vessel.desc.flag}<br>Built: ${vessel.desc.built}</span>
                    <span class="name">${vessel.text}</span>
                `;
                fragment.appendChild(item);
            });
            marquee.appendChild(fragment);

            const marqueeState = {
                pos: 0,
                direction: 1,
                speed: 2,
                running: false,
                maxOffset: 0,
                resumeTimeout: null,
                animationId: null,
                isInView: false,
                isPointerDown: false,
                dragStartX: 0,
                dragStartPos: 0
            };
            const marqueeContainer = marquee.parentElement;
            const resumeDelay = 2500;

            function clampMarqueePosition(value) {
                return Math.min(Math.max(value, 0), marqueeState.maxOffset);
            }

            function applyMarqueePosition(value) {
                marqueeState.pos = clampMarqueePosition(value);
                marquee.style.transform = `translateX(${-marqueeState.pos}px)`;
            }

            function stopMarquee() {
                marqueeState.running = false;
                if (marqueeState.resumeTimeout) {
                    clearTimeout(marqueeState.resumeTimeout);
                    marqueeState.resumeTimeout = null;
                }
                if (marqueeState.animationId) {
                    cancelAnimationFrame(marqueeState.animationId);
                    marqueeState.animationId = null;
                }
            }

            function startMarquee(delay = 0) {
                if (!marqueeState.isInView || marqueeState.maxOffset <= 0 || marqueeState.isPointerDown) return;
                if (marqueeState.resumeTimeout) clearTimeout(marqueeState.resumeTimeout);
                marqueeState.resumeTimeout = setTimeout(() => {
                    marqueeState.resumeTimeout = null;
                    if (!marqueeState.isInView || marqueeState.isPointerDown) return;
                    marqueeState.running = true;
                    if (!marqueeState.animationId) {
                        animateMarquee();
                    }
                }, delay);
            }

            function resumeMarqueeAfterDelay() {
                startMarquee(resumeDelay);
            }

            function setupMarquee() {
                const containerWidth = marqueeContainer.offsetWidth;
                const marqueeWidth = marquee.scrollWidth;
                marqueeState.maxOffset = Math.max(0, marqueeWidth - containerWidth);
                applyMarqueePosition(marqueeState.pos);
            }

            marquee.addEventListener('mouseenter', () => marqueeState.speed = 0.25, { passive: true });
            marquee.addEventListener('mouseleave', () => marqueeState.speed = 2, { passive: true });

            function beginManualScroll(clientX) {
                stopMarquee();
                marqueeState.isPointerDown = true;
                marqueeState.dragStartX = clientX;
                marqueeState.dragStartPos = marqueeState.pos;
                marqueeContainer.classList.add('is-dragging');
            }

            function updateManualScroll(clientX) {
                if (!marqueeState.isPointerDown) return;
                const dragDistance = clientX - marqueeState.dragStartX;
                applyMarqueePosition(marqueeState.dragStartPos - dragDistance);
            }

            function endManualScroll() {
                if (!marqueeState.isPointerDown) return;
                marqueeState.isPointerDown = false;
                marqueeContainer.classList.remove('is-dragging');
                resumeMarqueeAfterDelay();
            }

            marqueeContainer.addEventListener('pointerdown', (event) => {
                if (event.button !== 0 && event.pointerType === 'mouse') return;
                beginManualScroll(event.clientX);
                marqueeContainer.setPointerCapture(event.pointerId);
                event.preventDefault();
            });
            marqueeContainer.addEventListener('pointermove', (event) => {
                updateManualScroll(event.clientX);
                if (marqueeState.isPointerDown) event.preventDefault();
            });

            function endPointerScroll(event) {
                if (marqueeContainer.hasPointerCapture(event.pointerId)) {
                    marqueeContainer.releasePointerCapture(event.pointerId);
                }
                endManualScroll();
            }

            marqueeContainer.addEventListener('pointerup', endPointerScroll);
            marqueeContainer.addEventListener('pointercancel', endPointerScroll);
            marqueeContainer.addEventListener('mousedown', (event) => {
                if (event.button !== 0) return;
                beginManualScroll(event.clientX);
                event.preventDefault();
            });
            window.addEventListener('mousemove', (event) => {
                updateManualScroll(event.clientX);
                if (marqueeState.isPointerDown) event.preventDefault();
            });
            window.addEventListener('mouseup', endManualScroll);
            marqueeContainer.addEventListener('touchstart', (event) => {
                if (event.touches.length !== 1) return;
                beginManualScroll(event.touches[0].clientX);
            }, { passive: true });
            marqueeContainer.addEventListener('touchmove', (event) => {
                if (event.touches.length !== 1) return;
                updateManualScroll(event.touches[0].clientX);
                if (marqueeState.isPointerDown) event.preventDefault();
            }, { passive: false });
            marqueeContainer.addEventListener('touchend', endManualScroll);
            marqueeContainer.addEventListener('touchcancel', endManualScroll);
            window.addEventListener('resize', () => {
                setupMarquee();
                if (marqueeState.isInView && !marqueeState.running) {
                    resumeMarqueeAfterDelay();
                }
            }, { passive: true });

            function animateMarquee() {
                if (marqueeState.running && marqueeState.maxOffset > 0) {
                    marqueeState.pos += marqueeState.speed * marqueeState.direction;
                    if (marqueeState.pos > marqueeState.maxOffset) {
                        marqueeState.pos = marqueeState.maxOffset;
                        marqueeState.direction = -1;
                    }
                    if (marqueeState.pos < 0) {
                        marqueeState.pos = 0;
                        marqueeState.direction = 1;
                    }
                    applyMarqueePosition(marqueeState.pos);
                    marqueeState.animationId = requestAnimationFrame(animateMarquee);
                } else if (marqueeState.animationId) {
                    cancelAnimationFrame(marqueeState.animationId);
                    marqueeState.animationId = null;
                }
            }

            setupMarquee();
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    marqueeState.isInView = entry.isIntersecting;
                    if (entry.isIntersecting) {
                        startMarquee(100);
                    } else {
                        stopMarquee();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(document.querySelector('#hm1'));
            window.addEventListener('beforeunload', () => {
                observer.disconnect();
                if (marqueeState.animationId) {
                    cancelAnimationFrame(marqueeState.animationId);
                }
                if (marqueeState.resumeTimeout) {
                    clearTimeout(marqueeState.resumeTimeout);
                }
            });
        })
        .catch(error => console.error('Error loading vessels:', error));

    const tnmcPromise = fetch('./json/tnmc.json')
        .then(response => response.json())
        .then(data => {
            const updates = [
                ['hero-text', data['hero-text'], 'textContent'],
                ['tagline-1', data['tagline-1'], 'textContent'],
                ['tagline-2', data['tagline-2'], 'textContent'],
                ['tagline-3', data['tagline-3'], 'textContent'],
                ['.company_profile #text', data.company_profile, 'innerHTML'],
                ['vision_c', data.vision, 'innerHTML'],
                ['mission_c', data.mission, 'innerHTML']
            ];

            updates.forEach(([selector, content, method]) => {
                const element = selector.startsWith('.')
                    ? document.querySelector(selector)
                    : document.getElementById(selector);
                if (element && content) {
                    element[method] = content;
                }
            });
        })
        .catch(error => console.error('Error loading TNMC data:', error));

    window.__jsonReadyPromise = Promise.allSettled([listPromise, vesselPromise, tnmcPromise]);
    window.__jsonReadyPromise.finally(() => {
        document.body.classList.add('loaded');
    });

    const facebookSectionEmbed = document.querySelector('.facebook-section-embed');
    const facebookSectionVisitBtn = document.querySelector('.facebook-section-visit-btn');
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileBrowser = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobileBrowser) {
        if (facebookSectionEmbed) {
            facebookSectionEmbed.style.display = 'none';
        }
        if (facebookSectionVisitBtn) {
            facebookSectionVisitBtn.style.display = 'inline-flex';
            facebookSectionVisitBtn.style.justifyContent = 'center';
            facebookSectionVisitBtn.style.alignItems = 'center';
        }
    }

    document.querySelectorAll('#nav-message-us, #message-us').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileByAgent = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

            if (isMobileByAgent) {
                document.querySelector('.footer').scrollIntoView();
            } else {
                document.querySelector('.footer').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const footer = document.querySelector('.footer');
    const titleContactButton = document.getElementById('nav-message-us');
    if (footer && titleContactButton) {
        const toggleTitleButton = (isFooterVisible) => {
            titleContactButton.style.display = isFooterVisible ? 'none' : '';
            titleContactButton.setAttribute('aria-hidden', isFooterVisible ? 'true' : 'false');
        };

        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                toggleTitleButton(entry.isIntersecting);
            });
        }, { threshold: 0.2 });

        footerObserver.observe(footer);
    }
});
