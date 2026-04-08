import { withMinimumDelay } from '@/lib/sleep'

export type ValueProp = {
  title: string
  description: string
}

const valueProps: ValueProp[] = [
  {
    title: '复杂系统的交互梳理',
    description:
      '面对成长、交易、活动、资源流通等复杂系统，我会先拆清信息结构、任务路径与关键反馈，降低理解和操作成本。',
  },
  {
    title: '从体验问题到可落地方案',
    description:
      '不只停留在界面美化，而是把抽象体验问题转成页面结构、交互规则与协作可执行的设计方案，推动真正上线。',
  },
  {
    title: '用原型快速验证设计判断',
    description:
      '近年持续结合 AI Coding、前端原型与可玩 Demo，把静态方案尽快推进到可点击、可体验、可验证的状态。',
  },
]

export async function getValueProps() {
  return withMinimumDelay(Promise.resolve(valueProps))
}
