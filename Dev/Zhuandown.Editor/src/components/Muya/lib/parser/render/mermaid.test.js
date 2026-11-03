import StateRender from './index'
import renderMermaid from '../../renderers/mermaid'

jest.mock('../../renderers/mermaid', () => jest.fn())
jest.mock('../../renderers', () => jest.fn())
jest.mock('../../config', () => ({ CLASS_OR_ID: { AG_MATH_ERROR: 'ag-math-error' } }))
jest.mock('../../utils', () => ({ mixins: jest.fn() }))
jest.mock('./snabbdom', () => ({}))
jest.mock('../rules', () => ({}))
jest.mock('./renderInlines', () => ({}))
jest.mock('./renderBlock', () => ({}))

let renderer
let target

beforeEach(() => {
  renderMermaid.mockReset()
  window.actualTheme = 'dark'
  renderer = new StateRender({})
  target = document.createElement('div')
  target.id = 'diagram'
  document.body.appendChild(target)
})

afterEach(() => { document.body.innerHTML = '' })

function queue(code, version) {
  target.setAttribute('data-mermaid-version', version)
  renderer.mermaidCache.set('#diagram', { code, version })
  return renderer.renderMermaid()
}

test('连续编辑时较晚完成的旧任务不会覆盖新图', async () => {
  let finishOld
  renderMermaid.mockImplementationOnce(() => new Promise(resolve => { finishOld = resolve }))
    .mockResolvedValueOnce('<svg>new</svg>')
  const old = queue('old', '1')
  await queue('new', '2')
  finishOld('<svg>old</svg>')
  await old
  expect(target.textContent).toBe('new')
  expect(renderer.mermaidCache.size).toBe(0)
})

test.each(['empty', 'removed', 'theme', 'destroyed'])('等待期间发生 %s 时丢弃结果', async change => {
  let finish
  renderMermaid.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
  const pending = queue('old', '1')
  if (change === 'empty') target.setAttribute('data-mermaid-version', '2')
  if (change === 'removed') target.remove()
  if (change === 'theme') window.actualTheme = 'light'
  if (change === 'destroyed') renderer.muya.isDestroyed = true
  finish('<svg>old</svg>')
  await pending
  expect(target.innerHTML).toBe('')
})

test('错误代码修正后恢复显示并移除错误样式', async () => {
  renderMermaid.mockRejectedValueOnce(new Error('无效语法')).mockResolvedValueOnce('<svg>valid</svg>')
  await queue('invalid', '1')
  expect(target.classList.contains('ag-math-error')).toBe(true)
  await queue('valid', '2')
  expect(target.textContent).toBe('valid')
  expect(target.classList.contains('ag-math-error')).toBe(false)
})
