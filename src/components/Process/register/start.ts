import { RectNode, RectNodeModel, h } from '@logicflow/core'

/** 负责数据逻辑 Model */
class StartReactModal extends RectNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 100
    this.height = 50
    this.radius = 10

    this.properties = {
      ...this.properties,
    }
  }

  // 自定义节点样式 (会覆盖主题设置)
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = '#F0F7FF' // 浅蓝色填充
    style.stroke = '#1890FF' // 蓝色边框
    return style
  }
}

// 3. 自定义视图 (View) - 负责外观渲染
class StartRectView extends RectNode {
  // 重写 getShape 方法，使用 h 函数组合 SVG 元素
  getShape() {
    const { x, y, width, height } = this.props.model
    const attrs = this.props.model.getNodeStyle()

    // 先绘制默认的矩形
    const rectShape = h('rect', {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      ...attrs,
    })

    // 再绘制一个自定义图标（例如一个圆形）
    const icon = h('circle', {
      cx: x,
      cy: y - height / 4,
      r: 10,
      fill: '#1890FF',
      stroke: '#FFF',
      strokeWidth: 2,
    })

    // 返回一个包含矩形和图标的 SVG 组 (group)
    return h('g', {}, [rectShape, icon])
  }
}

export { StartReactModal, StartRectView }
