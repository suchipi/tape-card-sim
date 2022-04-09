export default async function getAudioData(
  file: File,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  const result = await new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as any);
    reader.onerror = () => reject(reader.error);
  });

  const audioBuffer = await audioContext.decodeAudioData(result);
  return audioBuffer;
}
