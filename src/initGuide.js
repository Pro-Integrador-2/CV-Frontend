export const VoiceGuide = async (languageCode = 'es', setAudioSrc) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/voice-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language_code: languageCode }) 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error('Error fetching voice guide: ', error);
    }
  };