import React, { useState } from 'react';
import AudioRecorder from './AudioRecorderPage';
import HomePage from './HomePage';

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const handleRecordClick = () => {
        setCurrentPage('record');
    };

    const handleBackClick = () => {
        setCurrentPage('home');
    };

    let content;
    if (currentPage === 'home') {
        content = <HomePage onRecordClick={handleRecordClick} />;
    } else if (currentPage === 'record') {
        content = <AudioRecorder onBackClick={handleBackClick} />;
    }

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            {content}
        </div>
    );
};

export default App;