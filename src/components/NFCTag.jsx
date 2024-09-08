import React, { useState } from 'react';

const NFCWriter = () => {
  const [message, setMessage] = useState('');
  const [isUrl, setIsUrl] = useState(false);
  const [status, setStatus] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const showAlert = (type, title, description) => {
    setAlertInfo({ type, title, description });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleWrite = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('NFC not supported on this device');
      showAlert('error', 'NFC Not Supported', 'This device does not support NFC functionality.');
      return;
    }

    if (!message) {
      showAlert('error', 'Invalid Input', 'Please enter a message to write to the NFC tag.');
      return;
    }

    setIsWriting(true);
    setStatus('Ready to write. Please tap the NFC tag.');

    try {
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          isUrl
            ? { recordType: 'url', data: message }
            : { recordType: 'text', data: new TextEncoder().encode(message) },
        ],
      });
      setStatus('Message written successfully to NFC tag.');
      showAlert('success', 'Write Successful', 'The message has been successfully written to the NFC tag.');
    } catch (error) {
      console.error('Error writing to NFC tag:', error);
      alert(error)
      setStatus('Error writing to NFC tag: ' + error.message);
      showAlert('error', 'Write Error', 'Failed to write to the NFC tag. Please try again.');
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">NFC Writer</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter message to write"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isUrl"
            checked={isUrl}
            onChange={(e) => setIsUrl(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isUrl">Write as URL</label>
        </div>
        <button
          onClick={handleWrite}
          disabled={isWriting}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
            isWriting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isWriting ? 'Writing...' : 'Write to NFC Tag'}
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">{status}</p>
      {alertInfo && (
        <div
          className={`mt-4 p-4 rounded-md ${
            alertInfo.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          <h3 className="font-semibold">{alertInfo.title}</h3>
          <p>{alertInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default NFCWriter;
