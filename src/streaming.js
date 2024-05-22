
import { RekognitionClient, StartStreamProcessorCommand, StopStreamProcessorCommand } from '@aws-sdk/client-rekognition';
import { S3Client, PutObjectCommand as S3PutObjectCommand } from '@aws-sdk/client-s3';
const rekognitionClient = new RekognitionClient({
    region: 'us-west-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: '/'
    }
});

const s3Client = new S3Client({
    region: 'us-west-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: '/'
    }
    
});

let cont = 0;

const startStreaming = (stream) => {
    if (cont > 5){
        return null;
    }
    else {
        cont++;
    }
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8'
    });

    mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
            const videoBlob = new Blob([event.data], { type: 'video/webm' });
            const params = {
                Bucket: 'my-audios-call-mp4',
                Key: `video-${Date.now()}.webm`,
                Body: videoBlob,
                ContentType: 'video/webm',
            };
            try {
                await s3Client.send(new S3PutObjectCommand(params));
                console.log('Video chunk uploaded to S3');
            } catch (error) {
                console.error('Error uploading video chunk to S3:', error);
            }
        }
    };

    mediaRecorder.start(3000);
};
export default startStreaming;