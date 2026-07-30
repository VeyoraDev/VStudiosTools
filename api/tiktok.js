import axios from 'axios';

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
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
        // Using the API from your code
        const response = await axios.get('https://restapi-v2.simplebot.my.id/download/tiktok', {
            params: { url: url }
        });
        
        return res.status(200).json(response.data);
        
    } catch (error) {
        console.error('TikTok API Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch video'
        });
    }
}
