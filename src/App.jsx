import React, { useState, useEffect } from 'react';
import NFCTag from './components/NFCTag';
import NFCReader from './components/NFCReader';
import './App.css';

function App() {
  const [mode, setMode] = useState('tag'); // 'tag' or 'reader'
  const [nfcSupported, setNfcSupported] = useState(false);

  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  return (
    <div className="App mx-10">
      <h1>NFC Attendance System</h1>
      {!nfcSupported && <p className="warning">NFC is not supported on this device.</p>}
      <div className="mode-switch">
        <button  onClick={() => setMode('tag')} className={`w-1/2 px-2 py-1 border-2   font-semibold rounded-xl ${mode === 'tag' ? 'active' : ''}`}>
          NFC Tag Mode
        </button>
        <button onClick={() => setMode('reader')}  className={`w-1/2 px-2 py-1 border-2  font-semibold rounded-xl ${mode === 'reader' ? 'active' : ''}`}>
          NFC Reader Mode
        </button>
      </div>
      {mode === 'tag' ? <NFCTag /> : <NFCReader />}
    </div>
  );
}

export default App;
