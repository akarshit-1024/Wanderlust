class ResponsiveNavbar {
    constructor() {
        this.navWrapper = document.getElementById('navWrapper');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.toggleSwitch = document.getElementById('toggleSwitch');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.scrollStep = 200;
        this.isToggleActive = false;

        this.init();
    }

    init() {
        this.calculateScrollStep();
        this.updateButtonStates();
        this.attachEventListeners();
    }

    calculateScrollStep() {
        // Dynamic scroll step based on container width
        const containerWidth = this.navWrapper.clientWidth;
        this.scrollStep = Math.max(150, Math.round(containerWidth * 0.7));
    }

    isAtStart() {
        return this.navWrapper.scrollLeft <= 5;
    }

    isAtEnd() {
        const maxScroll = this.navWrapper.scrollWidth - this.navWrapper.clientWidth;
        return this.navWrapper.scrollLeft >= maxScroll - 5;
    }

    updateButtonStates() {
        // Update previous button
        const atStart = this.isAtStart();
        this.prevBtn.classList.toggle('hidden', atStart);
        this.prevBtn.disabled = atStart;

        // Update next button
        const atEnd = this.isAtEnd();
        this.nextBtn.disabled = atEnd;
        this.nextBtn.classList.toggle('hidden', atEnd);
    }

    scrollNavigation(direction) {
        const scrollAmount = direction === 'next' ? this.scrollStep : -this.scrollStep;
        this.navWrapper.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    togglePriceDisplay() {
        this.isToggleActive = !this.isToggleActive;
        this.toggleSwitch.classList.toggle('active', this.isToggleActive);

        const priceElements = document.querySelectorAll('.price-gst');
        priceElements.forEach(element => {
            element.style.display = this.isToggleActive ? 'inline' : 'none';
        });
    }

    setActiveNavItem(clickedLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    attachEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => {
            this.scrollNavigation('prev');
        });

        this.nextBtn.addEventListener('click', () => {
            this.scrollNavigation('next');
        });

        // Scroll event
        this.navWrapper.addEventListener('scroll', () => {
            this.updateButtonStates();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.calculateScrollStep();
            this.updateButtonStates();
        });

        // Toggle switch
        this.toggleSwitch.addEventListener('click', () => {
            this.togglePriceDisplay();
        });

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveNavItem(link);

                // Optional: Scroll clicked item into view
                link.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;

        this.navWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.navWrapper.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;

            // Prevent vertical scrolling when swiping horizontally
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        });
    }
}

// Initialize the navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveNavbar();
});
