export type Project = {
  slug: string
  title: string
  subtitle?: string
  role: string
  period: string
  team?: string
  platform: string[]
  kpis?: { label: string; value: string }[]
  cover: string
  tags: string[]
  summary: string
  cases: Array<{
    id: string
    title: string
    highlights: string[]
    media: Array<{
      type: 'image' | 'gif' | 'video' | 'embed'
      src: string
      caption?: string
      poster?: string
    }>
    articleMDX: string
  }>
}

const md = (strings: TemplateStringsArray) => strings[0]

export const projects: Project[] = [
  {
    slug: 'dahua2',
    title: '大话西游2',
    subtitle: '经典国风MMO·持续运营20年+',
    role: 'UI交互负责人',
    period: '2017-2022',
    team: '3交互、5视觉',
    platform: ['端游', '移动端'],
    kpis: [
      { label: '营收创近十年新高', value: ' ' },
    ],
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761445555/2e3d2637-d53e-40f2-b514-5cf3c3f70181.png',
    tags: ['MMO'],
    summary:
      '任《大话西游2》主交互，配合策划需求完成四年的核心运营活动及核心消费系统迭代，包括龙族资料片、藏宝阁、多宝阁，提升项目玩家活跃度及营收。',
    cases: [
      {
        id: 'manage',
        title: '团队协作管理',
        highlights: ['规范整理', '重复工作模版化', '沙龙经验分享'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491629/23c2f799-7dc3-4368-aa25-173251f0f296.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491871/8b951c5f-5a0a-42c6-8451-cab9ce89a7e7.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491473/ffacd032-d67d-47cd-be65-e5af2886eb52.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491484/175612ed-136e-43eb-8d76-89cd93a4dc56.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491547/845be891-c94c-4afd-a1c7-50e443ab707c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761491580/248f0ec2-8a6c-4f98-983d-ca7ccbe5136a.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491629/23c2f799-7dc3-4368-aa25-173251f0f296.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491871/8b951c5f-5a0a-42c6-8451-cab9ce89a7e7.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491473/ffacd032-d67d-47cd-be65-e5af2886eb52.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491484/175612ed-136e-43eb-8d76-89cd93a4dc56.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491547/845be891-c94c-4afd-a1c7-50e443ab707c.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761491580/248f0ec2-8a6c-4f98-983d-ca7ccbe5136a.png"
/>
        `,
      },
      {
        id: 'cangbao',
        title: '藏宝阁 优化',
        highlights: [
          '提升筛选、搜索、浏览效率',
          '算法推荐UI迭代',
          '提升交易费收入',
        ],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761466133/b01badd9-c89c-4bd6-ba9b-c167d5b4da0f.png',
          },
          {
            type: 'video',
            src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1761466878/20251026-161913_ah3i5v.mp4',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761466890/2183e3ef-b3e4-4faf-b71f-27ac1742350c.png',
          },
          {
            type: 'video',
            src: 'https://res.cloudinary.com/dnhjgceru/video/upload/v1761467742/20251026-163343_ntooi2.mp4',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761467779/20251026-162625_f8ehl0.gif',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761467782/20251026-162835_vsqeak.gif',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761466133/b01badd9-c89c-4bd6-ba9b-c167d5b4da0f.png"
/>
<div class="tiptap-video-wrapper">
  <video
    class="tiptap-video"
    controls="true"
    src="https://res.cloudinary.com/dnhjgceru/video/upload/v1761466878/20251026-161913_ah3i5v.mp4"
  ></video>
</div>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761466890/2183e3ef-b3e4-4faf-b71f-27ac1742350c.png"
/>
<div class="tiptap-video-wrapper">
  <video
    class="tiptap-video"
    controls="true"
    src="https://res.cloudinary.com/dnhjgceru/video/upload/v1761467742/20251026-163343_ntooi2.mp4"
  ></video>
</div>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761467779/20251026-162625_f8ehl0.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761467782/20251026-162835_vsqeak.gif"
/>
        `,
      },
      {
        id: 'duobao',
        title: '多宝阁 优化',
        highlights: ['瀑布流设计', '算法推荐', '场景化设计'],
        media: [
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468013/20251026-163907_swab87.gif',
          },
          {
            type: 'gif',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468282/20251026-164135_avxsrl.gif',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761468295/59c9be58-2ea4-41f3-acca-156e81a99b2f.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468013/20251026-163907_swab87.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468282/20251026-164135_avxsrl.gif"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761468295/59c9be58-2ea4-41f3-acca-156e81a99b2f.png"
/>
        `,
      },
      {
        id: 'liutong',
        title: 'MMO资源流通 优化',
        highlights: ['资源从何而来', '获得资源的瞬间', '更加便捷地消耗'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761479819/Frame_1_2_ryapjb.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761479819/Frame_1_2_ryapjb.png"
/>
        `,
      },
      {
        id: 'gaojiazhi',
        title: '高价值奖励分享优化',
        highlights: ['优化视觉呈现', '提升易用性', '移动端社交平台分享'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480721/0fd1d9aa-5c15-4b67-9b36-c9b1737990ba.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480721/0fd1d9aa-5c15-4b67-9b36-c9b1737990ba.png"
/>
        `,
      },
      {
        id: 'social',
        title: '社交优化',
        highlights: ['回流玩法迭代', '社会临场感交互理论', '社交细节迭代'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761489967/a524ec4f-2ddd-45f5-ba36-09862769cf80.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480652/fe4d09db-fe8a-418b-895b-aeaf70b6b4d4.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761480685/541e44d0-b95b-4e92-ab58-f6ae8cc1be2b.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761489967/a524ec4f-2ddd-45f5-ba36-09862769cf80.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480652/fe4d09db-fe8a-418b-895b-aeaf70b6b4d4.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761480685/541e44d0-b95b-4e92-ab58-f6ae8cc1be2b.png"
/>
        `,
      },
    ],
  },
  {
    slug: 'myth-quest',
    title: '圣境之塔',
    subtitle: '二次元 · MMO',
    role: '交互设计专家',
    period: '2022至今',
    team: '1交互、3视觉',
    platform: ['iOS', 'Android'],
    kpis: [
      { label: '全球上线流水', value: '1亿美元+' },
    ],
    cover: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761541786/c9b5dc67-ac8d-42c0-9863-4383b110fae3.png',
    tags: ['二次元', 'MMO', '手游'],
    summary:
      '负责从0到1将交互流程融入到原开发流程之中,整理UI交互规范,梳理开发新流程,现已平稳运行3年并推广至新项目;\n先后跟进项目上线欧美、日、韩、国服，保障全球各区运营活动需求以及养成线拓展，全球累计流水已达上亿美元;\n持续总结经验,在公司进行演讲分享,进行UX知识的传播与布道',
    cases: [
      {
        id: 'Consistency',
        title: 'UI规范整理/Figma控件库搭建',
        highlights: ['UI资源整理', '构建Figma控件库', '弹窗一致性优化'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542177/8826a0ab-5121-48d9-93ef-d0c1d1b04a5d.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542188/d08670e4-d5a3-4991-a409-d5a09cc7464c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542203/6131d2b5-07f0-46c1-a311-ed6ecddf0bd0.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542177/8826a0ab-5121-48d9-93ef-d0c1d1b04a5d.png"
/>
<h2>通用一级/二级/弹窗规范：</h2>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542188/d08670e4-d5a3-4991-a409-d5a09cc7464c.png"
/>
        <img
          class="rounded-xl border border-border/40"
          src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542203/6131d2b5-07f0-46c1-a311-ed6ecddf0bd0.png"
        />
        `,
      },
      {
        id: 'UEprocess',
        title: '从0-1构建游戏交互流程',
        highlights: ['岗位作用', '流程介绍', '寻求支持'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553748/8f24bd84-ac7a-4e42-aa48-f9f88d8d5ffd.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553766/0c64f9f0-a485-476a-8f61-5c70da64b042.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553781/9ea8e7c0-c72e-4889-b26c-88b99a7dbac2.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553793/f54c22d0-8644-44c9-9468-d1e8ff0ad3b4.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553834/b1d7e18d-28cb-4df7-82aa-734ae22cc479.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553871/3276cf1a-0259-4c0e-9f5f-c81325b9f169.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553904/8920c66b-75e1-4d40-8035-15dd59c43976.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553921/efd53b13-abca-4832-a28a-cd2d101ec736.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553998/c2a10351-a2b1-43ac-87c8-313852c1d8ef.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761553988/1efde7df-6d92-4d56-90be-8beb117296d2.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554032/cdf90913-1f1c-4f15-9cb8-36ddcd909c5f.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554008/d5adc6b7-d988-495d-8bad-a81420bd4ea3.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554045/1e1bd8d4-ebe8-4fa1-aaab-fb6933be0f44.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554039/36c9faa0-526e-44e5-9f8d-917dc7f1ed94.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554397/fd1d0f64-3683-47a0-8b47-1050344278b0.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554416/601f643e-1885-4c4f-9aea-0cb6c89b5443.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554428/31c42521-3adf-4a1c-9e8e-5b15beb4906a.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554441/2a8dcb2b-c69e-4874-9bb9-a15b648c1ff8.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554474/7494c125-8360-43b6-b891-56c1e4c59778.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554457/e020eb11-488c-4857-9f7d-d6145b0c9f59.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554495/e803e706-a495-4e78-adae-3dce7b482c85.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554535/7f5a31b7-0a11-470a-818e-b5b7693e69af.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554541/bd7ebb0d-d8b9-46be-b873-05de2e34c668.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554527/5ed32c00-9c0f-466e-bdd4-ada0c5a725ea.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554973/98f93ad2-05c4-4d17-8188-e86eeeebd62f.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554978/51329413-e0f1-4dc6-a16f-01e5a055a77c.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761555006/a4c00767-ed8e-4b22-acf5-9618fef80b9b.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761554556/b672bd15-f612-4562-a1a7-831d61536c90.png',
          },
        ],
        articleMDX: md`
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553748/8f24bd84-ac7a-4e42-aa48-f9f88d8d5ffd.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553766/0c64f9f0-a485-476a-8f61-5c70da64b042.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553781/9ea8e7c0-c72e-4889-b26c-88b99a7dbac2.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553793/f54c22d0-8644-44c9-9468-d1e8ff0ad3b4.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553834/b1d7e18d-28cb-4df7-82aa-734ae22cc479.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553871/3276cf1a-0259-4c0e-9f5f-c81325b9f169.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553904/8920c66b-75e1-4d40-8035-15dd59c43976.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553921/efd53b13-abca-4832-a28a-cd2d101ec736.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553998/c2a10351-a2b1-43ac-87c8-313852c1d8ef.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761553988/1efde7df-6d92-4d56-90be-8beb117296d2.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554032/cdf90913-1f1c-4f15-9cb8-36ddcd909c5f.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554008/d5adc6b7-d988-495d-8bad-a81420bd4ea3.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554045/1e1bd8d4-ebe8-4fa1-aaab-fb6933be0f44.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554039/36c9faa0-526e-44e5-9f8d-917dc7f1ed94.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554397/fd1d0f64-3683-47a0-8b47-1050344278b0.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554416/601f643e-1885-4c4f-9aea-0cb6c89b5443.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554428/31c42521-3adf-4a1c-9e8e-5b15beb4906a.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554441/2a8dcb2b-c69e-4874-9bb9-a15b648c1ff8.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554474/7494c125-8360-43b6-b891-56c1e4c59778.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554457/e020eb11-488c-4857-9f7d-d6145b0c9f59.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554495/e803e706-a495-4e78-adae-3dce7b482c85.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554535/7f5a31b7-0a11-470a-818e-b5b7693e69af.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554541/bd7ebb0d-d8b9-46be-b873-05de2e34c668.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554527/5ed32c00-9c0f-466e-bdd4-ada0c5a725ea.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554973/98f93ad2-05c4-4d17-8188-e86eeeebd62f.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554978/51329413-e0f1-4dc6-a16f-01e5a055a77c.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761555006/a4c00767-ed8e-4b22-acf5-9618fef80b9b.png"
/>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761554556/b672bd15-f612-4562-a1a7-831d61536c90.png"
/>
        `,
      },
      {
        id: 'pay process',
        title: '付费货币不足流程优化',
        highlights: ['充值档位差值推荐', '缩短付费流程', '提升付费体验'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h3>迭代前</h3>
</blockquote>
<p>
  1、①→②跳转时，玩家不知道或者需要自己计算<u>充哪个档位</u>是最小能够满足彩晶的消耗(对于中小R比较精打细算)
</p>
<p>
  2、②→③，玩家充值完成后，需要重新进入商店找到想买的商品，中间又经过几个步骤，<u>操作繁琐</u>
</p>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542293/0ee2b05c-64d9-4a04-a371-f4c6955035b1.png"
/>
<blockquote>
  <h3>迭代后</h3>
</blockquote>
<ul>
  <li>
    <p>推荐充值档位</p>
  </li>
  <li>
    <p>缩短操作路径</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542302/3c53a59c-180f-4aca-bf6b-f3e9cd6aa6ab.png"
/>
        `,
      },
      {
        id: 'battlepass',
        title: 'BP优化',
        highlights: ['突出大奖', '价值换算', '付费率提升10%+'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542433/73ba6351-5925-46ba-8b23-2015754ee567.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542440/eaa86296-32a9-46e0-acc2-8aa45b583ab9.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542474/e61ee591-10e5-44a0-8421-381b947a1e2f.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h3>迭代前</h3>
</blockquote>
<ul>
  <li>
    <p>噱头大奖奖励不突出</p>
  </li>
  <li>
    <p>阶段性奖励不突出</p>
  </li>
  <li>
    <p>付费档奖励视觉上较弱</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542433/73ba6351-5925-46ba-8b23-2015754ee567.png"
/>
<blockquote>
  <h3>迭代后</h3>
</blockquote>
<ul>
  <li>
    <p>左边显示大奖轮播，新增花灵立绘展示</p>
  </li>
  <li>
    <p>阶段性奖励始终置于列表右边</p>
  </li>
  <li>
    <p>付费档奖励视觉上用暖色底突出</p>
  </li>
</ul>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542440/eaa86296-32a9-46e0-acc2-8aa45b583ab9.png"
/>
<blockquote>
  <h3>解锁弹窗迭代</h3>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542474/e61ee591-10e5-44a0-8421-381b947a1e2f.png"
/>
<h2>
  迭代数据提升：外放前后月份，<u>单项付费率提升10%+</u>
</h2>
        `,
      },
      {
        id: 'skillcircle',
        title: '技能轮盘迭代',
        highlights: ['费茨定律应用', '横屏操作热区', '易用性量化规则'],
        media: [
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542847/68acf950-7254-43b1-a56b-c62a960bd885.png',
          },
          {
            type: 'image',
            src: 'https://res.cloudinary.com/dnhjgceru/image/upload/v1761542708/eba52f3c-8d72-48df-977f-f8387643946e.png',
          },
        ],
        articleMDX: md`
<blockquote>
  <h2>迭代前</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542847/68acf950-7254-43b1-a56b-c62a960bd885.png"
/>
<blockquote>
  <h2>迭代分析、方案</h2>
</blockquote>
<img
  class="rounded-xl border border-border/40"
  src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761542708/eba52f3c-8d72-48df-977f-f8387643946e.png"
/>
        `,
      },
    ],
  },
]


