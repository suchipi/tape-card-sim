async function readFile(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  const result = await new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as any);
    reader.onerror = () => reject(reader.error);
  });

  return result;
}

async function cutAudio(
  audioBuffer: AudioBuffer,
  [start, end]: [number, number]
): Promise<AudioBuffer> {
  if (start <= 0 && end >= audioBuffer.duration * audioBuffer.sampleRate) {
    return audioBuffer;
  }

  const startSample = Math.floor(start * audioBuffer.sampleRate);
  const endSample = Math.floor(end * audioBuffer.sampleRate);
  const samplesCount = endSample - startSample;

  const truncatedAudioBuffer = new AudioBuffer({
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    length: samplesCount,
  });

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const sourceData = audioBuffer.getChannelData(i);
    const truncatedData = truncatedAudioBuffer.getChannelData(i);

    truncatedData.set(sourceData.slice(startSample, endSample), 0);
  }

  return truncatedAudioBuffer;
}

function reversedAudioBuffer(audioBuffer: AudioBuffer): AudioBuffer {
  const reversed = new AudioBuffer({
    length: audioBuffer.length,
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
  });

  for (let i = 0; i < reversed.numberOfChannels; i++) {
    const sourceData = audioBuffer.getChannelData(i);
    const reversedData = reversed.getChannelData(i);
    reversedData.set(sourceData, 0);
    Array.prototype.reverse.call(reversedData);
  }

  return reversed;
}

export default async function getAudioData(
  file: File,
  range: [number, number],
  audioContext: AudioContext
): Promise<{ forward: AudioBuffer; reverse: AudioBuffer }> {
  const rawFileData = await readFile(file);
  const fullAudioBuffer = await audioContext.decodeAudioData(rawFileData);

  const forward = await cutAudio(fullAudioBuffer, range);
  const reverse = reversedAudioBuffer(forward);

  return { forward, reverse };
}
