import React, { useState, useEffect, useRef } from 'react';
import startStreaming from './streaming';
import { VoiceGuide } from './initGuide';
const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [nextAudioSrc, setNextAudioSrc] = useState(null);
  const videoRef = useRef(null);
  const updateNextAudioSrc = (newUrl) => {
    if (newUrl) {
      console.warn({ newUrl })
      setNextAudioSrc(newUrl);
    }
  }
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setHasPermission(true);
        startStreaming(stream, updateNextAudioSrc);
        VoiceGuide("es", setAudioSrc)
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);
  const handleAudioEnding = ()=>{
    setAudioSrc(nextAudioSrc)
    console.warn("Updated")
  }
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
      {audioSrc && <audio src={audioSrc} autoPlay onEnded={handleAudioEnding}/>}
    </div>
  );
};

export default Camera;
