import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.includes('tiktok.com')) {
        return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    try {
        // Using your API endpoint
        const response = await axios.get(`https://your-api-endpoint.com/tiktok?url=${encodeURIComponent(url)}`);
        
        if (response.data) {
            return res.status(200).json({
                success: true,
                data: response.data
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No video found'
            });
        }
    } catch (error) {
        console.error('TikTok API Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch video'
        });
    }
}
