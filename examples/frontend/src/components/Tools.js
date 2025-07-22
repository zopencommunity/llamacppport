import React from 'react';

const InitialState = ({ currentMode, onModeChange }) => {
  return (
    <div className="initial-state" id="initialState">
      <p>What would you like to do today?</p>
      <div className="center-buttons">
        <button
          id="chatBtnCenter"
          className={currentMode === 'chat' ? 'active' : ''}
          onClick={() => onModeChange('chat')}
        >
          Chat
        </button>
        <button
          id="explainBtnCenter"
          className={currentMode === 'explain' ? 'active' : ''}
          onClick={() => onModeChange('explain')}
        >
          Explain Code
        </button>
        <button
          id="testBtnCenter"
          className={currentMode === 'test' ? 'active' : ''}
          onClick={() => onModeChange('test')}
        >
          Generate Tests
        </button>
      </div>
    </div>
  );
};

export default InitialState;