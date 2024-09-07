import React, { useState } from 'react';

const NFCReader = () => {
  const [status, setStatus] = useState('');
  const [lastScanned, setLastScanned] = useState(null);

  const handleScan = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('NFC not supported on this device');
      return;
    }

    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener("reading", ({ message }) => {
        if (message.records[0].recordType === "url") {
          const url = message.records[0].data;
          handleAttendanceRequest(url);
        }
      });

      setStatus('Ready to scan. Please tap the NFC tag.');
    } catch (error) {
      console.error('Error scanning NFC:', error);
      setStatus('Error initiating NFC scan');
    }
  };

  const handleAttendanceRequest = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('Attendance recorded successfully');
        setLastScanned(data);
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      setStatus('Error: Unable to record attendance');
    }
  };

  return (
    <div className="nfc-reader">
      <h2>NFC Attendance Reader</h2>
      <button onClick={handleScan}>
        Start NFC Scan
      </button>
      <p className="status">{status}</p>
      {lastScanned && (
        <div className="last-scanned">
          <h3>Last Scanned:</h3>
          <pre>{JSON.stringify(lastScanned, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default NFCReader;
