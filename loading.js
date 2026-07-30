document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Simulate loading time (2-3 seconds)
    setTimeout(function() {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            setTimeout(function() {
                mainContent.style.transition = 'opacity 0.8s ease';
                mainContent.style.opacity = '1';
            }, 50);
        }, 800);
    }, 2500);
});
