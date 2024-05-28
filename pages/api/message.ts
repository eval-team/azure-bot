import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, conversationId, message } = req.body;

    try {
        // Send a message
        await axios.post(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
            type: 'message',
            from: { id: 'user1' },
            text: message
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Get activities (messages)
        const response = await axios.get(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send or receive message' });
    }
}
