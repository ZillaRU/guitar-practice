import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note } from '../types';
import { frequencyToNote } from '../data/notes';

interface UsePitchDetectionOptions {
  onNoteDetected?: (note: Note, frequency: number, clarity: number) => void;
  enabled?: boolean;
}

export function usePitchDetection(options: UsePitchDetectionOptions = {}) {
  const { onNoteDetected, enabled = true } = options;
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 自相关算法检测音高
  const autoCorrelate = useCallback((buffer: Float32Array, sampleRate: number): number | null => {
    // 计算 RMS 能量
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    
    // 能量太低，认为是静音
    if (rms < 0.01) return null;

    // 自相关
    const SIZE = buffer.length;
    const correlations = new Float32Array(SIZE);
    
    for (let i = 0; i < SIZE; i++) {
      let sum = 0;
      for (let j = 0; j < SIZE - i; j++) {
        sum += buffer[j] * buffer[j + i];
      }
      correlations[i] = sum;
    }

    // 找到第一个峰值
    let foundPeak = false;
    let maxCorrelation = 0;
    let maxIndex = 0;
    
    const MIN_FREQ = 80;  // 吉他最低音 E2 ≈ 82Hz
    const MAX_FREQ = 1400; // 吉他最高音约 1318Hz
    const minPeriod = Math.floor(sampleRate / MAX_FREQ);
    const maxPeriod = Math.floor(sampleRate / MIN_FREQ);

    for (let i = minPeriod; i < Math.min(maxPeriod, SIZE); i++) {
      if (correlations[i] > correlations[i - 1] && correlations[i] > correlations[i + 1]) {
        if (correlations[i] > maxCorrelation) {
          maxCorrelation = correlations[i];
          maxIndex = i;
          foundPeak = true;
        }
      }
    }

    if (!foundPeak || maxIndex === 0) return null;
    
    // 抛物线插值提高精度
    const y1 = correlations[maxIndex - 1];
    const y2 = correlations[maxIndex];
    const y3 = correlations[maxIndex + 1];
    const denom = y1 - 2 * y2 + y3;
    
    let refinedIndex = maxIndex;
    if (denom !== 0) {
      refinedIndex = maxIndex + (y1 - y3) / (2 * denom);
    }

    const frequency = sampleRate / refinedIndex;
    return frequency;
  }, []);

  // 分析音频
  const analyze = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (frequency) {
      const note = frequencyToNote(frequency);
      if (note) {
        setCurrentNote(note);
        onNoteDetected?.(note, frequency, 1);
      }
    }

    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(analyze);
    }
  }, [autoCorrelate, isListening, onNoteDetected]);

  // 开始监听
  const startListening = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } 
      });
      
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;
      
      source.connect(analyser);
      
      setIsListening(true);
    } catch (err) {
      setError('无法访问麦克风，请检查权限设置');
      console.error('Microphone access error:', err);
    }
  }, []);

  // 停止监听
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsListening(false);
    setCurrentNote(null);
  }, []);

  // 监听状态变化
  useEffect(() => {
    if (isListening && enabled) {
      analyze();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, enabled, analyze]);

  // 清理
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    currentNote,
    error,
    startListening,
    stopListening,
  };
}
