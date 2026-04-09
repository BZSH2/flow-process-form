import type { CSSProperties, SVGAttributes } from 'react'

/** 自定义 svg 图标组件属性 */
type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'name' | 'children'> & {
  /** 图标名，不含前缀，例如 menus-corgi */
  name: string
  /** sprite 符号前缀，默认 icon */
  prefix?: string
  /** 图标尺寸，支持 number 或 css 尺寸字符串 */
  size?: number | string
  /** 无障碍文案，传入后将作为可读图标 */
  label?: string
}

/** 基于 createSvgIconsPlugin 生成的 symbol 渲染图标 */
function Icon({
  name,
  prefix = 'icon',
  size = '1em',
  label,
  style,
  className,
  ...rest
}: IconProps) {
  const symbolId = `#${prefix}-${name}`
  const mergedStyle: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    verticalAlign: 'middle',
    ...style,
  }

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={mergedStyle}
      className={className}
      {...rest}
    >
      <use href={symbolId} />
    </svg>
  )
}

export type { IconProps }
export default Icon
