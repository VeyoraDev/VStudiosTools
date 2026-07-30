export default async function handler(req, res) {
    const { path } = req.query;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        if (path === 'tiktok') {
            const tiktokHandler = await import('./tiktok.js');
            return tiktokHandler.default(req, res);
        }
        
        return res.status(404).json({
            status: false,
            message: 'Tool not found'
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
}
