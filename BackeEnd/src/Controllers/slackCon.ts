import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export const sendMessageToSlack = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await axios.post(slackWebhookUrl!, { text: message }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};