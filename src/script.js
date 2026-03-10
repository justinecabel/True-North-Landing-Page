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

window.addEventListener('DOMContentLoaded', function () {
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
                    <img src="${vessel.image}" alt="${vessel.text}" width="200" height="150" loading="${loadingStrategy}">
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
                animationId: null
            };

            function setupMarquee() {
                const container = marquee.parentElement;
                const containerWidth = container.offsetWidth;
                const marqueeWidth = marquee.scrollWidth;
                marqueeState.maxOffset = Math.max(0, marqueeWidth - containerWidth);
                marqueeState.pos = 0;
                marqueeState.direction = 1;
                marquee.style.transform = 'translateX(0)';
            }

            marquee.addEventListener('mouseenter', () => marqueeState.speed = 0.25, { passive: true });
            marquee.addEventListener('mouseleave', () => marqueeState.speed = 2, { passive: true });

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
                    marquee.style.transform = `translateX(${-marqueeState.pos}px)`;
                    marqueeState.animationId = requestAnimationFrame(animateMarquee);
                } else if (marqueeState.animationId) {
                    cancelAnimationFrame(marqueeState.animationId);
                    marqueeState.animationId = null;
                }
            }

            setupMarquee();
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (marqueeState.resumeTimeout) clearTimeout(marqueeState.resumeTimeout);
                        marqueeState.resumeTimeout = setTimeout(() => {
                            marqueeState.running = true;
                            if (!marqueeState.animationId) {
                                animateMarquee();
                            }
                        }, 100);
                    } else {
                        marqueeState.running = false;
                        if (marqueeState.resumeTimeout) clearTimeout(marqueeState.resumeTimeout);
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

window.addEventListener('load', function () {
    const overlay = document.getElementById('loading-overlay');
    const facebookModal = document.getElementById('facebook-modal');
    const facebookSectionEmbed = document.querySelector('.facebook-section-embed');
    const facebookSectionVisitBtn = document.querySelector('.facebook-section-visit-btn');
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileBrowser = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const hideFacebookModal = () => {
        if (!facebookModal) return;
        facebookModal.style.display = 'none';
        facebookModal.setAttribute('aria-hidden', 'true');
    };

    if (isMobileBrowser) {
        hideFacebookModal();
        if (facebookSectionEmbed) {
            facebookSectionEmbed.style.display = 'none';
        }
        if (facebookSectionVisitBtn) {
            facebookSectionVisitBtn.style.display = 'inline-flex';
            facebookSectionVisitBtn.style.justifyContent = 'center';
            facebookSectionVisitBtn.style.alignItems = 'center';
        }
    } else if (facebookModal) {
        const modalCloseButton = document.getElementById('facebook-modal-x');
        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', hideFacebookModal);
        }
        facebookModal.addEventListener('click', function (e) {
            if (e.target === facebookModal) {
                hideFacebookModal();
            }
        });
    }

    window.__jsonReadyPromise.finally(() => {
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
        }

        setTimeout(() => {
            if (overlay) {
                overlay.style.display = 'none';
            }
            document.body.classList.add('loaded');
            if (!isMobileBrowser && facebookModal) {
                facebookModal.style.display = 'flex';
                facebookModal.setAttribute('aria-hidden', 'false');
            }
        }, 300);
    });
}, { once: true });

