import socket from './socket';

export const VoiceGuide = async (language_code, setAudioSrc) => {
    socket.emit('voice_guide', { language_code });
    socket.on('audio-guide', (data) => {
        const audioUrl = `data:audio/mp3;base64,${data.audio}`;
        setAudioSrc(audioUrl);
    });
};