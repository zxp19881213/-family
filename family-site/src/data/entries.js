// 第一阶段用假数据。第二阶段接入 Cloudflare R2 / D1 后，
// 这里会换成从数据库读取的真实条目。
export const entries = [
  {
    id: 'e1',
    date: '2026-09-21',
    type: 'photo',
    title: '后院烧烤',
    body: '天气正好，爸爸掌勺,妹妹第一次自己翻烤串。',
    media: [
      { kind: 'image', placeholder: '烧烤照片 1' },
      { kind: 'image', placeholder: '烧烤照片 2' },
    ],
    comments: [
      { author: '妈妈', text: '这天的肉串真的绝了！' },
    ],
  },
  {
    id: 'e2',
    date: '2026-09-15',
    type: 'post',
    title: '给外婆过生日',
    body: '订了她最喜欢的红丝绒蛋糕，一大家子挤在一个屋子里，吹蜡烛的时候停电了，摸黑唱完了生日歌。',
    media: [],
    comments: [
      { author: '舅舅', text: '停电那段笑死我了，太经典了。' },
      { author: '外婆', text: '我很开心，谢谢你们。' },
    ],
  },
  {
    id: 'e3',
    date: '2026-09-02',
    type: 'video',
    title: '小侄子学走路',
    body: '摇摇晃晃走了五步，然后一屁股坐地上，笑得比谁都开心。',
    media: [{ kind: 'video', placeholder: '学走路视频' }],
    comments: [],
  },
]
