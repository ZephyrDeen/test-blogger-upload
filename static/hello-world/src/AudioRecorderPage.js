import React from 'react';
import AudioRecorderComponent from './AudioRecorder';

function AudioRecorder({ onBackClick }) {
    return (
        <div>
            <button onClick={onBackClick} style={{ padding: '10px 20px', backgroundColor: '#007ac9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Go Back
            </button>
            <AudioRecorderComponent/>
            
        </div>
    );
}

export default AudioRecorder;