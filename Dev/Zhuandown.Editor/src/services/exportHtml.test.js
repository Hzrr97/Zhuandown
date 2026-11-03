import ExportHtml from './exportHtml'
import renderMermaid from '../components/Muya/lib/renderers/mermaid'

jest.mock('../components/Muya/lib/renderers/mermaid', () => jest.fn())
jest.mock('!!raw-loader!github-markdown-css/github-markdown.css', () => '', { virtual: true })
jest.mock('!!raw-loader!../assets/styles/exportStyle.css', () => '', { virtual: true })
jest.mock('!!raw-loader!prismjs/themes/prism.css', () => '', { virtual: true })
jest.mock('!!raw-loader!katex/dist/katex.css', () => '', { virtual: true })
jest.mock('!!raw-loader!../assets/styles/headerFooterStyle.css', () => '', { virtual: true })

beforeEach(() => {
  renderMermaid.mockReset()
  jest.spyOn(ExportHtml.prototype, 'renderDiagram').mockResolvedValue()
})

afterEach(() => {
  jest.restoreAllMocks()
  document.body.innerHTML = ''
})

test('导出等待 SVG，保留源码字符，单个坏图不阻断其他图', async () => {
  let finish
  let start
  const started = new Promise(resolve => { start = resolve })
  renderMermaid.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; start() }))
    .mockRejectedValueOnce(new Error('无效语法'))
    .mockResolvedValueOnce('<svg><text>最后一张图</text></svg>')
  const code = 'graph TD; A["中文 & <tag> &lt;literal&gt;"]-->B'
  const exporter = new ExportHtml([code, 'invalid', 'graph TD; C-->D'].map(text => `\`\`\`mermaid\n${text}\n\`\`\``).join('\n\n'))
  let completed = false
  const pending = exporter.renderHtml().then(html => { completed = true; return html })
  await started
  expect(completed).toBe(false)
  expect(renderMermaid).toHaveBeenNthCalledWith(1, code, 'default')
  finish('<svg><text>第一张图</text></svg>')
  const result = document.createElement('div')
  result.innerHTML = await pending
  expect(result.querySelectorAll('.mermaid svg')).toHaveLength(2)
  expect(result.textContent).toContain('< Invalid Mermaid Codes >')
  expect(result.textContent).toContain('最后一张图')
  expect(exporter.exportContainer).toBeNull()
  expect(document.querySelector('.ag-render-container')).toBeNull()
})

test('页眉页脚清洗保留 Mermaid 的 HTML 标签及 SVG 样式', async () => {
  renderMermaid.mockResolvedValue('<svg><style>.node{fill:red}</style><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">中文标签</div></foreignObject></svg>')
  const exporter = new ExportHtml('```mermaid\ngraph TD; A-->B\n```')
  const html = await exporter.generate({
    title: '测试',
    header: { type: 1, left: '<img src="x" onerror="alert(1)">', center: '', right: '' },
    footer: { left: '', center: '页脚', right: '' }
  })
  const result = new DOMParser().parseFromString(html, 'text/html')
  expect(result.querySelector('svg foreignObject').textContent).toBe('中文标签')
  expect(result.querySelector('svg style').textContent).toContain('fill:red')
  expect(result.querySelector('[onerror]')).toBeNull()
  expect(result.querySelector('.page-footer').textContent).toContain('页脚')
})

test('后续导出步骤异常时仍清理临时容器', async () => {
  ExportHtml.prototype.renderDiagram.mockRejectedValue(new Error('导出失败'))
  const exporter = new ExportHtml('普通正文')
  await expect(exporter.renderHtml()).rejects.toThrow('导出失败')
  expect(exporter.exportContainer).toBeNull()
  expect(document.querySelector('.ag-render-container')).toBeNull()
})
