document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('main > section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(dot => dot.classList.remove('active'));
                
                const sectionId = entry.target.id;
                
                const correspondingDot = document.querySelector(`.dot[data-section="${sectionId}"]`);
                
                if (correspondingDot) {
                    correspondingDot.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5 
    });
    sections.forEach(section => {
        observer.observe(section);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const copyLinks = document.querySelectorAll('.copy-to-clipboard');
    const notificationBar = document.getElementById('copy-notification');

    if (copyLinks.length > 0 && notificationBar) {
        
        copyLinks.forEach(link => {

            link.addEventListener('click', function(event) {
                event.preventDefault(); 

                const textToCopy = this.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    notificationBar.classList.add('show');
                    
                    setTimeout(() => {
                        notificationBar.classList.remove('show');
                    }, 3000);

                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        });
    }
});


function modeToggle() {
    const modeIcon = document.getElementById('mode');
    const bgVideo = document.getElementById('bg-video'); 

    if (modeIcon.src.includes('darkmode.svg')) {
        bgVideo.src = 'Resources/DarkMode.mp4';
        modeIcon.src = 'Resources/lightmode.svg';
        modeIcon.alt = 'lightmode';
    } else {
        bgVideo.src = 'Resources/lightmode.mp4';
        modeIcon.src = 'Resources/darkmode.svg';
        modeIcon.alt = 'darkmode';
    }
    
    bgVideo.load();
    bgVideo.play();
}

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation(); 
            mobileMenu.classList.toggle("hidden");
            mobileMenu.classList.toggle("flex");
        });

        document.addEventListener('click', (event) => {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            
            if (!mobileMenu.classList.contains('hidden') && !isClickInsideMenu) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.toggle("flex");
            }
        });
        
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.toggle("flex");
            });
        });
    }
});


// Carousel Auto-Scroll Implementation
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    // Store the original cards in memory immediately so we don't lose them
    const originalCards = Array.from(document.querySelectorAll('.project-card'));
    
    // Config
    const autoScrollDelay = 3000; 
    const transitionDuration = 700; 
    let currentIndex = 0;
    let intervalId;
    let isTransitioning = false;
    let isDesktop = window.innerWidth >= 1024;

    function setupCarousel() {
        isDesktop = window.innerWidth >= 1024;

        // 1. CLEAR EVERYTHING
        stopAutoScroll();
        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';
        currentIndex = 0;
        track.innerHTML = ''; // Wipe the track

        // 2. RESTORE ORIGINALS
        // Always put the original 3 cards back first
        originalCards.forEach(card => {
            track.appendChild(card);
        });

        // 3. DESKTOP SPECIFIC SETUP (Clones & Scroll)
        if (isDesktop) {
            // Add clones for infinite loop effect
            const maxVisible = 3; 
            originalCards.slice(0, maxVisible).forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true'); 
                track.appendChild(clone);
            });

            // Start the loop
            startAutoScroll();
        } 
        // 4. MOBILE SPECIFIC SETUP
        else {
            // On mobile, we do nothing. 
            // We just left the originals there. 
            // CSS 'flex-col' handles the stacking.
        }
    }

    function scrollCarousel() {
        if (isTransitioning || !isDesktop) return;

        // Re-query cards because clones might have been added
        const allCards = track.querySelectorAll('.project-card');
        const cardWidth = allCards[0].offsetWidth;
        const gap = 32; // matches gap-8
        const totalMove = cardWidth + gap;
        const originalLength = originalCards.length;

        currentIndex++;
        isTransitioning = true;

        track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        track.style.transform = `translateX(-${currentIndex * totalMove}px)`;

        // The "Teleport" logic for infinite scroll
        if (currentIndex >= originalLength) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = currentIndex - originalLength;
                track.style.transform = `translateX(-${currentIndex * totalMove}px)`;
                void track.offsetWidth; // Force reflow
                track.style.transition = '';
                isTransitioning = false;
            }, transitionDuration);
        } else {
            setTimeout(() => {
                isTransitioning = false;
            }, transitionDuration);
        }
    }

    function startAutoScroll() {
        stopAutoScroll();
        // Only start if we are strictly on desktop
        if (window.innerWidth >= 1024) {
            intervalId = setInterval(scrollCarousel, autoScrollDelay);
        }
    }

    function stopAutoScroll() {
        clearInterval(intervalId);
    }

    // Initialize
    setupCarousel();

    // Event Listeners
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);

    // Handle Resize (Debounced slightly for performance is better, but this works)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupCarousel();
        }, 100);
    });
});


function toggleSkill(element) {
    const content = element.querySelector('.skill-content');
    const arrow = element.querySelector('.arrow');
    const isOpen = content.classList.contains('grid-rows-[1fr]');

    // Close all other skills (Optional - remove this block if you want multiple open)
    document.querySelectorAll('.skill-card').forEach(card => {
        card.querySelector('.skill-content').classList.remove('grid-rows-[1fr]');
        card.querySelector('.skill-content').classList.add('grid-rows-[0fr]');
        card.querySelector('.arrow').style.transform = 'rotate(0deg)';
        card.classList.remove('bg-white/15'); 
    });

    // Toggle current
    if (!isOpen) {
        content.classList.remove('grid-rows-[0fr]');
        content.classList.add('grid-rows-[1fr]');
        arrow.style.transform = 'rotate(180deg)';
        element.classList.add('bg-white/15');
    }
}