import React, { useState, useEffect } from 'react';

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setHasPermission(true);
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
    </div>
  );
};

export default Camera;

