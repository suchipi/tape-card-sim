async function readFile(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  const result = await new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as any);
    reader.onerror = () => reject(reader.error);
  });

  return result;
}

export default async function getAudioData(
  file: File,
  audioContext: AudioContext
): Promise<{ forward: AudioBuffer; reverse: AudioBuffer }> {
  const [forward, reverse] = await Promise.all([
    readFile(file).then((result) => audioContext.decodeAudioData(result)),
    readFile(file).then((result) => audioContext.decodeAudioData(result)),
  ]);

  for (let i = 0; i < reverse.numberOfChannels; i++) {
    Array.prototype.reverse.call(reverse.getChannelData(i));
  }

  return { forward, reverse };
}
