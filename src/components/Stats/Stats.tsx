import React from 'react';
import { Fretboard } from '@/components/Fretboard/Fretboard';
import { useGameStore } from '@/store/gameStore';

export const Stats: React.FC = () => {
  const { practiceHistory, heatmap, getCurrentAccuracy, getWeakNotes } = useGameStore();
  
  const weakNotes = getWeakNotes(5);
  const recentSessions = practiceHistory.slice(0, 5);
  
  // 计算总体统计
  const totalQuestions = practiceHistory.reduce((sum, s) => sum + s.totalQuestions, 0);
  const totalCorrect = practiceHistory.reduce((sum, s) => sum + s.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* 总体统计 */}
      <div className="card">
        <h3 className="text-lg font-medium text-soft-brown mb-4">练习统计</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-warm-beige/20 rounded-xl">
            <div className="text-3xl font-bold text-soft-brown">{practiceHistory.length}</div>
            <div className="text-xs text-text-secondary mt-1">练习次数</div>
          </div>
          <div className="text-center p-4 bg-warm-beige/20 rounded-xl">
            <div className="text-3xl font-bold text-soft-brown">{totalQuestions}</div>
            <div className="text-xs text-text-secondary mt-1">答题总数</div>
          </div>
          <div className="text-center p-4 bg-warm-beige/20 rounded-xl">
            <div className="text-3xl font-bold text-soft-brown">{overallAccuracy}%</div>
            <div className="text-xs text-text-secondary mt-1">总体正确率</div>
          </div>
        </div>
        
        {/* 薄弱音符 */}
        {weakNotes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">需要加强练习的音符</h4>
            <div className="flex flex-wrap gap-2">
              {weakNotes.map(note => (
                <span 
                  key={note} 
                  className="px-3 py-1 bg-accent-rose/30 text-deep-brown rounded-full text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {weakNotes.length === 0 && practiceHistory.length === 0 && (
          <p className="text-center text-text-secondary py-4">
            开始练习后这里会显示你的统计数据 📊
          </p>
        )}
      </div>
      
      {/* 指板热力图 */}
      <div className="card">
        <h3 className="text-lg font-medium text-soft-brown mb-4">指板热力图</h3>
        <p className="text-sm text-text-secondary mb-4">
          绿色表示掌握较好，黄色表示一般，红色表示需要加强
        </p>
        
        <Fretboard
          maxFret={12}
          heatmapData={heatmap}
          showNotes={false}
          interactive={false}
        />
        
        {/* 图例 */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/80" />
            <span className="text-xs text-text-secondary">掌握良好 (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/80" />
            <span className="text-xs text-text-secondary">一般 (50-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-error/80" />
            <span className="text-xs text-text-secondary">需加强 (&lt;50%)</span>
          </div>
        </div>
      </div>
      
      {/* 练习历史 */}
      {recentSessions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-soft-brown mb-4">最近练习</h3>
          
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center justify-between p-3 bg-warm-beige/10 rounded-xl"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {session.mode === 'note-location' ? '音符定位' : 
                     session.mode === 'interval-identification' ? '音程识别' : '和弦位置'}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {session.difficulty === 'beginner' ? '初级' : 
                     session.difficulty === 'intermediate' ? '中级' : '高级'} · 
                    {new Date(session.date).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-soft-brown">
                    {Math.round((session.correctAnswers / session.totalQuestions) * 100)}%
                  </div>
                  <div className="text-xs text-text-secondary">
                    {session.correctAnswers}/{session.totalQuestions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
