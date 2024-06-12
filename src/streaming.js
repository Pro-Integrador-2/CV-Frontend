import socket from './socket';

const startStreaming = (canvasRef, videoRef) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');

  const sendFrame = () => {
    context.drawImage(video, 0, 0, 220, 140);
    const imageData = canvas.toDataURL('image/jpeg');
    const language = localStorage.getItem("language")
    socket.emit('upload_image', { image: imageData, language_code: language });
  };

  const startSendingFrames = () => {
    setInterval(sendFrame, 3600);
  };

  video.addEventListener('canplay', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    startSendingFrames();
  });
};

export default startStreaming;