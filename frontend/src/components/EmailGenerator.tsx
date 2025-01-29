'use client'; // Mark as a Client Component

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiMail, FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi';

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [email, setEmail] = useState<{ subject: string; body: string }>({ subject: '', body: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false); // Track shaking effect
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [initialHeight, setInitialHeight] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Resize the textarea
  const resizeTextArea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Set height to auto first to get scrollHeight
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;

      // Check if initialHeight is set, if not, set it
      if (initialHeight === 0) {
        setInitialHeight(newHeight); // Set initial height as the first height
      }

      const maxHeight = initialHeight * 2; // Double the initial height for max expansion

      if (newHeight < maxHeight) {
        textarea.style.height = `${newHeight}px`; // Dynamically expand height
      } else {
        textarea.style.height = `${maxHeight}px`; // Limit height to double the initial height
        textarea.style.overflowY = 'auto'; // Make it scrollable after that
      }
    }
  }, [initialHeight]);

  // Trigger resize on content change
  useEffect(() => {
    resizeTextArea();
  }, [prompt, resizeTextArea]);

  // Handle input change and apply character limit
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setPrompt(value);
      setError('');
      setIsShaking(false);
    } else {
      setIsShaking(true); // Trigger shake effect
      setPrompt(value.slice(0, 100)); // Limit input to 100 characters
    }
  };

  useEffect(() => {
    if (isShaking) {
      const shakeTimeout = setTimeout(() => {
        setIsShaking(false); // Reset shaking effect after animation
      }, 500); // Animation duration (500ms)

      return () => clearTimeout(shakeTimeout); // Clean up timeout on component unmount or re-render
    }
  }, [isShaking]);

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/generate-email', { prompt });
      const { subject, body } = response.data;
      setEmail({ subject, body });
    } catch {
      setError('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
  };

  const clearAll = () => {
    setPrompt('');
    setEmail({ subject: '', body: '' });
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col overflow-auto bg-surface">
    {/* Header */}
    <div className="text-center mb-12">
      <FiMail className="mx-auto h-12 w-12 text-primary-500 mb-4" />
      <h1 className="text-4xl font-bold text-onSurface mb-2">
        AI Email Generator
      </h1>
      <p className="text-onSurface/80">
        Transform your ideas into professional emails instantly
      </p>
    </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-xl p-8 space-y-8 flex-1 overflow-hidden">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-5 min-h-[20px]">
            <label
              className={`absolute left-4 top-2 text-gray-400 transition-all duration-200 
              peer-focus:text-blue-600 peer-focus:top-2 peer-focus:scale-90 
              ${isFocused || prompt ? 'top-2 scale-90' : 'top-4'}`}
            >
              Describe your email purpose <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=" "
              className={`w-full px-20 py-3 border ${
                error ? 'border-secondary-500' : 'border-onSurface/20'
              } rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
              transition-all resize-none min-h-[20px] overflow-hidden focus:outline-none 
              placeholder:text-transparent bg-surface text-onSurface`}
              style={{
                height: prompt.split('\n').length > 2 ? 'auto' : '100px', // Adjust height based on lines
                maxHeight: '200px', // Maximum expansion height
              }}
            />
            <FiEdit className="absolute bottom-4 right-4 text-gray-400" />
          </div>

          {/* Character Counter */}
          <div
            className={`text-right text-sm text-gray-500 ${isShaking ? 'animate-shake' : ''}`}
          >
            {prompt.length}/100
          </div>

          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={clearAll}
            className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none"
          >
            <FiTrash2 className="mr-2" />
            Clear All
          </button>

          <button
            onClick={generateEmail}
            disabled={loading}
            className={`flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Email'
            )}
          </button>
        </div>

        {/* Output Section */}
        {email.subject && email.body && (
          <div className="space-y-4">
            {/* Display Subject */}
            {email.subject && (
              <div className="text-xl font-semibold text-gray-800">
                Subject: <span className="text-blue-600">{email.subject}</span>
              </div>
            )}

            {/* Display Body */}
            {email.body && (
              <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-mono text-gray-800 
              border border-gray-200 transition-all hover:border-blue-600 custom-scrollbar">
                {email.body}
              </div>
            )}

            {/* Copy Button */}
            <div className="flex justify-end">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none"
              >
                Copy Email
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Powered by Mistral 7B via Hugging Face</p>
        <p>Note: Generated content may require verification</p>
      </div>
    </div>
  );
};

export default EmailGenerator;
