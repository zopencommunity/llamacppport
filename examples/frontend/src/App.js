import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Tools from './components/Tools';
import ChatMode from './components/ChatMode';
import CodeMode from './components/CodeMode';

function App() {
  const [currentMode, setCurrentMode] = useState('chat');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [codeResultShown, setCodeResultShown] = useState(false);

  // Initialize app
  useEffect(() => {
    setCurrentMode('chat');
  }, []);

  // Handle mode change
  const handleModeChange = (mode) => {
    if (
      (currentMode === 'explain' && mode === 'test') ||
      (currentMode === 'test' && mode === 'explain')
    ) {
      setCodeResultShown(false);
      setConversationStarted(false);
    }

    setCurrentMode(mode);

    // Reset conversation state when switching to code mode
    if (mode !== 'chat') {
      setConversationStarted(false);
      setCodeResultShown(false);
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="main-container">
        <div className="content" id="content">
          <Tools
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />

          {currentMode === 'chat' && (
            <ChatMode
              conversationStarted={conversationStarted}
              setConversationStarted={setConversationStarted}
            />
          )}

          {(currentMode === 'explain' || currentMode === 'test') && (
            <CodeMode
              mode={currentMode}
              codeResultShown={codeResultShown}
              setCodeResultShown={setCodeResultShown}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;