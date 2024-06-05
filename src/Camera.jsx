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
  const videoRef = useRef(null);

  const updateNextAudioSrc = (newUrl) => {
    if (newUrl) {
      setNextAudioSrc(newUrl);
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setHasPermission(true);
        startStreaming(stream, updateNextAudioSrc, language);
        VoiceGuide(language, setAudioSrc);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, [language]);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleAudioEnding = () => {
    setAudioSrc(nextAudioSrc);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      {hasPermission ? (
        <video
          autoPlay
          ref={video => {
            if (video) {
              video.srcObject = videoStream;
            }
          }}
       
        />
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
      </Box>
    </div>
  );
};

export default Camera;

