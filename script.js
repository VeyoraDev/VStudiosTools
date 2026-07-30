// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.animation = 'fadeIn 0.6s ease';
        }, 500);
    }, 2500);
});

// Show/Hide Tool
function showTool(tool) {
    if (tool === 'tiktok') {
        document.getElementById('tiktok-tool').style.display = 'block';
        document.querySelector('.tools-grid').style.display = 'none';
        
        document.getElementById('tiktok-tool').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function hideTool() {
    document.getElementById('tiktok-tool').style.display = 'none';
    document.querySelector('.tools-grid').style.display = 'grid';
}

// TikTok Download Function
async function downloadTikTok() {
    const urlInput = document.getElementById('tiktok-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please paste a TikTok URL first');
        return;
    }
    
    if (!url.includes('tiktok.com')) {
        alert('Please enter a valid TikTok URL');
        return;
    }
    
    document.getElementById('loading-tool').style.display = 'block';
    document.getElementById('result-area').style.display = 'none';
    
    try {
        const response = await fetch('/api/tiktok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
            document.getElementById('loading-tool').style.display = 'none';
            document.getElementById('result-area').style.display = 'block';
            
            const video = document.getElementById('video-preview');
            video.src = data.data.play;
            video.load();
            
            const details = document.getElementById('video-details');
            details.innerHTML = `
                <strong>Author:</strong> ${data.data.author?.nickname || 'Unknown'} &bull;
                <strong>Views:</strong> ${data.data.play_count || 'N/A'} &bull;
                <strong>Duration:</strong> ${data.data.duration || 'N/A'}s
            `;
            
            window.currentVideoUrl = data.data.play;
        } else {
            throw new Error(data.message || 'No video found');
        }
    } catch (error) {
        document.getElementById('loading-tool').style.display = 'none';
        alert('Failed to download video. Please try again.');
        console.error('Error:', error);
    }
}

// Save Video Function
function saveVideo() {
    const videoUrl = window.currentVideoUrl;
    
    if (!videoUrl) {
        alert('No video available to save');
        return;
    }
    
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `tiktok_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
