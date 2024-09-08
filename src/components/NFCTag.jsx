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
    const ndef = new NDEFReader();
    ndef.onreading = (event) => console.log("We read a tag!");
    
    function write(data, { timeout } = {}) {
      return new Promise((resolve, reject) => {
        const ctlr = new AbortController();
        ctlr.signal.onabort = () => reject("Time is up, bailing out!");
        setTimeout(() => ctlr.abort(), timeout);
    
        ndef.addEventListener(
          "reading",
          (event) => {
            ndef.write(data, { signal: ctlr.signal }).then(resolve, reject);
          },
          { once: true },
        );
      });
    }
    
    await ndef.scan();
    try {
      await write("Hello World", { timeout: 5_000 });
    } catch (err) {
      console.error("Something went wrong", err);
    } finally {
      console.log("We wrote to a tag!");
      alert('We wrote to a tag!');
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