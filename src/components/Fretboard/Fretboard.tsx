import type { Note, FretPosition } from '../../types';
import { getNoteAtPosition } from '../../data/notes';

interface FretboardProps {
  maxFret?: number;
  highlightPositions?: FretPosition[];
  targetNote?: Note | null;
  onPositionClick?: (position: FretPosition) => void;
  showAllNotes?: boolean;
  heatmapData?: Map<string, number>; // 位置键 -> 正确率
}

// 品位标记
const FRET_MARKERS = [3, 5, 7, 9, 12];

export function Fretboard({ 
  maxFret = 12, 
  highlightPositions = [], 
  targetNote,
  onPositionClick,
  showAllNotes = false,
  heatmapData,
}: FretboardProps) {
  // 弦名（从细到粗）
  const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];
  
  // 检查位置是否高亮
  const isHighlighted = (stringNum: number, fret: number) => {
    return highlightPositions.some(
      p => p.string === stringNum && p.fret === fret
    );
  };
  
  // 检查是否是目标音符位置
  const isTargetPosition = (stringNum: number, fret: number) => {
    if (!targetNote) return false;
    const note = getNoteAtPosition(stringNum, fret);
    return note.name === targetNote.name && note.octave === targetNote.octave;
  };
  
  // 获取热力图颜色
  const getHeatmapColor = (stringNum: number, fret: number) => {
    if (!heatmapData) return undefined;
    const key = `${stringNum}-${fret}`;
    const accuracy = heatmapData.get(key);
    if (accuracy === undefined) return undefined;
    
    // 红色（低）-> 黄色 -> 绿色（高）
    if (accuracy < 0.5) {
      return `rgba(239, 68, 68, ${0.3 + (1 - accuracy) * 0.4})`; // 红色
    } else if (accuracy < 0.8) {
      return `rgba(234, 179, 8, ${0.2 + accuracy * 0.3})`; // 黄色
    } else {
      return `rgba(34, 197, 94, ${0.2 + accuracy * 0.3})`; // 绿色
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-fit">
        {/* 指板主体 */}
        <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-inner">
          {/* 品位数字标记 */}
          <div className="flex border-b border-amber-300">
            <div className="w-8 h-6" /> {/* 弦名区域 */}
            {Array.from({ length: maxFret + 1 }, (_, fret) => (
              <div 
                key={fret} 
                className={`w-10 h-6 flex items-center justify-center text-xs text-amber-700 font-medium
                  ${fret === 0 ? '' : 'border-l border-amber-300'}`}
              >
                {fret === 0 ? '' : fret}
              </div>
            ))}
          </div>
          
          {/* 弦和品 */}
          {[1, 2, 3, 4, 5, 6].map((stringNum) => (
            <div key={stringNum} className="flex items-center">
              {/* 弦名 */}
              <div className="w-8 h-10 flex items-center justify-center text-sm font-medium text-amber-800">
                {stringNames[stringNum - 1]}
              </div>
              
              {/* 品位格子 */}
              {Array.from({ length: maxFret + 1 }, (_, fret) => {
                const note = getNoteAtPosition(stringNum, fret);
                const highlighted = isHighlighted(stringNum, fret);
                const isTarget = isTargetPosition(stringNum, fret);
                const heatmapColor = getHeatmapColor(stringNum, fret);
                
                return (
                  <div
                    key={fret}
                    onClick={() => onPositionClick?.({ string: stringNum, fret, note })}
                    className={`
                      w-10 h-10 flex items-center justify-center relative
                      transition-all duration-200 cursor-pointer
                      ${fret === 0 
                        ? 'border-r-2 border-amber-400' 
                        : 'border-l border-amber-300'
                      }
                      ${highlighted ? 'bg-blue-200' : ''}
                      ${isTarget ? 'bg-green-200 ring-2 ring-green-400' : ''}
                      hover:bg-amber-300/50
                    `}
                    style={heatmapColor ? { backgroundColor: heatmapColor } : undefined}
                  >
                    {/* 品位标记点 */}
                    {stringNum === 1 && FRET_MARKERS.includes(fret) && fret !== 0 && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                    )}
                    {stringNum === 1 && fret === 12 && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                      </div>
                    )}
                    
                    {/* 音符显示 */}
                    {(showAllNotes || highlighted || isTarget) && (
                      <span className={`
                        text-xs font-medium
                        ${isTarget ? 'text-green-700' : 'text-amber-800'}
                      `}>
                        {note.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* 弦的视觉表示 */}
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2, 3, 4, 5, 6].map((stringNum) => {
              const thickness = stringNum === 1 ? 0.5 : stringNum === 6 ? 2 : 1;
              return (
                <div
                  key={stringNum}
                  className="absolute left-8 right-0 bg-gray-400/30"
                  style={{
                    top: `${24 + (stringNum - 0.5) * 40}px`,
                    height: `${thickness}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
