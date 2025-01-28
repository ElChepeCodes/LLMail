import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { EmailResponse } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post<EmailResponse>('http://localhost:3001/generate-email', {
        prompt,
      });
      setEmail(response.data.email || '');
    } catch (error) {
      const errorMessage = (error as any).message || 'Unknown error';
      setEmail('Error generating email. Please try again. \nError: ' + errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>AI Email Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your email purpose..."
      />
      <button onClick={generateEmail} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Email'}
      </button>
      <pre className="output">{email}</pre>
    </div>
  );
};

export default App;