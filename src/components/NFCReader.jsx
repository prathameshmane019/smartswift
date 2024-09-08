import React, { useState, useEffect } from 'react';

const NFCReader = () => {
  const [status, setStatus] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const showAlert = (type, title, description) => {
    setAlertInfo({ type, title, description });
  };

  const handleScan = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('NFC not supported on this device');
      showAlert('error', 'NFC Not Supported', 'This device does not support NFC functionality.');
      return;
    }

    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      setIsScanning(true);
      setStatus('Ready to scan. Please tap the NFC tag.');
      showAlert('info', 'Scanning Started', 'NFC scan initiated. Please tap an NFC tag.');
      
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        if (message.records && message.records.length > 0) {
          const record = message.records[0];
          alert(record)
          if (record.recordType === "url") {
            const url = new TextDecoder().decode(record.data);
            handleAttendanceRequest(url, serialNumber);
          } else {
            showAlert('warning', 'Invalid Tag', 'The scanned tag does not contain a valid URL.');
          }
        }
      });

    } catch (error) {
      console.error('Error scanning NFC:', error);
      setStatus('Error initiating NFC scan');
      showAlert('error', 'Scan Error', 'Failed to initiate NFC scan. Please try again.');
    }
  };

  const handleAttendanceRequest = async (url, serialNumber) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber })
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('Attendance recorded successfully');
        setLastScanned(data);
        showAlert('success', 'Attendance Recorded', `Attendance for ${data.name} has been successfully recorded.`);
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
        showAlert('error', 'Attendance Error', `Failed to record attendance: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      setStatus('Error: Unable to record attendance');
      showAlert('error', 'Network Error', 'Unable to connect to the server. Please check your internet connection.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">NFC Attendance Reader</h2>
      <button 
        onClick={handleScan}
        disabled={isScanning}
        className={`px-4 py-2 rounded text-white ${
          isScanning 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isScanning ? 'Scanning...' : 'Start NFC Scan'}
      </button>
      <p className="mt-4 text-sm text-gray-600">{status}</p>
      {alertInfo && (
        <div className={`mt-4 p-4 rounded-md ${
          alertInfo.type === 'error' 
            ? 'bg-red-100 text-red-700' 
            : alertInfo.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
        }`}>
          <h3 className="font-semibold">{alertInfo.title}</h3>
          <p>{alertInfo.description}</p>
        </div>
      )}
      {lastScanned && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Last Scanned:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto text-sm">
            {JSON.stringify(lastScanned, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default NFCReader;