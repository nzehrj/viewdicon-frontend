/**
 * Voice Activity Detection (VAD)
 * Detects when user is speaking vs silence
 */

export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private threshold: number;
  private isActive: boolean = false;

  constructor(threshold: number = 30) {
    this.threshold = threshold;
  }

  /**
   * Initialize VAD with audio stream
   */
  async initialize(stream: MediaStream): Promise<void> {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  /**
   * Check if voice is currently active
   */
  isVoiceActive(): boolean {
    if (!this.analyser || !this.dataArray) return false;

    const buffer = new Uint8Array(this.dataArray.length);
    this.analyser.getByteTimeDomainData(buffer);

    // Calculate RMS (Root Mean Square) for volume
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const normalized = (buffer[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / buffer.length);
    const volume = rms * 100;

    return volume > this.threshold;
  }

  /**
   * Get current audio level (0-100)
   */
  getAudioLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;

    const buffer = new Uint8Array(this.dataArray.length);
    this.analyser.getByteTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const normalized = (buffer[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / buffer.length);
    return Math.min(100, rms * 100);
  }

  /**
   * Start monitoring voice activity
   */
  startMonitoring(callback: (isActive: boolean, level: number) => void): void {
    this.isActive = true;

    const monitor = () => {
      if (!this.isActive) return;

      const voiceActive = this.isVoiceActive();
      const level = this.getAudioLevel();
      callback(voiceActive, level);

      requestAnimationFrame(monitor);
    };

    monitor();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isActive = false;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopMonitoring();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}

/**
 * Detect if audio contains speech
 */
export const detectSpeechInAudio = async (audioBlob: Blob): Promise<boolean> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Analyze audio data
  const channelData = audioBuffer.getChannelData(0);
  let sum = 0;
  for (let i = 0; i < channelData.length; i++) {
    sum += Math.abs(channelData[i]);
  }
  const average = sum / channelData.length;

  audioContext.close();

  // If average amplitude is above threshold, assume speech
  return average > 0.01;
};