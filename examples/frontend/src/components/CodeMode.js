import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import './CodeMode.css';
import CONFIG from '../config';
import { parseAdvancedText } from './utils';

const CodeMode = ({ mode, codeResultShown, setCodeResultShown }) => {
  const [codeSource, setCodeSource] = useState('github');
  const [questionInput, setQuestionInput] = useState('');
  const [formData, setFormData] = useState({
    repoInput: '',
    basedir: 'yes',
    folderInput: '',
    fileInput: '',
    pathInput: ''
  });
  const [inputInfo, setInputInfo] = useState(null);
  const [response, setResponse] = useState('');
  const [formattedResponse, setFormattedResponse] = useState('');
  const [previousMode, setPreviousMode] = useState(mode);

  const codeSourceRef = useRef(null);
  const containerRef = useRef(null);
  const responseRef = useRef(null);

  // Clear form when switching between explain and test modes
  useEffect(() => {
    // Check if we're switching between explain and test modes
    if (
      (previousMode === 'explain' && mode === 'test') ||
      (previousMode === 'test' && mode === 'explain')
    ) {
      // Clear all form state
      setInputInfo(null);
      setResponse('');
      setFormattedResponse('');
      setCodeResultShown(false);
      setQuestionInput('');
      setCodeSource('github'); // Reset to default
      setFormData({
        repoInput: '',
        basedir: 'yes',
        folderInput: '',
        fileInput: '',
        pathInput: ''
      });
    }
    
    // Update previous mode for next comparison
    setPreviousMode(mode);
  }, [mode, previousMode, setCodeResultShown]);

  // Handle source change - Wrapped in useCallback
  // This function is stable across renders as long as setFormData doesn't change (which it won't)
  const handleSourceChange = useCallback(() => {
    if (codeSource === 'github') {
      setFormData(prev => ({
        ...prev,
        basedir: 'yes',
        folderInput: ''
      }));
    }
  }, [codeSource]); // codeSource is a dependency because the logic depends on its value

  // Initialize form data - Now handleSourceChange is defined before this useEffect
  useEffect(() => {
    handleSourceChange();
  }, [codeSource, handleSourceChange]); // handleSourceChange is now a stable dependency due to useCallback

  // Auto-scroll to response when it's displayed
  useEffect(() => {
    if (codeResultShown && responseRef.current) {
      setTimeout(() => {
        responseRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 50);
    }
  }, [codeResultShown, response]);

  // Auto-focus and scroll when component mounts or mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (codeSourceRef.current && !inputInfo) {
        // Smooth scroll to container first
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Then focus with a slight delay for smoothness
        setTimeout(() => {
          codeSourceRef.current.focus();
        }, 200);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [mode, inputInfo]);

  // Handle base directory change
  const handleBaseDirChange = (value) => {
    setFormData(prev => ({
      ...prev,
      basedir: value,
      folderInput: value === 'yes' ? '' : ''
    }));
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get source info
  const getSourceInfo = () => {
    if (codeSource === 'github') {
      return {
        type: 'GitHub',
        repo: formData.repoInput || 'llamacppport',
        isBase: formData.basedir === 'yes',
        folder: formData.folderInput || '',
        file: formData.fileInput || 'buildenv'
      };
    } else {
      return {
        type: 'Local File System',
        path: formData.pathInput || '/data/work/ai/mcp/mcp_server.py'
      };
    }
  };

  // Handle code submit
  const handleCodeSubmit = async () => {
    const question = questionInput.trim();
    if (!question) {
      console.error('Please enter a question about the code.');
      return;
    }

    const sourceInfo = getSourceInfo();
    setInputInfo({ question, sourceInfo });

    // Decide endpoint based on mode
    const endpoint = mode === "explain" ? "explain" : "tests";
    const filename = sourceInfo.isBase
      ? sourceInfo.file
      : `${sourceInfo.folder}/${sourceInfo.file}`;

    let body = {};
    if (sourceInfo.type === "GitHub") {
      body = {
        file: filename,
        repo: sourceInfo.repo,
        org: "zopencommunity"
      };
    } else {
      body = {
        file_path: sourceInfo.path
      };
    }

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, question: question })
      });

      const data = await res.json();
      setResponse(data.response);
      // Format the response for display
      setFormattedResponse(parseAdvancedText(data.response));
      setCodeResultShown(true);
    } catch (err) {
      const errorMessage = "Error: Could not connect to server.";
      setResponse(errorMessage);
      setFormattedResponse(parseAdvancedText(errorMessage));
      setCodeResultShown(true);
      console.error(err);
    }
  };

  // Handle Enter key press for code submit
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCodeSubmit();
    }
  };

  // Restart code mode
  const restartCodeMode = () => {
    setInputInfo(null);
    setResponse('');
    setFormattedResponse('');
    setCodeResultShown(false);
    setQuestionInput('');
    setFormData({
      repoInput: '',
      basedir: 'yes',
      folderInput: '',
      fileInput: '',
      pathInput: ''
    });
  };

  return (
    <div
      ref={containerRef}
      className={`code-mode-container active ${mode}-mode`}
      id="codeModeContainer"
    >
      <div className="code-mode-header">
        <h3 id="codeModeTitle">
          {mode === 'explain' ? 'Get explanations for Code:' : 'Generate Tests for your Code:'}
        </h3>
      </div>

      {!inputInfo && (
        <div className="source-selection">
          <div className="form-row">
            <label className="label" htmlFor="codeSource">Source:</label>
            <select
              ref={codeSourceRef}
              id="codeSource"
              value={codeSource}
              onChange={(e) => setCodeSource(e.target.value)}
            >
              <option value="github">Zopencommunity GitHub</option>
              <option value="local">Local File System</option>
            </select>
          </div>

          <div id="codePrompting">
            {codeSource === 'github' ? (
              <>
                <div className="form-row">
                  <label className="label">Repository:</label>
                  <input
                    type="text"
                    value={formData.repoInput}
                    onChange={(e) => handleInputChange('repoInput', e.target.value)}
                    placeholder="repository name (example: llamacppport)"
                  />
                </div>
                <div className="form-row">
                  <label className="label">In base dir?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="basedir"
                        value="yes"
                        checked={formData.basedir === 'yes'}
                        onChange={(e) => handleBaseDirChange(e.target.value)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="basedir"
                        value="no"
                        checked={formData.basedir === 'no'}
                        onChange={(e) => handleBaseDirChange(e.target.value)}
                      /> No
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <label className="label">Folder Name:</label>
                  <input
                    type="text"
                    value={formData.folderInput}
                    onChange={(e) => handleInputChange('folderInput', e.target.value)}
                    placeholder={formData.basedir === 'yes' ? 'Not needed for base directory files' : 'folder name (example: patches)'}
                    disabled={formData.basedir === 'yes'}
                  />
                </div>
                <div className="form-row">
                  <label className="label">Filename:</label>
                  <input
                    type="text"
                    value={formData.fileInput}
                    onChange={(e) => handleInputChange('fileInput', e.target.value)}
                    placeholder="file name (example: buildenv)"
                  />
                </div>
              </>
            ) : (
              <div className="form-row">
                <label className="label">Path to file:</label>
                <input
                  type="text"
                  value={formData.pathInput}
                  onChange={(e) => handleInputChange('pathInput', e.target.value)}
                  placeholder="example: /data/work/ai/mcp/mcp_server.py"
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="questionInput">Question:</label>
            <textarea
              id="questionInput"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question about the code..."
              rows="4"
            />
          </div>

          <div className="form-row submit-row">
            <button className="submit-btn" id="codeSubmitBtn" onClick={handleCodeSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {inputInfo && (
        <div className="code-input-display">
          <div className="input-section">
            <h4>Your Request:</h4>
            <p>File Source: <strong>{inputInfo.sourceInfo.type}</strong></p>
            {inputInfo.sourceInfo.type === 'GitHub' ? (
              <>
                <p>Repository Name: <strong>{inputInfo.sourceInfo.repo}</strong></p>
                <p>Location: <strong>{inputInfo.sourceInfo.isBase ? 'Base directory' : inputInfo.sourceInfo.folder}</strong></p>
                <p>Filename: <strong>{inputInfo.sourceInfo.file}</strong></p>
              </>
            ) : (
              <p>Path to file: <strong>{inputInfo.sourceInfo.path}</strong></p>
            )}
            <p>Prompt: <strong>{inputInfo.question}</strong></p>
          </div>
        </div>
      )}

      {codeResultShown && (
        <div className="code-response-display" ref={responseRef}>
          <div className="response-section">
            <h4>Response:</h4>
            <div
              className="response-content"
              dangerouslySetInnerHTML={{ __html: formattedResponse }}
            />
            <div className="form-row restart-row">
              <button className="restart-btn" onClick={restartCodeMode}>
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeMode;