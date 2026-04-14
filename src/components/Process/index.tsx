import { useEffect, useRef } from 'react'
import { LogicFlow } from '@logicflow/core'
import { BpmnElement, BpmnXmlAdapter, Control, Menu, SelectionSelect } from '@logicflow/extension'
import { processDndPanelPlugin, setupProcessDndPanel } from './dndpanel/index'
import register from './register'
import { injectMajorGrid } from './grid'
import '@logicflow/core/dist/index.css'
import '@logicflow/extension/lib/style/index.css'

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lfRef = useRef<LogicFlow | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    // 等同于默认属性如下
    const lf = new LogicFlow({
      // 容器配置
      container: containerRef.current,
      // 使用原生的交叉线网格，设置大小为 20px（小方格步长）
      grid: {
        type: 'mesh',
        size: 10,
        visible: true,
        config: {
          color: '#e5e8ec',
          thickness: 1,
        },
      },
      // 开启画布拖拽和平移
      stopMoveGraph: false,
      stopZoomGraph: false,
      metaKeyMultipleSelected: true,
      keyboard: {
        enabled: true,
      },
      snapline: true,
      plugins: [BpmnElement, BpmnXmlAdapter, Control, Menu, SelectionSelect, processDndPanelPlugin],
    })
    lfRef.current = lf

    lf.register({
      ...register,
    })
    setupProcessDndPanel(lf)

    // 渲染空画布或传入初始化数据
    lf.render({})

    // 注入大网格辅助线
    injectMajorGrid(lf, containerRef.current, 50)

    return () => {
      lf.destroy()
      lfRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" />
}
