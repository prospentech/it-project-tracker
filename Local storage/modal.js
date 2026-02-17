// Modal management functions
function showCustomModal(title, message, type = 'info') {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal ${type}">
            <div class="custom-modal-header">
                <h3>${title}</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>${message}</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides.length === 0 || dots.length === 0) return;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (dots[index]) dots[index].classList.remove('active');
    });
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    if (window.updateWelcomeMessage) updateWelcomeMessage();
    if (window.updateTopProject) updateTopProject();
    
    clearInterval(window.slideInterval);
    window.slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    clearInterval(window.slideInterval);
    window.slideInterval = setInterval(nextSlide, 5000);
}

function updateWelcomeMessage() {
    const currentUser = auth.getCurrentUser();
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (currentUser && welcomeMessage) {
        const pendingTasks = getPendingTaskCount();
        welcomeMessage.textContent = `Welcome ${currentUser.username}, you have ${pendingTasks} tasks pending.`;
    }
}

function getPendingTaskCount() {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    let total = 0;
    Object.values(projects).forEach(project => {
        if (project.tasks) {
            project.tasks.forEach(task => {
                if (task.status !== 'Completed') {
                    total++;
                }
            });
        }
    });
    return total;
}

// Make functions available globally
window.showCustomModal = showCustomModal;
window.initHeroSlider = initHeroSlider;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.updateWelcomeMessage = updateWelcomeMessage;
window.getPendingTaskCount = getPendingTaskCount;