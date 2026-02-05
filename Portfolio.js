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

                const textToCopy = this.innerText.trim();

                navigator.clipboard.writeText(textToCopy).then(() => {
                    notificationBar.classList.remove('opacity-0', 'translate-y-20');
                    notificationBar.classList.add('opacity-100', 'translate-y-0');
                    
                    setTimeout(() => {
                        notificationBar.classList.remove('opacity-100', 'translate-y-0');
                        notificationBar.classList.add('opacity-0', 'translate-y-20');
                    }, 3000);

                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        });
    }
});

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


document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const originalCards = Array.from(document.querySelectorAll('.project-card'));
    
    const autoScrollDelay = 3000; 
    const transitionDuration = 700; 
    let currentIndex = 0;
    let intervalId;
    let isTransitioning = false;
    let isDesktop = window.innerWidth >= 1024;

    function setupCarousel() {
        isDesktop = window.innerWidth >= 1024;

        stopAutoScroll();
        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';
        currentIndex = 0;
        track.innerHTML = ''; 

        originalCards.forEach(card => {
            track.appendChild(card);
        });

        if (isDesktop) {
            const maxVisible = 3; 
            originalCards.slice(0, maxVisible).forEach(card => {
                const clone = card.cloneNode(true);
                clone.inert = true; 
                track.appendChild(clone);
            });

            startAutoScroll();
        } 
    }

    function scrollCarousel() {
        if (isTransitioning || !isDesktop) return;

        const allCards = track.querySelectorAll('.project-card');
        const cardWidth = allCards[0].offsetWidth;
        const gap = 32; 
        const totalMove = cardWidth + gap;
        const originalLength = originalCards.length;

        currentIndex++;
        isTransitioning = true;

        track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        track.style.transform = `translateX(-${currentIndex * totalMove}px)`;

        if (currentIndex >= originalLength) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = currentIndex - originalLength;
                track.style.transform = `translateX(-${currentIndex * totalMove}px)`;
                void track.offsetWidth;
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
        if (window.innerWidth >= 1024) {
            intervalId = setInterval(scrollCarousel, autoScrollDelay);
        }
    }

    function stopAutoScroll() {
        clearInterval(intervalId);
    }

    setupCarousel();

    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupCarousel();
        }, 100);
    });
});


function closeAllSkills() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const c = card.querySelector('.skill-content');
        const f = card.querySelector('.card-face');
        const a = card.querySelector('.arrow');

        c.style.maxHeight = '0px';
        c.style.opacity = '0';
        
        f.classList.remove('rounded-b-none');
        f.classList.remove('border-b-transparent');
        f.classList.remove('bg-white/15');
        
        a.style.transform = 'rotate(0deg)';
        
        card.style.zIndex = '10';
    });
}

function toggleSkill(element) {
    
    const content = element.querySelector('.skill-content');
    const face = element.querySelector('.card-face');
    const arrow = element.querySelector('.arrow');
    const isAlreadyOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

    closeAllSkills();

    if (!isAlreadyOpen) {
        content.style.maxHeight = '500px'; 
        content.style.opacity = '1';

        face.classList.add('rounded-b-none');
        face.classList.add('border-b-transparent');
        face.classList.add('bg-white/15');

        arrow.style.transform = 'rotate(180deg)';
        element.style.zIndex = '50';
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.skill-card')) {
        closeAllSkills();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});