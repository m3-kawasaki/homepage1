// awatake ホームページ — メニュー・スクロール演出・数字カウント

document.addEventListener('DOMContentLoaded', function () {

    // ----- モバイルメニューの開閉 -----
    var menuToggle = document.querySelector('.menu-toggle');
    var navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function () {
            var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            navList.classList.toggle('active');
        });

        // メニュー項目を選んだら閉じる
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
            });
        });
    }

    // ----- スクロールでヘッダーに影をつける -----
    var header = document.getElementById('site-header') || document.querySelector('.site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ----- スクロールに合わせてふわっと表示 -----
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0 && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(function (el, i) {
            el.style.transitionDelay = (i % 3) * 0.12 + 's';
            revealObserver.observe(el);
        });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    // ----- ヒーローの数字カウントアップ -----
    var counters = document.querySelectorAll('.stat-num[data-count]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function formatNum(value, target) {
        return target >= 1000 ? value.toLocaleString('ja-JP') : String(value);
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) { return; }
        if (reduceMotion) {
            el.textContent = formatNum(target, target);
            return;
        }
        var duration = 1600;
        var start = null;
        function step(timestamp) {
            if (!start) { start = timestamp; }
            var progress = Math.min((timestamp - start) / duration, 1);
            // ゆっくり止まるイージング
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = formatNum(Math.round(target * eased), target);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // ----- 図解プロフィールのライトボックス（拡大表示） -----
    var zukaiOpen = document.getElementById('zukai-open');
    var zukaiLightbox = document.getElementById('zukai-lightbox');
    var zukaiClose = document.getElementById('zukai-close');

    if (zukaiOpen && zukaiLightbox && zukaiClose) {
        var openLightbox = function (e) {
            e.preventDefault();
            zukaiLightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            zukaiClose.focus();
        };
        var closeLightbox = function () {
            zukaiLightbox.hidden = true;
            document.body.style.overflow = '';
            zukaiOpen.focus();
        };

        zukaiOpen.addEventListener('click', openLightbox);
        zukaiClose.addEventListener('click', closeLightbox);

        // 画像の外側（背景）をクリックしたら閉じる
        zukaiLightbox.addEventListener('click', function (e) {
            if (e.target === zukaiLightbox) {
                closeLightbox();
            }
        });

        // Escキーでも閉じる
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !zukaiLightbox.hidden) {
                closeLightbox();
            }
        });
    }

    if (counters.length > 0 && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
        counters.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            if (!isNaN(target)) {
                el.textContent = formatNum(target, target);
            }
        });
    }
});
