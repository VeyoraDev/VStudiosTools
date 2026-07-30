// TikTok Download Function - Using FAA API
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
        // Build API URL with FAA API
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodedUrl}`;
        
        console.log('Fetching:', apiUrl);
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        // Check if success - FAA API response structure
        if (data.status && data.result) {
            const result = data.result;
            
            // Get video URL from FAA API structure
            let videoUrl = null;
            
            // FAA API uses data field for video
            if (result.data) {
                videoUrl = result.data;
            } else if (result.alternatives && result.alternatives.selected) {
                videoUrl = result.alternatives.selected;
            } else if (result.alternatives && result.alternatives.hd) {
                videoUrl = result.alternatives.hd;
            } else if (result.alternatives && result.alternatives.sd) {
                videoUrl = result.alternatives.sd;
            } else if (result.video) {
                if (Array.isArray(result.video)) {
                    videoUrl = result.video[0];
                } else {
                    videoUrl = result.video;
                }
            } else if (result.play) {
                videoUrl = result.play;
            } else if (result.video_url) {
                videoUrl = result.video_url;
            }
            
            if (!videoUrl) {
                console.error('No video found in:', result);
                throw new Error('No video URL found');
            }
            
            // Get audio URL if available
            let audioUrl = null;
            if (result.music_info && result.music_info.url) {
                audioUrl = result.music_info.url;
            } else if (result.audio) {
                if (Array.isArray(result.audio)) {
                    audioUrl = result.audio[0];
                } else {
                    audioUrl = result.audio;
                }
            } else if (result.music) {
                audioUrl = result.music;
            }
            
            // Hide loading, show result
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-result').style.display = 'block';
            
            // Set video
            const video = document.getElementById('tiktok-video');
            video.src = videoUrl;
            video.load();
            
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
            }
            
            // Views
            if (result.stats && result.stats.views) {
                detailText += ` &bull; <strong>Views:</strong> ${result.stats.views}`;
            } else if (result.play_count) {
                detailText += ` &bull; <strong>Views:</strong> ${Number(result.play_count).toLocaleString()}`;
            }
            
            // Duration
            if (result.duration) {
                detailText += ` &bull; <strong>Duration:</strong> ${result.duration}`;
            }
            
            // Likes
            if (result.stats && result.stats.likes) {
                detailText += ` &bull; <strong>Likes:</strong> ${result.stats.likes}`;
            } else if (result.digg_count) {
                detailText += ` &bull; <strong>Likes:</strong> ${Number(result.digg_count).toLocaleString()}`;
            }
            
            // Comments
            if (result.stats && result.stats.comment) {
                detailText += ` &bull; <strong>Comments:</strong> ${result.stats.comment}`;
            } else if (result.comment_count) {
                detailText += ` &bull; <strong>Comments:</strong> ${Number(result.comment_count).toLocaleString()}`;
            }
            
            // Shares
            if (result.stats && result.stats.share) {
                detailText += ` &bull; <strong>Shares:</strong> ${result.stats.share}`;
            } else if (result.share_count) {
                detailText += ` &bull; <strong>Shares:</strong> ${Number(result.share_count).toLocaleString()}`;
            }
            
            // Title
            if (result.title) {
                const title = result.title.replace(/[^\x20-\x7E]/g, '').trim();
                if (title) {
                    detailText += `<br><strong>Title:</strong> ${title.substring(0, 150)}${title.length > 150 ? '...' : ''}`;
                }
            }
            
            // Region & Taken at
            if (result.region) {
                detailText += `<br><strong>Region:</strong> ${result.region}`;
            }
            if (result.taken_at) {
                detailText += ` &bull; <strong>Taken:</strong> ${result.taken_at}`;
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
                }
            } else {
                window.tiktokAudioUrl = null;
                const audioBtn = document.getElementById('tiktok-audio-btn');
                if (audioBtn) {
                    audioBtn.style.display = 'none';
                }
            }
            
        } else {
            throw new Error(data.message || data.error || 'Failed to fetch video');
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

// Download Audio Function
function downloadAudio() {
    const url = window.tiktokAudioUrl;
    
    if (!url) {
        alert('No audio available to download');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_audio_${Date.now()}.mp3`;
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
