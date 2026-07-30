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

// TikTok Download Function - Call API
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
    
    document.getElementById('tiktok-loading').style.display = 'block';
    document.getElementById('tiktok-result').style.display = 'none';
    
    try {
        const response = await fetch('/api/tiktok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.status && data.result) {
            const result = data.result;
            
            if (!result.video || !result.video[0]) {
                throw new Error('No video found');
            }
            
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-result').style.display = 'block';
            
            const video = document.getElementById('tiktok-video');
            video.src = result.video[0];
            video.load();
            
            const details = document.getElementById('tiktok-details');
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
            
            window.tiktokVideoUrl = result.video[0];
            
            const audioBtn = document.getElementById('tiktok-audio-btn');
            if (result.audio && result.audio[0]) {
                audioBtn.style.display = 'flex';
                window.tiktokAudioUrl = result.audio[0];
            } else {
                audioBtn.style.display = 'none';
                window.tiktokAudioUrl = null;
            }
            
        } else {
            throw new Error(data.message || 'Failed to fetch video');
        }
        
    } catch (error) {
        document.getElementById('tiktok-loading').style.display = 'none';
        alert('Failed to download video. Please try again.');
        console.error('Error:', error);
    }
}

// Save Functions
function saveVideo(type) {
    if (type === 'tiktok') {
        const url = window.tiktokVideoUrl;
        if (!url) {
            alert('No video available to save');
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = `tiktok_video_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function saveAudio(type) {
    if (type === 'tiktok') {
        const url = window.tiktokAudioUrl;
        if (!url) {
            alert('No audio available to save');
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = `tiktok_audio_${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Enter key support
document.getElementById('tiktok-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadTikTok();
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
