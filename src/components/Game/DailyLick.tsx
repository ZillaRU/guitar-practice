import { useState, useEffect } from 'react';
import { LICKS_LIBRARY, getTodayLick, type GuitarLick } from '../../data/licks';

export function DailyLick() {
  const [lick, setLick] = useState<GuitarLick | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [expandedLick, setExpandedLick] = useState<string | null>(null);

  useEffect(() => {
    setLick(getTodayLick());
  }, []);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const difficultyLabels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  };

  const styleLabels: Record<string, string> = {
    rock: '摇滚',
    blues: '蓝调',
    metal: '金属',
    classic: '古典',
    acoustic: '民谣',
  };

  if (!lick) return null;

  return (
    <div className="space-y-6">
      {/* 今日乐句 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎸</span>
            <h3 className="text-lg font-semibold text-amber-800">今日乐句</h3>
          </div>
          <span className="text-sm text-gray-400">
            {new Date().toLocaleDateString('zh-CN', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </span>
        </div>

        {/* 乐句标题 */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{lick.name}</h2>
          {lick.artist && (
            <p className="text-gray-500 mt-1">{lick.artist}</p>
          )}
        </div>

        {/* 标签 */}
        <div className="flex gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[lick.difficulty]}`}>
            {difficultyLabels[lick.difficulty]}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
            {styleLabels[lick.style]}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
            调性: {lick.key}
          </span>
        </div>

        {/* 描述 */}
        <p className="text-gray-600 mb-6">{lick.description}</p>

        {/* Tab */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
          <pre className="text-green-400 font-mono text-sm whitespace-pre">
{lick.tab}
          </pre>
        </div>

        {/* 技巧标签 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">涉及技巧</div>
          <div className="flex flex-wrap gap-2">
            {lick.techniques.map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 练习建议 */}
        <div className="bg-amber-50 rounded-lg p-4 mb-4">
          <div className="font-medium text-amber-800 mb-2">
            📝 练习建议
          </div>
          <ul className="space-y-1">
            {lick.tips.map((tip, index) => (
              <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 建议练习时间 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>建议练习时间</span>
          <span className="font-medium text-amber-700">{lick.practiceTime} 分钟</span>
        </div>

        {/* 来源信息 */}
        {(lick.album || lick.year || lick.tutorialUrl || lick.songUrl) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-2">📚 参考资源</div>
            <div className="space-y-2">
              {lick.album && lick.year && (
                <div className="text-sm text-gray-600">
                  专辑: <span className="font-medium">{lick.album}</span> ({lick.year})
                </div>
              )}
              {lick.tabSource && (
                <div className="text-sm text-gray-600">
                  Tab来源: {lick.tabSource}
                </div>
              )}
              <div className="flex gap-3 mt-2">
                {lick.tutorialUrl && (
                  <a
                    href={lick.tutorialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                  >
                    📺 教程视频
                  </a>
                )}
                {lick.songUrl && (
                  <a
                    href={lick.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors"
                  >
                    🎵 原曲试听
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 浏览更多乐句 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="font-medium text-amber-800">浏览乐句库 ({LICKS_LIBRARY.length}条)</span>
          <span className="text-gray-400">{showAll ? '收起' : '展开'}</span>
        </button>

        {showAll && (
          <div className="mt-4 space-y-3">
            {LICKS_LIBRARY.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-lg">
                <button
                  onClick={() => setExpandedLick(expandedLick === item.id ? null : item.id)}
                  className="w-full p-3 flex items-center justify-between text-left"
                >
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    {item.artist && (
                      <div className="text-sm text-gray-500">{item.artist}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[item.difficulty]}`}>
                      {difficultyLabels[item.difficulty]}
                    </span>
                    <span className="text-gray-300">
                      {expandedLick === item.id ? '−' : '+'}
                    </span>
                  </div>
                </button>
                
                {expandedLick === item.id && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 my-3">{item.description}</p>
                    <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                      <pre className="text-green-400 font-mono text-xs whitespace-pre">
{item.tab}
                      </pre>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>练习时间: {item.practiceTime}分钟</span>
                      <div className="flex gap-2">
                        {item.tutorialUrl && (
                          <a
                            href={item.tutorialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-500 hover:underline"
                          >
                            📺 教程
                          </a>
                        )}
                        {item.songUrl && (
                          <a
                            href={item.songUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:underline"
                          >
                            🎵 原曲
                          </a>
                        )}
                      </div>
                    </div>
                    {item.album && item.year && (
                      <div className="mt-1 text-xs text-gray-400">
                        {item.album} ({item.year})
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 技巧说明 */}
      <div className="bg-amber-50 rounded-xl p-4">
        <h4 className="font-medium text-amber-800 mb-3">📖 Tab 符号说明</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">h</span> = 击弦 (hammer-on)
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">p</span> = 勾弦 (pull-off)
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">b</span> = 推弦 (bend)
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">r</span> = 放弦 (release)
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">/</span> = 滑音上滑
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">\\</span> = 滑音下滑
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">~~~</span> = 颤音 (vibrato)
          </div>
          <div className="text-gray-600">
            <span className="font-mono text-amber-700">t</span> = 点弦 (tap)
          </div>
        </div>
      </div>
    </div>
  );
}
