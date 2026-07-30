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
        // Forward to BetaBotz API
        const apiUrl = `https://api.betabotz.eu.org/api/download/tiktok?apikey=Btz-5SWmT&url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        const data = await response.json();
        
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('TikTok API Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch video',
            error: error.message
        });
    }
}
