import React, { useState, useEffect, useCallback } from 'react';

const charsets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  cleanEdges: boolean;
}

interface PasswordGeneratorProps {
  showToast: (message: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ showToast }) => {
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    cleanEdges: true,
  });
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [strength, setStrength] = useState({ score: 0, label: '', className: '' });

  const calculatePasswordStrength = useCallback((pw: string) => {
    if (!pw) {
      setStrength({ score: 0, label: '', className: '' });
      return;
    }

    const checks = {
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      numbers: /[0-9]/.test(pw),
      symbols: /[^A-Za-z0-9]/.test(pw),
    };

    let score = Object.values(checks).filter(Boolean).length;

    if (pw.length < 8 && score > 2) {
      score = 2; // Weak if short
    } else if (pw.length < 6) {
      score = 1; // Very weak if very short
    }

    const labels = ['', 'Very Weak', 'Weak', 'Medium', 'Strong'];
    const classNames = ['', 'very-weak', 'weak', 'medium', 'strong'];

    setStrength({
      score: score,
      label: labels[score] || '',
      className: classNames[score] || '',
    });
  }, []);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.uppercase) charset += charsets.uppercase;
    if (options.lowercase) charset += charsets.lowercase;
    if (options.numbers) charset += charsets.numbers;
    if (options.symbols) charset += charsets.symbols;

    if (!charset) {
      setPassword('');
      calculatePasswordStrength('');
      return;
    }
    
    let cleanCharset = (options.uppercase ? charsets.uppercase : '') + (options.lowercase ? charsets.lowercase : '') + (options.numbers ? charsets.numbers : '');
    if (cleanCharset === '') cleanCharset = charset;


    let newPassword = '';
    for (let i = 0; i < length; i++) {
        if(options.cleanEdges && (i === 0 || i === length - 1)) {
             newPassword += cleanCharset.charAt(Math.floor(Math.random() * cleanCharset.length));
        } else {
             newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }

    setPassword(newPassword);
    calculatePasswordStrength(newPassword);

    if (newPassword && newPassword !== password) {
      setHistory(prev => {
        const newHistory = [newPassword, ...prev.filter(p => p !== newPassword)];
        return newHistory.slice(0, 5);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options, calculatePasswordStrength]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleOptionChange = (option: keyof PasswordOptions) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleCopy = (text: string, type: 'main' | 'history') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast(type === 'main' ? 'Password copied!' : 'Copied from history!');
      if (type === 'main') {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      }
    });
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    showToast('History cleared!');
  }

  return (
    <div className="card">
      <h1 className="card-title">Password Generator</h1>
      <div className="card-content">
        <div className="password-container">
          <div className="password-output" aria-readonly="true">{password || '...'}</div>
        </div>

        <div className="strength-bar-container">
            <div className="strength-bar">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`strength-segment ${
                        i < strength.score ? `filled ${strength.className}` : ''
                        }`}
                    ></div>
                ))}
            </div>
            <p className="strength-label">{strength.label}</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="passwordLength">Password Length: {length}</label>
          <input 
            type="range" 
            id="passwordLength" 
            className="form-input"
            value={length} 
            min="4" 
            max="128"
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="checkbox-group">
          {(Object.keys(options) as Array<keyof PasswordOptions>).map(opt => (
            <label className="checkbox-item" htmlFor={opt} key={opt}>
              <input 
                type="checkbox" 
                className="checkbox"
                id={opt} 
                checked={options[opt]} 
                onChange={() => handleOptionChange(opt)} 
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace('Edges', ' Edges')}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="button-group">
        <button className="btn" onClick={generatePassword}>Generate Password</button>
        <button 
          className={`btn copy-btn ${copyButtonText === 'Copied!' ? 'copied' : ''}`} 
          onClick={() => handleCopy(password, 'main')}
        >
          {copyButtonText}
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-container">
          <div className="history-header">
            <h2 className="history-title">History</h2>
            <button className="clear-history-btn" onClick={handleClearHistory} title="Clear history">Clear</button>
          </div>
          <div className="history-list-wrapper">
            <ul className="history-list">
              {history.map((p, i) => (
                <li 
                  key={`${p}-${i}`} 
                  className="history-item"
                  onClick={() => handleCopy(p, 'history')}
                  title="Click to copy"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;