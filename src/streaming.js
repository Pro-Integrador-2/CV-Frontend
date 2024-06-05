const startStreaming = (stream, updateNextAudioSrc, language) => {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.play();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const sendFrame = async () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://127.0.0.1:5000/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData, language_code: language}),
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
    setInterval(sendFrame, 6000);
  };

  video.addEventListener('canplay', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    startSendingFrames();
  });
};

export default startStreaming;
