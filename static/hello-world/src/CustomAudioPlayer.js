import React, { useState, useRef, useEffect } from 'react';

const CustomAudioPlayer = ({ audioUrl, audioBlob }) => {
  console.log('CustomAudioPlayer props:', { audioUrl, audioBlob });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [pauseOffset, setPauseOffset] = useState(0);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const animationRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);


  useEffect(() => {
    console.log('Initializing AudioContext');
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        console.log('Closing AudioContext');
        audioContextRef.current.close();
      }
    };
  }, []);

  const loadAudio = async () => {
    if (!audioBlob) {
      console.log('No audioBlob provided');
      return;
    }

    try {
      console.log('Loading audio from Blob');
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      console.log('Audio buffer decoded successfully');
      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBuffer;

      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;

      audioSourceRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      audioSourceRef.current.onended = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        setPauseOffset(0);
      };
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };
  const updateProgress = () => {
    if (audioContextRef.current && isPlaying) {
      setProgress(((audioContextRef.current.currentTime - pauseOffset) / duration) * 100);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      try {
        if (audioSourceRef.current) {
          if (isPlaying) {
            audioSourceRef.current.stop();
          }
          audioSourceRef.current = null;
        }

        audioSourceRef.current = audioContextRef.current.createBufferSource();
        audioBlob.arrayBuffer().then((arrayBuffer) => {
          audioContextRef.current.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            audioSourceRef.current.buffer = audioBuffer;

            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.gain.value = volume;

            audioSourceRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);

            audioSourceRef.current.onended = () => {
              console.log('Audio playback ended');
              setIsPlaying(false);
              setPauseOffset(0);
              audioSourceRef.current = null;
            };

            audioSourceRef.current.start(0, pauseOffset);
            setIsPlaying(true);
          });
        });
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const pauseAudio = () => {
    if (audioSourceRef.current && isPlaying) {
      console.log('Pausing audio playback');
      audioSourceRef.current.stop();
      setPauseOffset(audioContextRef.current.currentTime);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      console.log('Stopping audio playback');
      audioSourceRef.current.stop();
      setIsPlaying(false);
      setPauseOffset(0);
      loadAudio();
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    console.log('Volume changed:', newVolume);
    setVolume(newVolume);

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };
  // Increase volume
  const increaseVolume = () => {
    const newVolume = Math.min(1, volume + 0.1); // Increase by 0.1, capped at 1
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    } else {
      console.error('gainNodeRef is not initialized');
    }
  };

  // Decrease volume
  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 0.1); // Decrease by 0.1, capped at 0
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    } else {
      console.error('gainNodeRef is not initialized');
    }
  };

  const handleProgressChange = (event) => {
    const newTime = (parseFloat(event.target.value) / 100) * duration;
    setPauseOffset(newTime);
    setProgress(event.target.value);
  };

  useEffect(() => {
    console.log('Loading audio for Blob:', audioBlob);
    loadAudio();
  }, [audioBlob]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-block' }}>
        <button
          onClick={playAudio}
          disabled={isPlaying || !audioBlob}
          style={{ padding: '8px 16px', margin: '4px', backgroundColor: isPlaying || !audioBlob ? '#ccc' : '#007ac9', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Play
        </button>
        <button
          onClick={pauseAudio}
          disabled={!isPlaying || !audioBlob}
          style={{ padding: '8px 16px', margin: '4px', backgroundColor: !isPlaying || !audioBlob ? '#ccc' : '#f89c1b', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Pause
        </button>
        <button
          onClick={stopAudio}
          disabled={!isPlaying || !audioBlob}
          style={{ padding: '8px 16px', margin: '4px', backgroundColor: !isPlaying || !audioBlob ? '#ccc' : '#f89c1b', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Stop
        </button>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          style={{ width: '300px', margin: '10px 0' }}
        />
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={decreaseVolume} disabled={!audioBlob}>
            -
          </button>
          <span>Volume: {Math.round(volume * 100)}%</span>
          <button onClick={increaseVolume} disabled={!audioBlob}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;