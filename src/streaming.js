import socket from './socket';

const startStreaming = (canvasRef, videoRef) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  let imageBuffer = [];
  const imagesToSend = 4;

  const sendFrame = () => {
    context.drawImage(video, 0, 0, 220, 140);
    const imageData = canvas.toDataURL('image/jpeg');
    imageBuffer.push(imageData);

    if (imageBuffer.length >= imagesToSend) {
      const language = localStorage.getItem("language");
      socket.emit('upload_images', { images: imageBuffer, language_code: language });
      imageBuffer = []; 
    }
  };

  const startSendingFrames = () => {
    setInterval(sendFrame, 1000); 
  };

  video.addEventListener('canplay', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    startSendingFrames();
  });
};

export default startStreaming;
