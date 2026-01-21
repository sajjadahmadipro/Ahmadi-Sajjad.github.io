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