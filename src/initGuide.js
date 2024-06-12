import socket from './socket';

export const VoiceGuide = async (language_code, setAudioSrc) => {
    const audioUrl = `/voiceGuide-${language_code}.mp3`;
    setAudioSrc(audioUrl);
    socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
        const audioUrl = `/error-${language_code}.mp3`;
        setAudioSrc(audioUrl);
    });
};