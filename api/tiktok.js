import axios from 'axios';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { url } = req.method === 'GET' ? req.query : req.body;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'URL is required'
        });
    }
    
    if (!url.includes('tiktok.com')) {
        return res.status(400).json({
            status: false,
            message: 'Invalid TikTok URL'
        });
    }
    
    try {
        // Using BetaBotz API with provided apikey
        const response = await axios.get('https://api.betabotz.eu.org/api/download/tiktok', {
            params: {
                url: url,
                apikey: 'Btz-5SWmT'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 30000
        });
        
        // Log for debugging
        console.log('TikTok API Response:', response.data);
        
        // Check if response has data
        if (response.data && response.data.status && response.data.result) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({
                status: false,
                message: response.data?.message || 'No data found'
            });
        }
        
    } catch (error) {
        console.error('TikTok API Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch video',
            error: error.message
        });
    }
}
