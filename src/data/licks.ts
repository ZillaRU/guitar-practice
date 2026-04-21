// 经典吉他乐句库 - 每日一条
// 数据来源：公开教学资源、公共领域音乐片段

export interface GuitarLick {
  id: string;
  name: string;
  artist?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  style: 'rock' | 'blues' | 'metal' | 'classic' | 'acoustic';
  key: string;
  description: string;
  techniques: string[];
  tab: string; // Tab格式
  tips: string[];
  practiceTime: number; // 建议练习时间（分钟）
  videoUrl?: string;
}

export const LICKS_LIBRARY: GuitarLick[] = [
  // ==================== 入门级 Riffs ====================
  {
    id: 'smoke-on-water',
    name: 'Smoke on the Water',
    artist: 'Deep Purple',
    difficulty: 'beginner',
    style: 'rock',
    key: 'G',
    description: '摇滚史上最经典的入门Riff，只需要4个音符！整首歌的主旋律都建立在这4个音符上。',
    techniques: ['单音拨弦', '弦间移动'],
    tab: `
e|---------------------------|
B|---------------------------|
G|---------------------------|
D|-------0---3---5-----------|
A|-------0---3---5-----------|
E|---------------------------|
    `,
    tips: [
      '使用下拨弦（全部向下）',
      '保持节奏稳定，每个音符时值相等',
      'D弦和G弦之间切换要干净',
      '建议BPM：80-100'
    ],
    practiceTime: 10,
  },
  {
    id: 'seven-nation-army',
    name: 'Seven Nation Army',
    artist: 'The White Stripes',
    difficulty: 'beginner',
    style: 'rock',
    key: 'E',
    description: '单弦演奏的经典Riff，用一只手指就能完成！只需要在E弦上滑动。',
    techniques: ['单弦演奏', '滑音'],
    tab: `
e|---------------------------------|
B|---------------------------------|
G|---------------------------------|
D|---------------------------------|
A|---------------------------------|
E|--7--7--10--7--5--3--2-----------|
    `,
    tips: [
      '全部用一根手指（建议无名指）',
      '滑音要流畅，不要断开',
      '注意节奏：哒-哒-哒哒-哒-哒-哒',
      '建议BPM：120'
    ],
    practiceTime: 10,
  },
  {
    id: 'iron-man',
    name: 'Iron Man',
    artist: 'Black Sabbath',
    difficulty: 'beginner',
    style: 'metal',
    key: 'E',
    description: '金属乐的开山之作，重型Riff的典范。学会它，你就入门金属吉他了！',
    techniques: ['强力和弦', '闷音'],
    tab: `
e|---------------------------|
B|---------------------------|
G|---------------------------|
D|--2--2--5--5--7--7--5------|
A|--2--2--5--5--7--7--5------|
E|--0--0--3--3--5--5--3------|
    `,
    tips: [
      '使用全部下拨',
      '手掌轻触琴弦实现闷音',
      '每个和弦要用力按实',
      '建议BPM：100'
    ],
    practiceTime: 15,
  },
  {
    id: 'sunshine-of-your-love',
    name: 'Sunshine of Your Love',
    artist: 'Cream',
    difficulty: 'beginner',
    style: 'rock',
    key: 'D',
    description: 'Eric Clapton的经典之作，蓝调摇滚的代表。这个Riff结合了音阶和和弦。',
    techniques: ['蓝调音阶', '推弦'],
    tab: `
e|-------------------------------------|
B|-------------------------------------|
G|-------------------------------------|
D|--0----3--0----3b4--0----------------|
A|----3--------3-------3--2--0---------|
E|----------------------------3--2-----|
    `,
    tips: [
      '3b4表示推半音',
      '注意推弦的音准',
      '节奏要稳重，蓝调感觉',
      '建议BPM：110'
    ],
    practiceTime: 15,
  },

  // ==================== 蓝调乐句 ====================
  {
    id: 'blues-lick-1',
    name: '蓝调基础乐句 #1',
    difficulty: 'beginner',
    style: 'blues',
    key: 'A',
    description: '最基础的A小调五声音阶乐句，适合作为Solo的开场。',
    techniques: ['Hammer-on', 'Pull-off'],
    tab: `
e|--------------------------5-5--|
B|--------------------5-8p5------|
G|-------------5-7-5-------------|
D|-------5-7---------------------|
A|---5-7-------------------------|
E|-------------------------------|
    `,
    tips: [
      'h = hammer-on（击弦）',
      'p = pull-off（勾弦）',
      '让乐句"呼吸"，结尾留一点空隙',
      '建议BPM：60-80'
    ],
    practiceTime: 15,
  },
  {
    id: 'blues-lick-2',
    name: '蓝调推弦乐句',
    difficulty: 'intermediate',
    style: 'blues',
    key: 'A',
    description: '经典推弦乐句，蓝调吉他手必备。推弦是让吉他"唱歌"的关键技巧。',
    techniques: ['推弦', 'Vibrato'],
    tab: `
e|------------------------------|
B|------------------------------|
G|----7b9r7-5-------------------|
D|--------------7-5-------------|
A|------------------7-5---------|
E|-----------------------5------|
    `,
    tips: [
      'b9 = 推到9品的音高',
      'r = release（放弦）',
      '推弦后可以加一点颤音',
      '推弦要稳，慢慢推到目标音高'
    ],
    practiceTime: 20,
  },
  {
    id: 'blues-lick-3',
    name: '蓝调Turnaround',
    difficulty: 'intermediate',
    style: 'blues',
    key: 'A',
    description: 'Turnaround是12小节蓝调结束时的经典乐句，用来回到开头。',
    techniques: ['Pull-off', '双音'],
    tab: `
e|------------------------------|
B|------------------5-8-5-------|
G|-------------5-7--------7-5---|
D|-------5-7-5------------------|
A|---5-7------------------------|
E|-5----------------------------|
    `,
    tips: [
      '在12小节的最后两拍演奏',
      '力度要渐强，制造紧张感',
      '结束后可以短暂停顿再回到开头',
      '建议BPM：80-100'
    ],
    practiceTime: 15,
  },
  {
    id: 'blues-lick-4',
    name: 'BB King 风格乐句',
    difficulty: 'intermediate',
    style: 'blues',
    key: 'Bb',
    description: '模仿BB King的标志性"蝴蝶颤音"和简洁乐句风格。',
    techniques: ['Vibrato', 'Bending'],
    tab: `
e|-------------------------------|
B|---8b9~~~--6h8p6---6-----------|
G|----------------8-----7b8r7-5--|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|
    `,
    tips: [
      '~~~ = 颤音，要像蝴蝶翅膀一样振动',
      'BB King的乐句很简洁，注重表情',
      '少即是多，每个音符都要有意义',
      '颤音要快速而稳定'
    ],
    practiceTime: 20,
  },

  // ==================== 摇滚乐句 ====================
  {
    id: 'rock-lick-1',
    name: 'E小调五声速弹',
    difficulty: 'intermediate',
    style: 'rock',
    key: 'E',
    description: '经典的E小调五声音阶速弹乐句，很多摇滚歌曲都有类似的片段。',
    techniques: ['Hammer-on', 'Pull-off', '交替拨弦'],
    tab: `
e|---------------------------------12-15-12----|
B|--------------------------12-15-----------15-|
G|----------------12-14-15----------------------|
D|----------12-14-------------------------------|
A|----12-14-------------------------------------|
E|12--------------------------------------------|
    `,
    tips: [
      '上行用hammer-on连接',
      '下行可以用交替拨弦',
      '保持每个音清晰',
      '从慢速开始，逐渐加速'
    ],
    practiceTime: 25,
  },
  {
    id: 'rock-lick-2',
    name: 'Jimmy Page 风格乐句',
    artist: 'Led Zeppelin 风格',
    difficulty: 'intermediate',
    style: 'rock',
    key: 'A',
    description: '模仿《Stairway to Heaven》中的经典乐句，Jimmy Page的标志性风格。',
    techniques: ['推弦', 'Pull-off', 'Vibrato'],
    tab: `
e|------------------------------------------|
B|----8b10r8--5-----------------------------|
G|----------------7-5----7b8r7--5-----------|
D|----------------------7---------7-5-------|
A|--------------------------------------7-5-|
E|------------------------------------------|
    `,
    tips: [
      '推弦要准，慢慢推到目标音高',
      '每个推弦后都加一点颤音',
      '节奏要自由一点，有情感',
      '这是蓝调摇滚的经典味道'
    ],
    practiceTime: 25,
  },
  {
    id: 'rock-lick-3',
    name: 'AC/DC 风格 Riff',
    artist: 'AC/DC 风格',
    difficulty: 'beginner',
    style: 'rock',
    key: 'E',
    description: 'Angus Young的标志性开放弦Riff，简单但充满力量。',
    techniques: ['强力和弦', '闷音'],
    tab: `
e|----------------------------------------|
B|----------------------------------------|
G|----------------------------------------|
D|--2--2----5--2----7--2----5--4--2-------|
A|--2--2----5--2----7--2----5--4--2-------|
E|--0--0----3--0----5--0----3--2--0-------|
    `,
    tips: [
      '全部下拨',
      '手掌闷音制造"chug"声',
      '注意空弦的节奏感',
      '摇摆感很重要'
    ],
    practiceTime: 15,
  },

  // ==================== 指弹/木吉他 ====================
  {
    id: 'acoustic-lick-1',
    name: 'E小调民谣乐句',
    difficulty: 'beginner',
    style: 'acoustic',
    key: 'E',
    description: '适合民谣吉他的简单乐句，利用开放弦创造共鸣。',
    techniques: ['指弹', '开放弦'],
    tab: `
e|--0----0----0----0----|
B|--0----0----0----0----|
G|--0----2----0----2----|
D|--2----2----2----2----|
A|--2----0----2----0----|
E|--0---------0---------|
    `,
    tips: [
      '用拇指弹低音弦',
      '用食指、中指、无名指弹高音弦',
      '保持开放弦的共鸣',
      '可以配合简单的节奏型'
    ],
    practiceTime: 15,
  },
  {
    id: 'acoustic-lick-2',
    name: 'Pink Floyd 风格乐句',
    artist: 'Pink Floyd 风格',
    difficulty: 'intermediate',
    style: 'acoustic',
    key: 'G',
    description: '《Wish You Were Here》开头的木吉他Solo片段。',
    techniques: ['滑音', '双音', 'Vibrato'],
    tab: `
e|------------------------------------------|
B|--/12--12--12--10h12--10--8---/7--7--7----|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|
    `,
    tips: [
      '/ = 滑音上滑',
      '双音要同时拨响',
      '滑音要流畅自然',
      'David Gilmour风格：简洁而深情'
    ],
    practiceTime: 20,
  },

  // ==================== 进阶技巧 ====================
  {
    id: 'sweep-lick-1',
    name: '基础扫拨乐句',
    difficulty: 'advanced',
    style: 'rock',
    key: 'Am',
    description: '扫拨（Sweep Picking）是速弹吉他的核心技巧，从简单的开始。',
    techniques: ['扫拨', 'Hammer-on', 'Pull-off'],
    tab: `
e|------------------------------17p12--------|
B|--------------------------13---------------|
G|----------------------14-------------------|
D|------------------14-----------------------|
A|--------------12---------------------------|
E|--12-15-17---------------------------------|
    `,
    tips: [
      '拨弦要像"扫"一样连续',
      '左手要同步按弦',
      '先慢练，确保每个音清晰',
      '这是Yngwie Malmsteen风格的入门'
    ],
    practiceTime: 30,
  },
  {
    id: 'tapping-lick-1',
    name: '基础点弦乐句',
    difficulty: 'advanced',
    style: 'rock',
    key: 'E',
    description: 'Eddie Van Halen开创的技巧，用右手手指敲击指板。',
    techniques: ['点弦', 'Hammer-on', 'Pull-off'],
    tab: `
e|--12t15p12h15p12----12t15p12h15p12----|
B|--------------------------------------|
G|--------------------------------------|
D|--------------------------------------|
A|--------------------------------------|
E|--------------------------------------|
    `,
    tips: [
      't = tap（点弦），用右手食指',
      '点弦后直接拉下做pull-off',
      '保持节奏均匀',
      '点弦要用力，确保声音清晰'
    ],
    practiceTime: 25,
  },

  // ==================== 音阶练习乐句 ====================
  {
    id: 'scale-lick-pentatonic',
    name: '五声音阶模进',
    difficulty: 'intermediate',
    style: 'rock',
    key: 'E',
    description: 'E小调五声音阶的模进练习，帮你熟悉整个指板。',
    techniques: ['模进', 'Hammer-on', 'Pull-off'],
    tab: `
e|------------------------------------12-15-|
B|----------------------------12-15---------|
G|----------------------12-14---------------|
D|----------------12-14---------------------|
A|----------12-14---------------------------|
E|----12-15---------------------------------|
    `,
    tips: [
      '上行：每次跳一根弦',
      '可以用hammer-on连接',
      '反向练习（下行）也很重要',
      '可以移到其他把位练习'
    ],
    practiceTime: 20,
  },
  {
    id: 'scale-lick-blues',
    name: '蓝调音阶乐句',
    difficulty: 'intermediate',
    style: 'blues',
    key: 'A',
    description: 'A蓝调音阶（小调五声 + 蓝音），是蓝调吉他手最重要的音阶。',
    techniques: ['推弦', 'Vibrato', '蓝音'],
    tab: `
e|--------------------------------------|
B|------5---6---8---6---5---------------|
G|------5---7---8---7---5---------------|
D|------5---7---7---7---5---------------|
A|------5---7-----------5---------------|
E|--------------------------------------|
    `,
    tips: [
      '第6品是"蓝音"（降五度）',
      '蓝音可以推一点，制造紧张感',
      '蓝调音阶 = 五声音阶 + 蓝音',
      '尝试在不同把位演奏'
    ],
    practiceTime: 20,
  },

  // ==================== 经典Solo片段 ====================
  {
    id: 'solo-californication',
    name: 'Californication Solo 片段',
    artist: 'Red Hot Chili Peppers',
    difficulty: 'intermediate',
    style: 'rock',
    key: 'Am',
    description: 'John Frusciante的旋律化Solo，简单但非常动听。',
    techniques: ['推弦', '滑音', 'Vibrato'],
    tab: `
e|-------------------------------------------|
B|--8b10--8--5-------------------------------|
G|---------------7--5--7b8--5----------------|
D|-----------------------------7--5--7-------|
A|-------------------------------------------|
E|-------------------------------------------|
    `,
    tips: [
      '推弦要准，注意目标音高',
      '旋律比速度更重要',
      '这是"唱出来"的吉他风格',
      '每个音都要有表情'
    ],
    practiceTime: 20,
  },
  {
    id: 'solo-teen-spirit',
    name: 'Smells Like Teen Spirit Solo',
    artist: 'Nirvana',
    difficulty: 'intermediate',
    style: 'rock',
    key: 'F',
    description: 'Kurt Cobain的Solo简单而直接，完美诠释了Grunge精神。',
    techniques: ['推弦', '滑音'],
    tab: `
e|------------------------------------------|
B|--6b8--6--3--1--3--6b8--6--3--1--3/6------|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|
    `,
    tips: [
      'Solo基本上是主旋律的吉他版',
      '推弦不需要太精准，有"粗糙感"',
      'Grunge风格：不完美就是完美',
      '情感比技巧重要'
    ],
    practiceTime: 15,
  },
];

// 获取今日乐句（基于日期）
export function getTodayLick(): GuitarLick {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % LICKS_LIBRARY.length;
  return LICKS_LIBRARY[index];
}

// 按难度筛选
export function getLicksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): GuitarLick[] {
  return LICKS_LIBRARY.filter(lick => lick.difficulty === difficulty);
}

// 按风格筛选
export function getLicksByStyle(style: 'rock' | 'blues' | 'metal' | 'classic' | 'acoustic'): GuitarLick[] {
  return LICKS_LIBRARY.filter(lick => lick.style === style);
}

// 随机获取
export function getRandomLick(): GuitarLick {
  return LICKS_LIBRARY[Math.floor(Math.random() * LICKS_LIBRARY.length)];
}
