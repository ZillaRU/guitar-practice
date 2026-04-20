import { useGameStore } from '../../store/gameStore';

export function StatsPanel() {
  const { stats, resetStats } = useGameStore();
  
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;
  
  const avgTime = stats.averageResponseTime > 0 
    ? (stats.averageResponseTime / 1000).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* 正确率 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">正确率</div>
          <div className="text-3xl font-bold text-amber-700">{accuracy}%</div>
          <div className="text-xs text-gray-400 mt-1">
            {stats.correctAnswers} / {stats.totalQuestions}
          </div>
        </div>
        
        {/* 平均反应时间 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">平均反应时间</div>
          <div className="text-3xl font-bold text-amber-700">{avgTime}s</div>
        </div>
      </div>
      
      {/* 最近练习 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">上次练习</div>
        <div className="text-sm text-gray-700">
          {stats.lastPracticeDate 
            ? new Date(stats.lastPracticeDate).toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '暂无记录'
          }
        </div>
      </div>
      
      {/* 重置按钮 */}
      {stats.totalQuestions > 0 && (
        <button
          onClick={resetStats}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          重置统计数据
        </button>
      )}
    </div>
  );
}
