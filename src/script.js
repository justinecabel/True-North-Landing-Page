
// Check production mode and redirect if in dev
fetch('./json/prod.json')
    .then(response => response.json())
    .then(data => {
        if (data.mode === 'dev') {
            window.location.href = './pages/underconstruction.html';
        }
    })
    .catch(error => {
        console.error('Error checking production mode:', error);
        // If there's an error loading the JSON, you might want to redirect to construction page as a fallback
        // window.location.href = './pages/underconstruction.html';
    });


window.addEventListener('DOMContentLoaded', function() {
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
    // Only run the rotator on mobile (width < 900px)
    function handleTaglineMode() {
        if (window.innerWidth < 900) {
            if (taglines.length > 0) {
                showTagline(0);
                if (!window._taglineInterval) {
                    window._taglineInterval = setInterval(nextTagline, 4000);
                }
            }
        } else {
            // Show all taglines, remove .active
            taglines.forEach(el => el.classList.add('active'));
            if (window._taglineInterval) {
                clearInterval(window._taglineInterval);
                window._taglineInterval = null;
            }
        }
    }
    handleTaglineMode();
    window.addEventListener('resize', handleTaglineMode);

    // Hide nav Message Us button when hero button is visible
    const navMsgBtn = document.getElementById('nav-message-us');
    const heroMsgBtn = document.getElementById('message-us');
    if (navMsgBtn && heroMsgBtn) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    navMsgBtn.style.opacity = '0';
                    navMsgBtn.style.pointerEvents = 'none';
                } else {
                    navMsgBtn.style.opacity = '1';
                    navMsgBtn.style.pointerEvents = '';
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(heroMsgBtn);
    }
});

