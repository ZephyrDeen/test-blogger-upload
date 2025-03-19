import React, { useState, useRef, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import CustomAudioPlayer from './CustomAudioPlayer';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
                console.log('Permission Granted');
                setIsBlocked(false);
            })
            .catch((error) => {
                console.error('Error getting user media:', error);
                setIsBlocked(true);
            });
    }, []);

    const startRecording = () => {
        if (isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder.start()
                .then(() => {
                    setIsRecording(true);
                    console.log('Recording started successfully.');
                })
                .catch((e) => {
                    console.error('Error starting recording:', e);
                    setIsRecording(false);
                });
        }
    };

    const stopRecording = () => {
        Mp3Recorder.stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setIsRecording(false);
                console.log('Recording stopped, audio URL created:', url);
                setAudioBlob(blob);
            })
            .catch((e) => {
                console.error('Error stopping recording or creating audio URL:', e);
                setIsRecording(false);
            });
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
            setAudioBlob(file);
            console.log('Audio file uploaded:', file.name);
        }
    };

    return (
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '20px' }}>Audio Recorder</h1>

            {isRecording ? (
                <button
                    onClick={stopRecording}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f89c1b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                    }}
                >
                    &#9724; Stop Recording
                </button>
            ) : (
                <button
                    onClick={startRecording}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007ac9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                    }}
                >
                    {audioUrl ? "Re-record" : "Start Recording"}
                </button>
            )}
            <div style={{ marginTop: '20px' }}>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    style={{ marginBottom: '10px' }}
                />
            </div>

            {audioUrl && (
                <div style={{ marginTop: '20px' }}>
                    <CustomAudioPlayer audioUrl={audioUrl} audioBlob={audioBlob} />
                </div>
            )}
        </div>
    );
}

export default AudioRecorder;