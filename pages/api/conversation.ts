import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    try {
        const response = await axios.post('https://directline.botframework.com/v3/directline/conversations', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to start conversation' });
    }
}
