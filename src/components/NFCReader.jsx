import React, { useState, useCallback } from 'react';

const NFCReader = () => {
  const [status, setStatus] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (type, title, description) => {
    setAlertInfo({ type, title, description });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleReading = useCallback(async ({ message }) => {
    const records = [];
    for (const record of message.records) {
      if (record.recordType === "text") {
        const textDecoder = new TextDecoder(record.encoding);
        records.push({
          recordType: "text",
          data: textDecoder.decode(record.data)
        });
      } else if (record.recordType === "url") {
        records.push({
          recordType: "url",
          data: record.toRecords()[0].data
        });
      } else {
        records.push({
          recordType: record.recordType,
          data: "Data type not displayed"
        });
      }
    }
    setLastScanned(records);
    showAlert('success', 'NFC Read', 'Successfully read NFC tag');
  }, []);

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
      setStatus('Scan started. Please tap an NFC tag.');
      showAlert('info', 'Scanning Started', 'NFC scan initiated. Please tap an NFC tag.');
      
      ndef.addEventListener("reading", handleReading);
      alert(status)
    } catch (error) {
      alert(error)
      console.error('Error scanning NFC:', error);
      setStatus(`Error initiating NFC scan: ${error.message}`);
      showAlert('error', 'Scan Error', 'Failed to initiate NFC scan. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">NFC Reader</h2>
      <button 
        onClick={handleScan}
        disabled={isScanning}
        className={`w-full px-4 py-2 rounded text-white font-semibold ${
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