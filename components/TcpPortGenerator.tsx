import React, { useState, useEffect, useCallback } from 'react';

const services = [
  "HTTP",
  "HTTPS",
  "LuCI HTTP",
  "LuCI HTTPS",
  "SSH",
  "WG",
  "BACKUP"
];

interface PortMapping {
  name: string;
  port: number;
}

interface TcpPortGeneratorProps {
  showToast: (message: string) => void;
}

const TcpPortGenerator: React.FC<TcpPortGeneratorProps> = ({ showToast }) => {
  const [ports, setPorts] = useState<PortMapping[]>([]);
  const [copyButtonText, setCopyButtonText] = useState('Copy All');

  const generatePorts = useCallback(() => {
    const usedPorts = new Set<number>();
    const newPorts = services.map(name => {
      let port;
      do {
        port = Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
      } while (usedPorts.has(port));
      usedPorts.add(port);
      return { name, port };
    });
    setPorts(newPorts);
  }, []);

  useEffect(() => {
    generatePorts();
  }, [generatePorts]);

  const handleCopyPort = (port: number) => {
    navigator.clipboard.writeText(port.toString()).then(() => {
      showToast(`Port ${port} copied!`);
    });
  };

  const handleCopyAll = () => {
    const textToCopy = ports.map(p => `${p.name}: ${p.port}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('All ports copied!');
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy All'), 2000);
    });
  };

  return (
    <div className="card">
      <h1 className="card-title">TCP Port Generator</h1>
      <div className="card-content">
        {ports.map(({ name, port }) => (
          <div key={name} className="port-row">
            <div className="port-label">{name}:</div>
            <div className="port-number" onClick={() => handleCopyPort(port)} title="Click to copy">
              {port}
            </div>
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="btn" onClick={generatePorts}>Generate Again</button>
        <button 
          className={`btn copy-btn ${copyButtonText === 'Copied!' ? 'copied' : ''}`} 
          onClick={handleCopyAll}
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default TcpPortGenerator;