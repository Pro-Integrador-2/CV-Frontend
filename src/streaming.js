const startStreaming = (stream) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8'
    });
  
    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const videoBlob = new Blob([event.data], { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', videoBlob, `video-${Date.now()}.webm`);
  
        try {
          const response = await fetch('http://localhost:5000/upload', { 
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          console.log('Video uploaded and analyzed:', result);
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      }
    };
  
    mediaRecorder.start(1000); 
  };
  
  export default startStreaming;
  