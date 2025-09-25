import React, { useState } from 'react';
import TcpPortGenerator from './components/TcpPortGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import ThemeSwitcher from './components/ThemeSwitcher';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  return (
    <div id="toast" className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
};

const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2500);
  };

  return (
    <>
      <ThemeSwitcher />
      <div className="glow-container">
        <main className="main-container">
          <TcpPortGenerator showToast={showToast} />
          <PasswordGenerator showToast={showToast} />
        </main>
      </div>
      <Toast message={toastMessage} show={isToastVisible} />
    </>
  );
};

export default App;