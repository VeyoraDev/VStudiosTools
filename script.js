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
        // Build API URL with user's URL
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `https://api.betabotz.eu.org/api/download/tiktok?apikey=Btz-5SWmT&url=${encodedUrl}`;
        
        console.log('Fetching:', apiUrl);
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        // Check if success
        if (data.status && data.result) {
            const result = data.result;
            
            // Get video URL - try multiple possible fields
            let videoUrl = null;
            
            if (result.video) {
                if (Array.isArray(result.video)) {
                    videoUrl = result.video[0];
                } else {
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
            } else if (result.url) {
                videoUrl = result.url;
            }
            
            if (!videoUrl) {
                console.error('No video found in:', result);
                throw new Error('No video URL found');
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
            
            // Author
            if (result.author) {
                const name = result.author.nickname || result.author.username || 'Unknown';
                detailText += `<strong>Author:</strong> ${name}`;
            }
            
            // Views
            if (result.play_count) {
                detailText += ` &bull; <strong>Views:</strong> ${Number(result.play_count).toLocaleString()}`;
            }
            
            // Duration
            if (result.duration) {
                const dur = parseInt(result.duration);
                if (!isNaN(dur)) {
                    const mins = Math.floor(dur / 60);
                    const secs = dur % 60;
                    detailText += ` &bull; <strong>Duration:</strong> ${mins}:${secs.toString().padStart(2, '0')}`;
                }
            }
            
            // Likes
            if (result.digg_count) {
                detailText += ` &bull; <strong>Likes:</strong> ${Number(result.digg_count).toLocaleString()}`;
            }
            
            // Title
            if (result.title) {
                const title = result.title.replace(/[^\x20-\x7E]/g, '').trim();
                if (title) {
                    detailText += `<br><strong>Title:</strong> ${title.substring(0, 150)}${title.length > 150 ? '...' : ''}`;
                }
            }
            
            details.innerHTML = detailText || 'Video ready to download';
            
            // Store video URL for download
            window.tiktokVideoUrl = videoUrl;
            
        } else {
            throw new Error(data.message || 'Failed to fetch video');
        }
        
    } catch (error) {
        document.getElementById('tiktok-loading').style.display = 'none';
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
}

// Download Video Function
function downloadVideo() {
    const url = window.tiktokVideoUrl;
    
    if (!url) {
        alert('No video available to download');
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

// Enter key support
document.getElementById('tiktok-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadTikTok();
    }
});

// Test function for console
window.testAPI = async function(url) {
    const apiUrl = `https://api.betabotz.eu.org/api/download/tiktok?apikey=Btz-5SWmT&url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Test Result:', data);
    return data;
};
