const startStreaming = (stream, updateNextAudioSrc) => {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.play();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const sendFrame = async () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://127.0.0.1:5000/upload-image', { // Cambia esto a la URL de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      updateNextAudioSrc(audioUrl);
    } catch (error) {
      console.error('Error sending frame: ', error);
    }
  };

  const startSendingFrames = () => {
    setInterval(sendFrame, 6000); // Envía una imagen cada segundo
  };

  video.addEventListener('canplay', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    startSendingFrames();
  });
};

export default startStreaming;