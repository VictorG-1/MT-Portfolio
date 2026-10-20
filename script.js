// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Use the image-based presentation viewer for every portfolio deck. It is lighter
// than the original PDFs and works consistently in Safari on macOS and iOS.
const presentationLinks = {
    'celine-intemporel.pdf': 'celine',
    'carcamo-brand-campaign.pdf': 'carcamo',
    'confiserie-packaging.pdf': 'confiserie',
    'bazaar-digital-experience.pdf': 'bazaar',
    'tiffany-repositioning.pdf': 'tiffany',
    'globe-trotter-campaign.pdf': 'globe-trotter',
    'ferragamo-trendbook-part-1.pdf': 'ferragamo',
    'ferragamo-trend-forecast-part-2.pdf': 'ferragamo'
};

document.querySelectorAll('.portfolio-factfile a[href$=".pdf"]').forEach((link) => {
    const originalFile = link.getAttribute('href').split('/').pop();
    const deck = presentationLinks[originalFile];
    if (!deck) return;
    link.href = `presentation.html?deck=${deck}`;
    link.removeAttribute('target');
    link.textContent = deck === 'ferragamo' ? 'View full presentation ↗' : 'View presentation ↗';
});

// Portfolio fact files: change PDF slide previews with manual controls.
document.querySelectorAll('.portfolio-project-card').forEach((card) => {
    const stage = card.querySelector('.portfolio-slide-stage');
    const preview = stage?.querySelector('img.is-active');
    const sourceMatch = preview?.getAttribute('src').match(/Slides\/([^/]+)\/slide-\d+\.jpg$/);
    if (!stage || !preview || !sourceMatch) return;

    const slideSets = {
        celine: [{ folder: 'celine', count: 61 }],
        carcamo: [{ folder: 'carcamo', count: 41 }],
        confiserie: [{ folder: 'confiserie', count: 25 }],
        bazaar: [{ folder: 'bazaar', count: 87 }],
        tiffany: [{ folder: 'tiffany', count: 45 }],
        'globe-trotter': [{ folder: 'globe-trotter', count: 71 }],
        'ferragamo-part-1': [
            { folder: 'ferragamo-part-1', count: 24 },
            { folder: 'ferragamo-part-2', count: 32 }
        ]
    };
    const segments = slideSets[sourceMatch[1]];
    if (!segments) return;

    const totalSlides = segments.reduce((total, segment) => total + segment.count, 0);
    stage.querySelectorAll('img:not(.is-active)').forEach((image) => image.remove());
    let activeSlide = 0;
    const counter = document.createElement('span');
    counter.className = 'portfolio-slide-counter';
    counter.setAttribute('aria-live', 'polite');
    stage.append(counter);

    const slideSource = (index) => {
        let slideNumber = index;
        for (const segment of segments) {
            if (slideNumber < segment.count) {
                return `Assets/Portfolio Presentations/Slides/${segment.folder}/slide-${String(slideNumber + 1).padStart(2, '0')}.jpg`;
            }
            slideNumber -= segment.count;
        }
        return preview.src;
    };

    const showSlide = (index) => {
        activeSlide = (index + totalSlides) % totalSlides;
        preview.classList.remove('is-active');
        preview.src = slideSource(activeSlide);
        preview.alt = `Presentation slide ${activeSlide + 1} of ${totalSlides}`;
        preview.classList.add('is-active');
        counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    };

    showSlide(0);

    card.querySelector('[data-slide-prev]')?.addEventListener('click', (event) => {
        event.stopPropagation();
        showSlide(activeSlide - 1);
    });
    card.querySelector('[data-slide-next]')?.addEventListener('click', (event) => {
        event.stopPropagation();
        showSlide(activeSlide + 1);
    });
});

// Styling page: scroll the behind-the-scenes media carousel by one card.
document.querySelectorAll('[data-bts-carousel]').forEach((track) => {
    const section = track.closest('.styling-bts');
    const previous = section?.querySelector('[data-bts-carousel-prev]');
    const next = section?.querySelector('[data-bts-carousel-next]');
    const step = () => {
        const firstCard = track.firstElementChild;
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 300;
        return cardWidth + 16;
    };
    const move = (direction) => {
        track.scrollTo({ left: track.scrollLeft + (direction * step()), behavior: 'smooth' });
    };

    if (previous) previous.addEventListener('click', () => move(-1));
    if (next) next.addEventListener('click', () => move(1));
});

// Portfolio carousel controls
document.querySelectorAll('[data-portfolio-carousel]').forEach(track => {
    const section = track.closest('.portfolio-carousel-section');
    const previous = section?.querySelector('[data-portfolio-prev]');
    const next = section?.querySelector('[data-portfolio-next]');
    const distance = () => Math.max(track.clientWidth * 0.78, 280);

    previous?.addEventListener('click', () => track.scrollBy({ left: -distance(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: distance(), behavior: 'smooth' }));
});

// Portfolio Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.work-item, .portfolio-item, .gallery-item, .skill-item, .timeline-item, .resume-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        // Simple validation
        if (name && email && message) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Prepare email content
            const toEmail = 'maheethakkar20@gmail.com';
            const subject = encodeURIComponent('Contact Form Submission from Portfolio');
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`
            );

            // Create mailto link
            const mailtoLink = `mailto:${toEmail}?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Your email client should open now. If it doesn\'t, please email me directly at maheethakkar20@gmail.com');
            
            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Navbar Background on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    lastScroll = currentScroll;
});

// Portfolio Item Hover Effects
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Gallery Item Click Handler (for future lightbox functionality)
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        // Future: Open lightbox/modal with full-size image
        console.log('Gallery item clicked - lightbox functionality can be added here');
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroImage.style.opacity = `${1 - scrolled / window.innerHeight}`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard Navigation for Accessibility
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

// Prevent FOUC (Flash of Unstyled Content)
document.documentElement.style.visibility = 'hidden';
window.addEventListener('load', () => {
    document.documentElement.style.visibility = 'visible';
});

// Carousel Functionality
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const currentSlideEl = document.getElementById('currentSlide');
const totalSlidesEl = document.getElementById('totalSlides');

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

if (totalSlidesEl) {
    totalSlidesEl.textContent = String(totalSlides).padStart(2, '0');
}

// Initialize first slide
if (slides.length > 0) {
    slides[0].classList.add('active');
}

function updateCarousel() {
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update active slide
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update counter
    if (currentSlideEl) {
        currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (carouselTrack) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});

// Auto-play (optional - can be disabled)
let autoPlayInterval;
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Start auto-play on load
if (carouselTrack) {
    startAutoPlay();
    
    // Pause on hover
    const carouselWrapper = carouselTrack.closest('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
    }
}

// Video Mute/Unmute Functionality
// Video controls for home page
const trendVideo = document.getElementById('trendVideo');
const muteBtn = document.getElementById('muteBtn');
const muteIcon = document.getElementById('muteIcon');
const muteLine = document.getElementById('muteLine');

if (trendVideo && muteBtn) {
    // Initialize video as muted
    trendVideo.muted = true;
    muteBtn.classList.add('muted');
    if (muteLine) muteLine.style.opacity = '1';
    
    // Mute/Unmute toggle
    muteBtn.addEventListener('click', () => {
        if (trendVideo.muted) {
            trendVideo.muted = false;
            muteBtn.classList.remove('muted');
            if (muteLine) muteLine.style.opacity = '0';
        } else {
            trendVideo.muted = true;
            muteBtn.classList.add('muted');
            if (muteLine) muteLine.style.opacity = '1';
        }
    });
    
    // Update button state when video volume changes
    trendVideo.addEventListener('volumechange', () => {
        if (trendVideo.muted || trendVideo.volume === 0) {
            muteBtn.classList.add('muted');
            if (muteLine) muteLine.style.opacity = '1';
        } else {
            muteBtn.classList.remove('muted');
            if (muteLine) muteLine.style.opacity = '0';
        }
    });
}

// Video controls for portfolio page
const trendVideoPortfolio = document.getElementById('trendVideoPortfolio');
const muteBtnPortfolio = document.getElementById('muteBtnPortfolio');
const muteIconPortfolio = document.getElementById('muteIconPortfolio');
const muteLinePortfolio = document.getElementById('muteLinePortfolio');
const videoPlayBtnPortfolio = document.getElementById('videoPlayBtnPortfolio');
const videoPlayOverlayPortfolio = document.getElementById('videoPlayOverlayPortfolio');
const videoWrapperPortfolio = document.querySelector('.video-wrapper');

if (trendVideoPortfolio && muteBtnPortfolio) {
    // Initialize video as muted
    trendVideoPortfolio.muted = true;
    muteBtnPortfolio.classList.add('muted');
    if (muteLinePortfolio) muteLinePortfolio.style.opacity = '1';
    
    // Play button functionality
    if (videoPlayBtnPortfolio && videoPlayOverlayPortfolio) {
        videoPlayBtnPortfolio.addEventListener('click', (e) => {
            e.stopPropagation();
            trendVideoPortfolio.play();
        });
        
        videoPlayOverlayPortfolio.addEventListener('click', (e) => {
            if (e.target === videoPlayOverlayPortfolio) {
                trendVideoPortfolio.play();
            }
        });
    }
    
    // Hide play overlay when video starts playing
    trendVideoPortfolio.addEventListener('play', () => {
        if (videoPlayOverlayPortfolio) {
            videoPlayOverlayPortfolio.classList.add('hidden');
        }
        if (videoWrapperPortfolio) {
            videoWrapperPortfolio.classList.add('playing');
        }
    });
    
    // Show play overlay when video is paused
    trendVideoPortfolio.addEventListener('pause', () => {
        if (videoPlayOverlayPortfolio) {
            videoPlayOverlayPortfolio.classList.remove('hidden');
        }
        if (videoWrapperPortfolio) {
            videoWrapperPortfolio.classList.remove('playing');
        }
    });
    
    // Mute/Unmute toggle
    muteBtnPortfolio.addEventListener('click', () => {
        if (trendVideoPortfolio.muted) {
            trendVideoPortfolio.muted = false;
            muteBtnPortfolio.classList.remove('muted');
            if (muteLinePortfolio) muteLinePortfolio.style.opacity = '0';
        } else {
            trendVideoPortfolio.muted = true;
            muteBtnPortfolio.classList.add('muted');
            if (muteLinePortfolio) muteLinePortfolio.style.opacity = '1';
        }
    });
    
    // Update button state when video volume changes
    trendVideoPortfolio.addEventListener('volumechange', () => {
        if (trendVideoPortfolio.muted || trendVideoPortfolio.volume === 0) {
            muteBtnPortfolio.classList.add('muted');
            if (muteLinePortfolio) muteLinePortfolio.style.opacity = '1';
        } else {
            muteBtnPortfolio.classList.remove('muted');
            if (muteLinePortfolio) muteLinePortfolio.style.opacity = '0';
        }
    });
}

// BTS Carousel Functionality
const btsMainTrack = document.getElementById('btsMainTrack');
const btsThumbnailsTrack = document.getElementById('btsThumbnailsTrack');
const btsThumbnails = document.querySelectorAll('.bts-thumbnail');
const btsMainSlideGroups = document.querySelectorAll('.bts-main-slide-group');
const btsMainVideos = document.querySelectorAll('.bts-main-video');
const btsPrevBtn = document.getElementById('btsPrevBtn');
const btsNextBtn = document.getElementById('btsNextBtn');

let currentBtsGroupIndex = 0;
const itemsPerGroup = 3;
const totalItems = 11; // Total number of BTS items
const totalGroups = Math.ceil(totalItems / itemsPerGroup);

if (btsMainSlideGroups.length > 0) {
    // Initialize: all groups visible, track positioned at start
    btsMainTrack.style.transform = 'translateX(0%)';

    // Video click to play functionality
    btsMainVideos.forEach(video => {
        const mediaContainer = video.closest('.bts-main-media');
        const playOverlay = mediaContainer.querySelector('.bts-play-overlay');
        
        // Click on video or overlay to play/pause
        const togglePlay = () => {
            if (video.paused) {
                video.play();
                mediaContainer.classList.add('video-playing');
            } else {
                video.pause();
                mediaContainer.classList.remove('video-playing');
            }
        };

        if (playOverlay) {
            playOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        mediaContainer.addEventListener('click', (e) => {
            if (e.target === video || e.target.closest('.bts-play-overlay')) {
                return;
            }
            togglePlay();
        });

        // Hide overlay when video ends
        video.addEventListener('ended', () => {
            mediaContainer.classList.remove('video-playing');
        });
    });

    // Navigation functions
    function showBtsGroup(groupIndex) {
        if (groupIndex < 0 || groupIndex >= totalGroups) return;

        // Update track position
        btsMainTrack.style.transform = `translateX(-${groupIndex * 100}%)`;

        // Pause all videos in non-active groups
        btsMainSlideGroups.forEach((group, index) => {
            if (index !== groupIndex) {
                const videos = group.querySelectorAll('.bts-main-video');
                videos.forEach(video => {
                    video.pause();
                    video.currentTime = 0;
                    const mediaContainer = video.closest('.bts-main-media');
                    if (mediaContainer) {
                        mediaContainer.classList.remove('video-playing');
                    }
                });
            }
        });

        // Update thumbnails - mark all thumbnails in current group as active
        const startIndex = groupIndex * itemsPerGroup;
        const endIndex = Math.min(startIndex + itemsPerGroup, totalItems);
        
        btsThumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.remove('active');
            if (index >= startIndex && index < endIndex) {
                thumbnail.classList.add('active');
            }
        });


        currentBtsGroupIndex = groupIndex;
    }

    // Arrow navigation
    if (btsPrevBtn) {
        btsPrevBtn.addEventListener('click', () => {
            const prevIndex = (currentBtsGroupIndex - 1 + totalGroups) % totalGroups;
            showBtsGroup(prevIndex);
        });
    }

    if (btsNextBtn) {
        btsNextBtn.addEventListener('click', () => {
            const nextIndex = (currentBtsGroupIndex + 1) % totalGroups;
            showBtsGroup(nextIndex);
        });
    }

    // Initialize thumbnails - mark first group as active
    const initialStartIndex = 0;
    const initialEndIndex = Math.min(itemsPerGroup, totalItems);
    btsThumbnails.forEach((thumbnail, index) => {
        if (index >= initialStartIndex && index < initialEndIndex) {
            thumbnail.classList.add('active');
        }
    });

    // Thumbnail click handler
    btsThumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            const targetGroup = Math.floor(index / itemsPerGroup);
            showBtsGroup(targetGroup);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (btsMainTrack && document.querySelector('.bts-carousel-container')) {
            if (e.key === 'ArrowLeft') {
                const prevIndex = (currentBtsGroupIndex - 1 + totalGroups) % totalGroups;
                showBtsGroup(prevIndex);
            } else if (e.key === 'ArrowRight') {
                const nextIndex = (currentBtsGroupIndex + 1) % totalGroups;
                showBtsGroup(nextIndex);
            }
        }
    });

}

