'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, CircularProgress, Select, MenuItem, FormControl, Chip, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/context/LanguageContext';

export default function ChatBot() {
  const defaultMessages = [
    { role: 'assistant', content: 'Namaste! I am your Voter Education Guide. Ask me anything about the voting process, registration deadlines, or how to find your polling place!' }
  ];
  
  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('gemma-2-2b-it');
  const messagesEndRef = useRef(null);

  const SUGGESTED_PROMPTS = [
    "How do I register to vote?",
    "What is an EVM?",
    "Elections in 2026?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages(defaultMessages);
    setInput('');
  };

  const containsPII = (text) => {
    // Basic regex for 12 digit numbers (Aadhar) or 10 char alphanumeric (PAN)
    const aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i;
    return aadharRegex.test(text) || panRegex.test(text);
  };

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isLoading) return;
    
    // Security Check: Client-Side PII Scrubber
    if (containsPII(textToSend)) {
      setMessages(prev => [...prev, 
        { role: 'user', content: textToSend },
        { role: 'assistant', content: "⚠️ **Security Alert:** I detected sensitive information (like an Aadhar or PAN number). For your privacy and security, I have blocked this message from being sent to our servers. Please ask your question without sharing personal details." }
      ]);
      setInput('');
      return;
    }

    // Ensure we are passing ONLY strings in the content field.
    // In React, sometimes event objects or empty spaces get appended.
    const cleanText = String(textToSend).trim();
    if (!cleanText) return;

    const newMessages = [...messages, { role: 'user', content: cleanText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, modelId: selectedModel, language })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || data.error || "Sorry, I couldn't process that."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Network error trying to reach the API."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'transparent' }}>
      {/* Premium Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: 0.5, color: '#1a1a1a' }}>
          <SmartToyIcon color="primary" /> {t('voterAI')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small">
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
              sx={{ 
                color: 'text.secondary', 
                fontSize: '0.8rem',
                borderRadius: 2,
                height: 32,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <MenuItem value="gemma-2-2b-it">Gemma 2 2B (15K/day)</MenuItem>
              <MenuItem value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite (500/day)</MenuItem>
              <MenuItem value="gemini-2.5-flash">Gemini 2.5 Flash (20/day)</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title={t('clearChat')}>
            <IconButton onClick={clearChat} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'rgba(255,0,0,0.1)' } }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((msg, i) => (
          <Box key={i} sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <Avatar sx={{ 
              bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.dark',
              width: 36, height: 36,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '2px solid rgba(255,255,255,0.05)'
            }}>
              {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
            </Avatar>
            <Box sx={{
              bgcolor: msg.role === 'user' ? '#fff4eb' : '#f8f9fa',
              p: 2.5,
              borderRadius: 3,
              borderTopRightRadius: msg.role === 'user' ? 4 : 24,
              borderTopLeftRadius: msg.role === 'user' ? 24 : 4,
              maxWidth: '85%',
              border: msg.role === 'user' ? '1px solid #ffe0b2' : '1px solid #e0e0e0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              color: '#1a1a1a',
              '& p': { margin: 0 },
              '& p:not(:last-child)': { marginBottom: '12px' },
              '& ul, & ol': { marginTop: '8px', marginBottom: 0, paddingLeft: '24px' },
              '& li': { marginBottom: '6px' },
              '& a': { color: '#FF9933', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }
            }}>
              {msg.role === 'user' ? (
                <Typography variant="body1" sx={{ fontWeight: 500, letterSpacing: 0.3 }}>{msg.content}</Typography>
              ) : (
                <Box sx={{ typography: 'body1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Box>
              )}
            </Box>
          </Box>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'center' }} className="animate-in delay-1">
            <Avatar sx={{ bgcolor: 'secondary.dark', width: 36, height: 36, border: '2px solid rgba(255,255,255,0.05)' }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <Box sx={{
              bgcolor: '#f8f9fa', p: 2, borderRadius: 3,
              border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2
            }}>
              <CircularProgress size={18} sx={{ color: '#FF9933' }} thickness={5} />
              <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }}>{t('searching')}</Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 3, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
        {/* Quick-Reply Suggested Prompts */}
        {messages.length === 1 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <Chip 
                key={index} 
                label={prompt} 
                onClick={() => handleSend(prompt)}
                clickable
                disabled={isLoading}
                sx={{ 
                  bgcolor: '#fff', 
                  color: '#1a1a1a',
                  border: '1px solid #e0e0e0',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  '&:hover': { bgcolor: '#FF9933', color: 'white', transform: 'translateY(-2px)', borderColor: '#FF9933' }
                }}
              />
            ))}
          </Box>
        )}
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('askQuestion')}
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleSend()} disabled={isLoading || !input.trim()} sx={{ color: '#fff', bgcolor: input.trim() ? '#FF9933' : '#e0e0e0', transition: 'all 0.2s', '&:hover': { bgcolor: input.trim() ? '#e68a2e' : '#e0e0e0' } }}>
                <SendIcon />
              </IconButton>
            ),
            sx: { borderRadius: '50px', bgcolor: '#fff', color: '#1a1a1a', '& fieldset': { borderColor: '#e0e0e0' }, transition: 'all 0.2s', '&:focus-within': { boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transform: 'translateY(-2px)', '& fieldset': { borderColor: '#FF9933 !important' } } }
          }}
        />
        
        {/* Compliance Footer */}
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: 'text.secondary', fontSize: '0.7rem', letterSpacing: 0.5 }}>
          {t('eduDisclaimer')} <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" style={{color: '#FF9933', textDecoration: 'none'}}>voters.eci.gov.in</a>.
        </Typography>
      </Box>
    </Box>
  );
}
