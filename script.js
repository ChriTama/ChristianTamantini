// ============================================
// MOBILE NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for items in grids
            if (entry.target.parentElement.classList.contains('research-areas-grid') ||
                entry.target.parentElement.classList.contains('projects-grid') ||
                entry.target.parentElement.classList.contains('publications-grid') ||
                entry.target.parentElement.classList.contains('skills-grid')) {
                
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll(`
        .research-area-card,
        .project-card,
        .publication-item,
        .publication-card,
        .highlight-item,
        .contact-item,
        .skill-category,
        .award-item,
        .collaboration-card,
        .profile-card,
        .stat-item,
        .impact-stat
    `);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const privacy = formData.get('privacy');

        // Validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        if (!privacy) {
            showNotification('Please accept the privacy policy.', 'error');
            return;
        }

        // Submit button state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Invia la mail tramite EmailJS (o servizio simile)
        // Sostituisci 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_USER_ID' con i tuoi dati EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            privacy: privacy,
            to_email: 'christian.tamantini@cnr.it'
        }, 'YOUR_USER_ID')
        .then(() => {
            showNotification('Thank you for your message! I will respond as soon as possible.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch(() => {
            showNotification('There was an error sending your message. Please try again later.', 'error');
            submitBtn.innerHTML = originalHTML;
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 24px;
            max-width: 400px;
            background: white;
            padding: 1.25rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            border-left: 4px solid;
        }
        
        .notification-success {
            border-left-color: #22c55e;
        }
        
        .notification-error {
            border-left-color: #ef4444;
        }
        
        .notification-info {
            border-left-color: #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.25rem;
        }
        
        .notification-success i {
            color: #22c55e;
        }
        
        .notification-error i {
            color: #ef4444;
        }
        
        .notification-info i {
            color: #3b82f6;
        }
        
        .notification-content span {
            color: #1e293b;
            font-size: 0.9375rem;
            line-height: 1.5;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.15s;
        }
        
        .notification-close:hover {
            background: #f1f5f9;
            color: #1e293b;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        @media (max-width: 480px) {
            .notification {
                left: 16px;
                right: 16px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', '');
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const number = entry.target.textContent.replace(/[^0-9]/g, '');
            const suffix = entry.target.textContent.replace(/[0-9]/g, '');
            entry.target.dataset.suffix = suffix;
            animateCounter(entry.target, parseInt(number));
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => statObserver.observe(stat));
});

// ============================================
// PAGE TRANSITION EFFECT
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add smooth page transitions
    const links = document.querySelectorAll('a[href^="index.html"], a[href^="about.html"], a[href^="research.html"], a[href^="publications.html"], a[href^="contact.html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for external links or anchors
            if (href.includes('#') || this.target === '_blank') {
                return;
            }
            
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease-out';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    // Observe lazy images (add data-src attribute to images for lazy loading)
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// TOOLTIP FUNCTIONALITY
// ============================================
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        let tooltip;
        
        trigger.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tooltip');
            
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const triggerRect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + 'px';
            tooltip.style.top = triggerRect.top - tooltipRect.height - 10 + 'px';
            
            setTimeout(() => tooltip.classList.add('visible'), 10);
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
    
    // Add tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .tooltip {
            position: fixed;
            background: #1e293b;
            color: white;
            padding: 0.5rem 0.875rem;
            border-radius: 8px;
            font-size: 0.875rem;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-5px);
            transition: opacity 0.2s, transform 0.2s;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }
        
        .tooltip.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #1e293b;
        }
    `;
    
    if (!document.querySelector('style[data-tooltip-styles]')) {
        style.setAttribute('data-tooltip-styles', '');
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initTooltips);

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.125rem;
            box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(34, 197, 94, 0.4);
        }
        
        .back-to-top:active {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 1.5rem;
                right: 1.5rem;
                width: 44px;
                height: 44px;
            }
        }
    `;
    
    if (!document.querySelector('style[data-backtotop-styles]')) {
        style.setAttribute('data-backtotop-styles', '');
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initBackToTop);

// ============================================
// ENHANCED BUTTON RIPPLE EFFECT
// ============================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-ripple-styles]')) {
        style.setAttribute('data-ripple-styles', '');
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initRippleEffect);

// ============================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ============================================
function initCopyToClipboard() {
    const emailElements = document.querySelectorAll('.contact-item p, .footer-section p');
    
    emailElements.forEach(element => {
        const text = element.textContent.trim();
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        
        if (emailRegex.test(text)) {
            element.style.cursor = 'pointer';
            element.title = 'Click to copy email';
            
            element.addEventListener('click', function() {
                const email = text.match(emailRegex)[0];
                
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!', 'success');
                }).catch(() => {
                    showNotification('Failed to copy email', 'error');
                });
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initCopyToClipboard);

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / 600);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initParallax);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply optimizations to scroll handlers
const optimizedScroll = throttle(() => {
    // Your scroll logic here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .skip-link {
            position: absolute;
            top: -100px;
            left: 0;
            background: #22c55e;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            font-weight: 600;
            z-index: 10001;
            border-radius: 0 0 8px 0;
        }
        
        .skip-link:focus {
            top: 0;
            outline: 3px solid #16a34a;
            outline-offset: 2px;
        }
    `;
    
    if (!document.querySelector('style[data-accessibility-styles]')) {
        style.setAttribute('data-accessibility-styles', '');
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initAccessibility);

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Hello! ', 'background: #22c55e; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%cInterested in the code? Check out the source or get in touch!', 'font-size: 14px; color: #64748b;');