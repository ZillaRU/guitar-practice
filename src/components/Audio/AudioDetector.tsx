import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AudioDetectorProps {
  onPitchDetected?: (frequency: number) => void;
  onNoteDetected?: (note: string, cents: number) => void;
  className?: string;
}

export const AudioDetector: React.FC<AudioDetectorProps> = ({
  onPitchDetected,
  onNoteDetected,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [detectedCents, setDetectedCents] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 简单的音高检测算法（基于自相关）
  const detectPitch = useCallback((buffer: Float32Array, sampleRate: number): { frequency: number; confidence: number } | null => {
    // 检查信号强度
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    
    if (rms < 0.01) return null; // 信号太弱
    
    // 自相关算法
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let foundGoodCorrelation = false;
    
    // 找到相关峰值
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      let sum = 0;
      
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - correlation / MAX_SAMPLES;
      
      if (correlation > 0.9 && correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
        foundGoodCorrelation = true;
      } else if (foundGoodCorrelation) {
        // 找到峰值后，继续找几个样本，如果相关性下降就停止
        const r1 = correlation;
        const r2 = correlation;
        if (r1 < bestCorrelation - 0.1) break;
      }
    }
    
    if (bestOffset === -1 || bestCorrelation < 0.8) {
      return null;
    }
    
    // 计算频率
    const frequency = sampleRate / bestOffset;
    
    return { frequency, confidence: bestCorrelation };
  }, []);
  
  // 频率转音符
  const frequencyToNote = useCallback((frequency: number): { note: string; cents: number } => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const A4 = 440;
    const halfSteps = 12 * Math.log2(frequency / A4);
    const roundedHalfSteps = Math.round(halfSteps);
    const cents = Math.round(1200 * halfSteps - roundedHalfSteps * 100);
    const noteIndex = ((roundedHalfSteps % 12) + 12 + 9) % 12; // A是索引9
    
    return {
      note: noteNames[noteIndex],
      cents,
    };
  }, []);
  
  // 开始监听
  const startListening = useCallback(async () => {
    try {
      setError(null);
      
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      // 创建音频上下文
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // 创建分析器
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      // 连接节点
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;
      
      // 开始检测循环
      const bufferLength = analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      
      const detect = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getFloatTimeDomainData(buffer);
        
        const result = detectPitch(buffer, audioContext.sampleRate);
        
        if (result) {
          onPitchDetected?.(result.frequency);
          
          const { note, cents } = frequencyToNote(result.frequency);
          setDetectedNote(note);
          setDetectedCents(cents);
          setConfidence(result.confidence);
          onNoteDetected?.(note, cents);
        } else {
          setDetectedNote(null);
          setConfidence(0);
        }
        
        animationFrameRef.current = requestAnimationFrame(detect);
      };
      
      detect();
      setIsListening(true);
      
    } catch (err) {
      console.error('Audio permission error:', err);
      setError('无法访问麦克风，请检查权限设置');
      setHasPermission(false);
    }
  }, [detectPitch, frequencyToNote, onPitchDetected, onNoteDetected]);
  
  // 停止监听
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsListening(false);
    setDetectedNote(null);
    setConfidence(0);
  }, []);
  
  // 清理
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);
  
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">实时音高检测</h3>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${isListening 
              ? 'bg-error text-white hover:bg-error/80' 
              : 'bg-accent-sage text-white hover:bg-accent-sage/80'
            }
          `}
        >
          {isListening ? '停止检测' : '开始检测'}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-error/10 text-error text-sm rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {/* 检测结果显示 */}
      <div className="flex items-center justify-center gap-6 py-6">
        <div className="text-center">
          <div className={`
            text-5xl font-display font-bold transition-all duration-300
            ${detectedNote ? 'text-soft-brown' : 'text-text-secondary/30'}
            ${isListening && detectedNote ? 'animate-pulse-soft' : ''}
          `}>
            {detectedNote || '--'}
          </div>
          <p className="text-xs text-text-secondary mt-1">检测到的音符</p>
        </div>
        
        {detectedNote && (
          <div className="text-center">
            <div className={`
              text-2xl font-medium transition-all duration-300
              ${Math.abs(detectedCents) < 10 ? 'text-success' : Math.abs(detectedCents) < 25 ? 'text-warning' : 'text-error'}
            `}>
              {detectedCents > 0 ? '+' : ''}{detectedCents}
            </div>
            <p className="text-xs text-text-secondary mt-1">cents 偏移</p>
          </div>
        )}
      </div>
      
      {/* 置信度条 */}
      {isListening && (
        <div className="mt-4">
          <div className="h-2 bg-warm-beige/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-sage to-accent-amber transition-all duration-200"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1 text-center">检测置信度</p>
        </div>
      )}
      
      {!hasPermission && !isListening && (
        <p className="text-sm text-text-secondary text-center">
          点击按钮开启麦克风进行实时音高检测
        </p>
      )}
    </div>
  );
};

export default AudioDetector;
