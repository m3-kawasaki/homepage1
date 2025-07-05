document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            navList.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked (for mobile)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navList.classList.remove('active');
                }
            });
        });
    }
});
