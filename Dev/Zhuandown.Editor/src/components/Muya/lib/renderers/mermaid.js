import loadRenderer from './index'

let renderQueue = Promise.resolve()
let renderId = 0

export default function renderMermaid(code, theme) {
  // 初始化和渲染共同排队，避免导出与预览相互覆盖全局主题。
  const task = renderQueue.then(async () => {
    const mermaid = await loadRenderer('mermaid')
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.visibility = 'hidden'
    container.style.pointerEvents = 'none'
    document.body.appendChild(container)
    try {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme })
      const { svg } = await mermaid.render(`zhuandown-mermaid-${++renderId}`, code, container)
      return svg
    } finally {
      container.remove()
    }
  })
  // 单个错误不能中断后续图表任务。
  renderQueue = task.catch(() => {})
  return task
}
