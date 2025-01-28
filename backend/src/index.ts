import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface EmailRequest {
  prompt: string;
}

interface EmailResponse {
  email?: string;
  error?: string;
}

// Root route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Email Generation API. Use POST /generate-email to generate an email.');
});

// Email generation route
app.post('/generate-email', async (req: Request<{}, {}, EmailRequest>, res: Response<EmailResponse>) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: `Generate a professional email about: ${prompt}. 
        Include subject line and body. Format:
        Subject: <subject>
        Body: <email body>`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ email: response.data[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating email' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
