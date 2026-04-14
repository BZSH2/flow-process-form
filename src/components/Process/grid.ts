import type { LogicFlow } from '@logicflow/core'

/**
 * 注入大网格辅助线（蓝图双层网格效果）
 * @param lf LogicFlow 实例
 * @param container 画布容器
 * @param majorSize 大网格的尺寸（默认 50）
 */
export function injectMajorGrid(lf: LogicFlow, container: HTMLElement, majorSize: number = 50) {
  const lfGrid = container.querySelector('.lf-grid') as HTMLElement
  if (!lfGrid) {
    return
  }

  // 动态创建一个覆盖在大网格上的粗线层，复用原生网格机制的 transform 属性
  const patternId = 'lf-major-grid'
  const svg = lfGrid.querySelector('svg')

  if (!svg) {
    return
  }

  const defs = svg.querySelector('defs')
  // 读取原生小网格的 patternTransform
  const originalPattern = defs?.querySelector('pattern')
  const patternTransform = originalPattern?.getAttribute('patternTransform') || ''

  // 构造大网格 Pattern
  const majorPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
  majorPattern.setAttribute('id', patternId)
  majorPattern.setAttribute('patternUnits', 'userSpaceOnUse')
  majorPattern.setAttribute('x', '0')
  majorPattern.setAttribute('y', '0')
  majorPattern.setAttribute('width', String(majorSize))
  majorPattern.setAttribute('height', String(majorSize))
  // 跟随原生小网格一样的缩放平移矩阵
  majorPattern.setAttribute('patternTransform', patternTransform)

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', `M 0 0 H ${majorSize} V ${majorSize} H 0 Z`)
  path.setAttribute('fill', 'transparent')
  path.setAttribute('stroke', '#d4d9e1')
  path.setAttribute('stroke-width', '1') // 略微粗一点或深一点的颜色

  majorPattern.appendChild(path)
  defs?.appendChild(majorPattern)

  // 绘制覆盖的大网格矩形
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', '100%')
  rect.setAttribute('height', '100%')
  rect.setAttribute('fill', `url(#${patternId})`)
  svg.appendChild(rect)

  // 监听画布变换，实时同步矩阵属性给大网格 Pattern
  lf.on('graph:transform', ({ transform }) => {
    const matrixString = [
      transform.SCALE_X,
      transform.SKEW_Y,
      transform.SKEW_X,
      transform.SCALE_Y,
      transform.TRANSLATE_X,
      transform.TRANSLATE_Y,
    ].join(',')
    majorPattern.setAttribute('patternTransform', `matrix(${matrixString})`)
  })
}
