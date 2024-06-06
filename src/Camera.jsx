import React, { useState, useEffect, useRef } from 'react';
import startStreaming from './streaming';
import { VoiceGuide } from './initGuide';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [nextAudioSrc, setNextAudioSrc] = useState(null);
  const [language, setLanguage] = useState('es');
  const [playNextAudio, setPlayNextAudio] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const updateNextAudioSrc = (newUrl) => {
    if (newUrl) {
      setNextAudioSrc(newUrl);
      if (playNextAudio) {
        setPlayNextAudio(false);
        setAudioSrc(newUrl);
      }
    } else {
      console.error('Failed to update next audio source.');
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 520, height: 340 } });
        setVideoStream(stream);
        setHasPermission(true);
        localStorage.setItem('language', language);
        VoiceGuide(language, setAudioSrc);
      } catch (err) {
        console.error('Error accessing camera: ', err);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, [language]);

  useEffect(() => {
    if (videoStream && videoRef.current && canvasRef.current) {
      videoRef.current.srcObject = videoStream;
      startStreaming(updateNextAudioSrc, canvasRef, videoRef);
    }
  }, [videoStream]);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleAudioEnding = () => {
    if (nextAudioSrc) {
      setAudioSrc(nextAudioSrc);
    } else {
      setPlayNextAudio(true);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    localStorage.setItem('language', event.target.value);
    VoiceGuide(event.target.value, setAudioSrc);
  };

  return (
    <div>
      {hasPermission ? (
        <video className="video" ref={videoRef} autoPlay />
      ) : (
        <p>No permission to access the camera.</p>
      )}
      {audioSrc && <audio src={audioSrc} autoPlay onEnded={handleAudioEnding} />}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControl variant="outlined">
          <InputLabel id="language-select-label" sx={{ color: 'white' }}>Idioma</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            onChange={handleLanguageChange}
            label="Idioma"
            sx={{ color: 'white' }}
            inputProps={{
              sx: { color: 'white' }
            }}
          >
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="en">Inglés</MenuItem>
            <MenuItem value="fr">Francés</MenuItem>
          </Select>
        </FormControl>
        <div className="canvas-wrap" style={{ display: 'none' }}>
          <canvas
            className="canvas"
            width="220"
            height="140"
            ref={canvasRef}
          />
        </div>
      </Box>
    </div>
  );
};

export default Camera;