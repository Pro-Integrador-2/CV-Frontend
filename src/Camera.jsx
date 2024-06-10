import React, { useState, useEffect, useRef } from 'react';
import startStreaming from './streaming';
import socket from './socket';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { VoiceGuide } from './initGuide';
import translations from './translations';

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [nextAudioSrc, setNextAudioSrc] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'es');
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setHasPermission(true);
        localStorage.setItem('language', language);
        VoiceGuide(language, setAudioSrc);
        socket.on('audio-detection', (data) => {
          console.error(socket.id, data.session_id)
          if (socket.id === data.session_id) {
            const audioUrl = `data:audio/mp3;base64,${data.audio}`;
            updateNextAudioSrc(audioUrl)
          }
        });
        socket.on('disconnect', (reason) => {
          console.warn('Disconnected from WebSocket:', reason);
          const audioUrl = `/error-${language}.mp3`;
          setAudioSrc(audioUrl);
          setNextAudioSrc(null);
        });

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
      videoRef.current.play();
      startStreaming(canvasRef, videoRef);
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
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    VoiceGuide(newLanguage, setAudioSrc);
  };

  const { selectLanguage, noPermission, videoDescription, audioGuide } = translations[language];

  return (
    <div style={{ marginTop: '8px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel 
          id="language-select-label" 
          sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}
          htmlFor="language-select"
        >
          {selectLanguage}
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
          label={selectLanguage}
          aria-label={selectLanguage}
          sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiSelect-icon': {
              color: 'white',
            },
          }}
          inputProps={{
            sx: {
              color: 'white'
            }
          }}
        >
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="en">Inglés</MenuItem>
          <MenuItem value="fr">Francés</MenuItem>
          <MenuItem value="pt">Portugués</MenuItem>
          <MenuItem value="it">Italiano</MenuItem>
        </Select>
      </FormControl>
      {hasPermission ? (
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <video
            className="video"
            ref={videoRef}
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            aria-label={videoDescription}
          />
        </div>
      ) : (
        <p>{noPermission}</p>
      )}
      {audioSrc && (
        <audio
          src={audioSrc}
          autoPlay
          onEnded={handleAudioEnding}
          aria-label={audioGuide}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <div className="canvas-wrap" style={{ display: 'none' }}>
          <canvas
            className="canvas"
            width="220"
            height="140"
            ref={canvasRef}
            aria-hidden="true"
          />
        </div>
      </Box>
    </div>
  );
};

export default Camera;
