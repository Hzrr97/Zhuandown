import loadRenderer from './index'
import renderMermaid from './mermaid'

jest.mock('./index', () => jest.fn())

test('预览与导出串行使用各自主题，失败后继续渲染并清理临时节点', async () => {
  let finishPreview
  let startPreview
  const started = new Promise(resolve => { startPreview = resolve })
  const mermaid = {
    initialize: jest.fn(),
    render: jest.fn()
      .mockImplementationOnce(() => new Promise(resolve => {
        finishPreview = resolve
        startPreview()
      }))
      .mockRejectedValueOnce(new Error('无效语法'))
      .mockResolvedValueOnce({ svg: '<svg>export</svg>' })
  }
  loadRenderer.mockResolvedValue(mermaid)
  const preview = renderMermaid('graph TD; A-->B', 'dark')
  const invalid = renderMermaid('invalid', 'default')
  const failure = expect(invalid).rejects.toThrow('无效语法')
  const exported = renderMermaid('graph TD; C-->D', 'default')
  await started
  expect(mermaid.initialize).toHaveBeenCalledTimes(1)
  expect(mermaid.initialize).toHaveBeenLastCalledWith({
    startOnLoad: false, securityLevel: 'strict', theme: 'dark'
  })
  finishPreview({ svg: '<svg>preview</svg>' })
  await expect(preview).resolves.toBe('<svg>preview</svg>')
  await failure
  await expect(exported).resolves.toBe('<svg>export</svg>')
  expect(mermaid.initialize.mock.calls.map(([options]) => options.theme)).toEqual(['dark', 'default', 'default'])
  expect(new Set(mermaid.render.mock.calls.map(([id]) => id)).size).toBe(3)
  expect(document.body.childElementCount).toBe(0)
})

test('加载失败不会阻塞下一次渲染', async () => {
  loadRenderer.mockRejectedValueOnce(new Error('加载失败'))
    .mockResolvedValueOnce({ initialize: jest.fn(), render: jest.fn().mockResolvedValue({ svg: '<svg />' }) })
  await expect(renderMermaid('graph TD; A-->B', 'default')).rejects.toThrow('加载失败')
  await expect(renderMermaid('graph TD; A-->B', 'default')).resolves.toBe('<svg />')
})
