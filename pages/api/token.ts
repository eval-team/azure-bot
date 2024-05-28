import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const directLineSecret = process.env.DIRECT_LINE_SECRET;

    try {
        const response = await axios.post('https://directline.botframework.com/v3/directline/tokens/generate', {}, {
            headers: {
                'Authorization': `Bearer ${directLineSecret}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to acquire token' });
    }
}