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

// Console Functions
function addConsoleLine(message, type = 'info') {
    const consoleBody = document.getElementById('console-body');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = message;
    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
}

function clearConsole() {
    const consoleBody = document.getElementById('console-body');
    consoleBody.innerHTML = '';
    addConsoleLine('Terminal cleared', 'system');
    addConsoleLine('Ready for new request...', 'system');
}

// Show/Hide Tool
function showTool(tool) {
    if (tool === 'tiktok') {
        document.getElementById('tiktok-tool').style.display = 'block';
        document.querySelector('.tools-grid').style.display = 'none';
        addConsoleLine('Loading TikTok Downloader...', 'system');
        
        document.getElementById('tiktok-tool').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function hideTool() {
    document.getElementById('tiktok-tool').style.display = 'none';
    document.querySelector('.tools-grid').style.display = 'grid';
    addConsoleLine('Back to tools menu', 'system');
}

// TikTok Download Function - Using FAA API
async function downloadTikTok() {
    const urlInput = document.getElementById('tiktok-url');
    const url = urlInput.value.trim();
    
    addConsoleLine('─────────────────────────────────', 'system');
    addConsoleLine('Starting TikTok download process...', 'system');
    
    if (!url) {
        addConsoleLine('ERROR: No URL provided', 'error');
        addConsoleLine('Please paste a TikTok URL first', 'warning');
        alert('Please paste a TikTok URL first');
        return;
    }
    
    addConsoleLine(`URL received: ${url}`, 'url');
    
    if (!url.includes('tiktok.com')) {
        addConsoleLine('ERROR: Invalid TikTok URL', 'error');
        addConsoleLine(`URL: ${url} is not a valid TikTok URL`, 'error');
        alert('Please enter a valid TikTok URL');
        return;
    }
    
    addConsoleLine('URL validation passed ✓', 'success');
    
    // Show loading
    document.getElementById('tiktok-loading').style.display = 'block';
    document.getElementById('tiktok-result').style.display = 'none';
    
    addConsoleLine('Sending request to API...', 'info');
    
    try {
        // Build API URL with FAA API
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodedUrl}`;
        
        addConsoleLine(`API Endpoint: ${apiUrl}`, 'data');
        addConsoleLine('Waiting for response...', 'info');
        
        const startTime = Date.now();
        const response = await fetch(apiUrl);
        const responseTime = Date.now() - startTime;
        
        addConsoleLine(`Response received in ${responseTime}ms`, 'info');
        addConsoleLine(`HTTP Status: ${response.status} ${response.statusText}`, 'data');
        
        const data = await response.json();
        
        // Log full response
        addConsoleLine('Response Data:', 'data');
        addConsoleLine(JSON.stringify(data, null, 2), 'data');
        
        // Check if success - FAA API response structure
        if (data.status && data.result) {
            addConsoleLine('API Status: Success ✓', 'success');
            const result = data.result;
            
            // Get video URL from FAA API structure
            let videoUrl = null;
            
            addConsoleLine('Extracting video URL...', 'info');
            
            // FAA API uses data field for video
            if (result.data) {
                videoUrl = result.data;
                addConsoleLine('Found video URL in result.data', 'success');
            } else if (result.alternatives && result.alternatives.selected) {
                videoUrl = result.alternatives.selected;
                addConsoleLine('Found video URL in alternatives.selected', 'success');
            } else if (result.alternatives && result.alternatives.hd) {
                videoUrl = result.alternatives.hd;
                addConsoleLine('Found video URL in alternatives.hd', 'success');
            } else if (result.alternatives && result.alternatives.sd) {
                videoUrl = result.alternatives.sd;
                addConsoleLine('Found video URL in alternatives.sd', 'success');
            } else if (result.video) {
                if (Array.isArray(result.video)) {
                    videoUrl = result.video[0];
                } else {
                    videoUrl = result.video;
                }
                addConsoleLine('Found video URL in result.video', 'success');
            } else if (result.play) {
                videoUrl = result.play;
                addConsoleLine('Found video URL in result.play', 'success');
            } else if (result.video_url) {
                videoUrl = result.video_url;
                addConsoleLine('Found video URL in result.video_url', 'success');
            }
            
            if (!videoUrl) {
                addConsoleLine('ERROR: No video URL found in response', 'error');
                addConsoleLine('Available fields: ' + Object.keys(result).join(', '), 'error');
                throw new Error('No video URL found');
            }
            
            addConsoleLine(`Video URL extracted: ${videoUrl.substring(0, 80)}...`, 'url');
            
            // Get audio URL if available
            let audioUrl = null;
            if (result.music_info && result.music_info.url) {
                audioUrl = result.music_info.url;
                addConsoleLine('Audio URL found ✓', 'success');
            } else if (result.audio) {
                if (Array.isArray(result.audio)) {
                    audioUrl = result.audio[0];
                } else {
                    audioUrl = result.audio;
                }
                addConsoleLine('Audio URL found ✓', 'success');
            } else if (result.music) {
                audioUrl = result.music;
                addConsoleLine('Audio URL found ✓', 'success');
            } else {
                addConsoleLine('No audio URL available', 'warning');
            }
            
            // Hide loading, show result
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-result').style.display = 'block';
            
            addConsoleLine('Rendering video...', 'info');
            
            // Set video
            const video = document.getElementById('tiktok-video');
            video.src = videoUrl;
            video.load();
            
            addConsoleLine('Video loaded successfully ✓', 'success');
            
            // Show video details - FAA API specific
            const details = document.getElementById('tiktok-details');
            let detailText = '';
            
            // Author
            if (result.author) {
                const name = result.author.nickname || result.author.username || 'Unknown';
                detailText += `<strong>Author:</strong> ${name}`;
                if (result.author.username) {
                    detailText += ` (@${result.author.username})`;
                }
                addConsoleLine(`Author: ${name}`, 'data');
            }
            
            // Views
            if (result.stats && result.stats.views) {
                detailText += ` &bull; <strong>Views:</strong> ${result.stats.views}`;
                addConsoleLine(`Views: ${result.stats.views}`, 'data');
            } else if (result.play_count) {
                detailText += ` &bull; <strong>Views:</strong> ${Number(result.play_count).toLocaleString()}`;
                addConsoleLine(`Views: ${Number(result.play_count).toLocaleString()}`, 'data');
            }
            
            // Duration
            if (result.duration) {
                detailText += ` &bull; <strong>Duration:</strong> ${result.duration}`;
                addConsoleLine(`Duration: ${result.duration}`, 'data');
            }
            
            // Likes
            if (result.stats && result.stats.likes) {
                detailText += ` &bull; <strong>Likes:</strong> ${result.stats.likes}`;
                addConsoleLine(`Likes: ${result.stats.likes}`, 'data');
            } else if (result.digg_count) {
                detailText += ` &bull; <strong>Likes:</strong> ${Number(result.digg_count).toLocaleString()}`;
                addConsoleLine(`Likes: ${Number(result.digg_count).toLocaleString()}`, 'data');
            }
            
            // Comments
            if (result.stats && result.stats.comment) {
                detailText += ` &bull; <strong>Comments:</strong> ${result.stats.comment}`;
                addConsoleLine(`Comments: ${result.stats.comment}`, 'data');
            } else if (result.comment_count) {
                detailText += ` &bull; <strong>Comments:</strong> ${Number(result.comment_count).toLocaleString()}`;
                addConsoleLine(`Comments: ${Number(result.comment_count).toLocaleString()}`, 'data');
            }
            
            // Shares
            if (result.stats && result.stats.share) {
                detailText += ` &bull; <strong>Shares:</strong> ${result.stats.share}`;
                addConsoleLine(`Shares: ${result.stats.share}`, 'data');
            } else if (result.share_count) {
                detailText += ` &bull; <strong>Shares:</strong> ${Number(result.share_count).toLocaleString()}`;
                addConsoleLine(`Shares: ${Number(result.share_count).toLocaleString()}`, 'data');
            }
            
            // Title
            if (result.title) {
                const title = result.title.replace(/[^\x20-\x7E]/g, '').trim();
                if (title) {
                    detailText += `<br><strong>Title:</strong> ${title.substring(0, 150)}${title.length > 150 ? '...' : ''}`;
                    addConsoleLine(`Title: ${title.substring(0, 100)}${title.length > 100 ? '...' : ''}`, 'data');
                }
            }
            
            // Region & Taken at
            if (result.region) {
                detailText += `<br><strong>Region:</strong> ${result.region}`;
                addConsoleLine(`Region: ${result.region}`, 'data');
            }
            if (result.taken_at) {
                detailText += ` &bull; <strong>Taken:</strong> ${result.taken_at}`;
                addConsoleLine(`Taken at: ${result.taken_at}`, 'data');
            }
            
            details.innerHTML = detailText || 'Video ready to download';
            
            // Store video URL for download
            window.tiktokVideoUrl = videoUrl;
            
            // Store audio URL if available
            if (audioUrl) {
                window.tiktokAudioUrl = audioUrl;
                const audioBtn = document.getElementById('tiktok-audio-btn');
                if (audioBtn) {
                    audioBtn.style.display = 'flex';
                    addConsoleLine('Audio button enabled', 'success');
                }
            } else {
                window.tiktokAudioUrl = null;
                const audioBtn = document.getElementById('tiktok-audio-btn');
                if (audioBtn) {
                    audioBtn.style.display = 'none';
                }
            }
            
            addConsoleLine('─────────────────────────────────', 'system');
            addConsoleLine('Process completed successfully! ✓', 'success');
            addConsoleLine('You can now download the video', 'info');
            
        } else {
            addConsoleLine('ERROR: API returned failure status', 'error');
            addConsoleLine(`Message: ${data.message || 'No message provided'}`, 'error');
            throw new Error(data.message || data.error || 'Failed to fetch video');
        }
        
    } catch (error) {
        addConsoleLine('─────────────────────────────────', 'system');
        addConsoleLine('ERROR OCCURRED!', 'error');
        addConsoleLine(`Error: ${error.message}`, 'error');
        addConsoleLine(`Stack trace: ${error.stack || 'No stack trace available'}`, 'error');
        
        document.getElementById('tiktok-loading').style.display = 'none';
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
}

// Download Video Function
function downloadVideo() {
    const url = window.tiktokVideoUrl;
    
    addConsoleLine('Downloading video...', 'info');
    
    if (!url) {
        addConsoleLine('ERROR: No video URL available', 'error');
        alert('No video available to download');
        return;
    }
    
    addConsoleLine(`Video URL: ${url.substring(0, 80)}...`, 'url');
    addConsoleLine('Creating download link...', 'info');
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addConsoleLine('Download started ✓', 'success');
}

// Download Audio Function
function downloadAudio() {
    const url = window.tiktokAudioUrl;
    
    addConsoleLine('Downloading audio...', 'info');
    
    if (!url) {
        addConsoleLine('ERROR: No audio URL available', 'error');
        alert('No audio available to download');
        return;
    }
    
    addConsoleLine(`Audio URL: ${url.substring(0, 80)}...`, 'url');
    addConsoleLine('Creating download link...', 'info');
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_audio_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addConsoleLine('Download started ✓', 'success');
}

// Enter key support
document.getElementById('tiktok-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadTikTok();
    }
});

// Test function for console
window.testAPI = async function(url) {
    const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Test Result:', data);
    return data;
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
