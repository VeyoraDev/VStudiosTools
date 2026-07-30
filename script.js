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
    
    // Show loading
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
        console.log('Response data:', data);
        
        // Check if success
        if (data.status && data.result) {
            const result = data.result;
            
            // Get video URL - check different possible structures
            let videoUrl = null;
            let audioUrl = null;
            
            // Check various possible video fields
            if (result.video) {
                if (Array.isArray(result.video)) {
                    videoUrl = result.video[0];
                } else if (typeof result.video === 'string') {
                    videoUrl = result.video;
                }
            } else if (result.video_no_watermark) {
                videoUrl = result.video_no_watermark;
            } else if (result.video_no_wm) {
                videoUrl = result.video_no_wm;
            } else if (result.play) {
                videoUrl = result.play;
            } else if (result.video_url) {
                videoUrl = result.video_url;
            }
            
            if (!videoUrl) {
                throw new Error('No video URL found in response');
            }
            
            // Check audio
            if (result.audio) {
                if (Array.isArray(result.audio)) {
                    audioUrl = result.audio[0];
                } else if (typeof result.audio === 'string') {
                    audioUrl = result.audio;
                }
            } else if (result.music) {
                audioUrl = result.music;
            } else if (result.audio_url) {
                audioUrl = result.audio_url;
            }
            
            // Hide loading, show result
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-result').style.display = 'block';
            
            // Set video
            const video = document.getElementById('tiktok-video');
            video.src = videoUrl;
            video.load();
            
            // Show video details
            const details = document.getElementById('tiktok-details');
            let detailText = '';
            
            // Author info
            if (result.author) {
                const authorName = result.author.nickname || result.author.username || result.author.name || 'Unknown';
                detailText += `<strong>Author:</strong> ${authorName}`;
            }
            
            // Views
            if (result.play_count || result.views) {
                const views = result.play_count || result.views;
                detailText += ` &bull; <strong>Views:</strong> ${views.toLocaleString()}`;
            }
            
            // Duration
            if (result.duration) {
                const duration = typeof result.duration === 'number' ? result.duration : parseInt(result.duration);
                if (!isNaN(duration)) {
                    const mins = Math.floor(duration / 60);
                    const secs = duration % 60;
                    detailText += ` &bull; <strong>Duration:</strong> ${mins}:${secs.toString().padStart(2, '0')}`;
                }
            }
            
            // Likes
            if (result.digg_count || result.likes) {
                const likes = result.digg_count || result.likes;
                detailText += ` &bull; <strong>Likes:</strong> ${likes.toLocaleString()}`;
            }
            
            // Title/Description
            if (result.title || result.desc) {
                const title = result.title || result.desc || '';
                detailText += `<br><strong>Title:</strong> ${title.substring(0, 150)}${title.length > 150 ? '...' : ''}`;
            }
            
            details.innerHTML = detailText || 'Video ready to download';
            
            // Store video URL
            window.tiktokVideoUrl = videoUrl;
            
            // Show/hide audio button
            const audioBtn = document.getElementById('tiktok-audio-btn');
            if (audioUrl) {
                audioBtn.style.display = 'flex';
                window.tiktokAudioUrl = audioUrl;
            } else {
                audioBtn.style.display = 'none';
                window.tiktokAudioUrl = null;
            }
            
        } else {
            throw new Error(data.message || 'Failed to fetch video');
        }
        
    } catch (error) {
        document.getElementById('tiktok-loading').style.display = 'none';
        alert('Failed to download video: ' + error.message);
        console.error('Error:', error);
    }
}

// Save Video Function
function saveVideo(type) {
    if (type === 'tiktok') {
        const url = window.tiktokVideoUrl;
        if (!url) {
            alert('No video available to save');
            return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `tiktok_video_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Save Audio Function
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
