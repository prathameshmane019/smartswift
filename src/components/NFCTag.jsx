// File: src/components/NFCTag.jsx
import React, { useState } from 'react';

const NFCTag = () => {
  const [studentId, setStudentId] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleActivate = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('NFC not supported on this device');
      return;
    }

    try {
      const ndef = new NDEFWriter();
      await ndef.write({
        records: [
          { recordType: "url", data: `${apiUrl}?studentId=${studentId}` }
        ]
      });
      setStatus('NFC Tag activated. Ready to be scanned.');
    } catch (error) {
      console.error('Error activating NFC:', error);
      setStatus('Error activating NFC tag');
    }
  };

  return (
    <div className="nfc-tag">
      <h2>NFC Tag Simulator</h2>
      <input 
        type="text" 
        placeholder="Student ID" 
        value={studentId} 
        onChange={(e) => setStudentId(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="API URL" 
        value={apiUrl} 
        onChange={(e) => setApiUrl(e.target.value)} 
      />
      <button onClick={handleActivate}>
        Activate NFC Tag
      </button>
      <p className="status">{status}</p>
    </div>
  );
};

export default NFCTag;
