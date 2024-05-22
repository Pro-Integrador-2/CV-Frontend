import React, { useState, useEffect, useRef } from 'react';
import { RekognitionClient, StartStreamProcessorCommand, StopStreamProcessorCommand, PutObjectCommand } from '@aws-sdk/client-rekognition';
import { S3Client, PutObjectCommand as S3PutObjectCommand } from '@aws-sdk/client-s3';


const rekognitionClient = new RekognitionClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: '_____',
    secretAccessKey: '---'
  }
});

const s3Client = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: '____',
    secretAccessKey: '____'
  }
});

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setHasPermission(true);
        startStreaming(stream);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  const startStreaming = (stream) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8'
    });

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const videoBlob = new Blob([event.data], { type: 'video/webm' });

        const params = {
          Bucket: 'YOUR_S3_BUCKET_NAME', 
          Key: `videos/video-${Date.now()}.webm`, 
          Body: videoBlob,
          ContentType: 'video/webm'
        };

        try {
          await s3Client.send(new S3PutObjectCommand(params));
          console.log('Video chunk uploaded to S3');
        } catch (error) {
          console.error('Error uploading video chunk to S3:', error);
        }
      }
    };

    mediaRecorder.start(1000); 
  };

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
