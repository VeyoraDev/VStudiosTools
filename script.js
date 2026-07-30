document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('tiktok-modal');
    const toolCards = document.querySelectorAll('.tool-card:not(.coming-soon)');
    const closeBtn = document.querySelector('.modal-close');
    const downloadBtn = document.getElementById('download-btn');
    const urlInput = document.getElementById('tiktok-url');
    const resultContainer = document.getElementById('result-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const videoElement = document.getElementById('result-video');
    const saveBtn = document.getElementById('save-video-btn');

    // Open modal when tool card is clicked
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const tool = this.dataset.tool;
            if (tool === 'tiktok') {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                resetModal();
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModal();
    }

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Reset modal state
    function resetModal() {
        resultContainer.style.display = 'none';
        loadingIndicator.style.display = 'none';
        videoElement.src = '';
        urlInput.value = '';
        saveBtn.style.display = 'none';
    }

    // Download TikTok video
    downloadBtn.addEventListener('click', async function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Sila paste link TikTok terlebih dahulu!');
            return;
        }

        // Validate TikTok URL
        if (!url.includes('tiktok.com') && !url.includes('vt.tiktok.com')) {
            alert('Sila masukkan link TikTok yang sah!');
            return;
        }

        // Show loading
        loadingIndicator.style.display = 'block';
        resultContainer.style.display = 'none';
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="btn-icon">⏳</span> Memproses...';

        try {
            // Encode URL for API
            const encodedUrl = encodeURIComponent(url);
            const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodedUrl}`;

            // Fetch video data
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status && data.result) {
                // Show video
                loadingIndicator.style.display = 'none';
                resultContainer.style.display = 'block';
                
                // Set video source (assuming result contains video URL)
                const videoUrl = data.result.video || data.result;
                videoElement.src = videoUrl;
                videoElement.load();
                
                // Show save button
                saveBtn.style.display = 'flex';
                
                // Save video functionality
                saveBtn.onclick = function() {
                    downloadVideo(videoUrl);
                };
            } else {
                alert('Gagal memproses video. Sila cuba lagi.');
                loadingIndicator.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ralat berlaku. Sila cuba lagi.');
            loadingIndicator.style.display = 'none';
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<span class="btn-icon">⬇</span> Download';
        }
    });

    // Download video function
    function downloadVideo(videoUrl) {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `tiktok_video_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Allow Enter key to trigger download
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
