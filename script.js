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

// TikTok Download Function - Using real API
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
    
    // Show loading
    document.getElementById('loading-tool').style.display = 'block';
    document.getElementById('result-area').style.display = 'none';
    
    try {
        // Using the API from your code
        const response = await fetch(`https://restapi-v2.simplebot.my.id/download/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        // Check if success
        if (data.status && data.result) {
            const result = data.result;
            
            // Check if video exists
            if (!result.video_nowm) {
                throw new Error('No video found');
            }
            
            // Hide loading, show result
            document.getElementById('loading-tool').style.display = 'none';
            document.getElementById('result-area').style.display = 'block';
            
            // Set video
            const video = document.getElementById('video-preview');
            video.src = result.video_nowm;
            video.load();
            
            // Show video details
            const details = document.getElementById('video-details');
            let detailText = '';
            
            if (result.author) {
                detailText += `<strong>Author:</strong> ${result.author.nickname || 'Unknown'}`;
            }
            if (result.play_count) {
                detailText += ` &bull; <strong>Views:</strong> ${result.play_count}`;
            }
            if (result.duration) {
                detailText += ` &bull; <strong>Duration:</strong> ${result.duration}s`;
            }
            if (result.title) {
                detailText += `<br><strong>Title:</strong> ${result.title.substring(0, 100)}${result.title.length > 100 ? '...' : ''}`;
            }
            
            details.innerHTML = detailText || 'Video ready to download';
            
            // Store video URL for save
            window.currentVideoUrl = result.video_nowm;
            
            // Show audio button if available
            const audioBtn = document.getElementById('audio-btn');
            if (result.audio_url) {
                audioBtn.style.display = 'flex';
                window.currentAudioUrl = result.audio_url;
            } else {
                audioBtn.style.display = 'none';
                window.currentAudioUrl = null;
            }
            
        } else {
            throw new Error(data.message || 'Failed to fetch video');
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
    
    // Create download link
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `tiktok_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Save Audio Function
function saveAudio() {
    const audioUrl = window.currentAudioUrl;
    
    if (!audioUrl) {
        alert('No audio available to save');
        return;
    }
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `tiktok_audio_${Date.now()}.mp3`;
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

// Enter key support
document.getElementById('tiktok-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadTikTok();
    }
});
