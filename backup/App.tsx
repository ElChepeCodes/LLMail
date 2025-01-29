import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { EmailResponse } from './types';

const App: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post<EmailResponse>('http://localhost:3001/generate-email', {
        subject: subject || 'No Subject', // Use default if subject is empty
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
    <div className="email-app">
      <div className="email-header">
        <h1>AI Email Generator</h1>
      </div>

      <div className="content">
        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            className="email-input subject-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject (optional)..."
          />

          <textarea
            className="email-input prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your email purpose..."
          />

          <button className="generate-btn" onClick={generateEmail} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>

        {/* Output Section */}
        <div className="output-section">
          {email && (
            <div className="output-header">
              <h2>Email Output</h2>
            </div>
          )}
          {email && <textarea className="email-body" readOnly value={email}></textarea>}
        </div>
      </div>
    </div>
  );
};

export default App;
