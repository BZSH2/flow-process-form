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
  /** 是否旋转 */
  spin?: boolean
}

/** 基于 createSvgIconsPlugin 生成的 symbol 渲染图标 */
function Icon({
  name,
  prefix = 'icon',
  size = '1em',
  label,
  spin = false,
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
  const baseClassName = spin ? 'app-svg-icon is-spin' : 'app-svg-icon'
  const mergedClassName = className ? `${baseClassName} ${className}` : baseClassName

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={mergedClassName}
      style={mergedStyle}
      {...rest}
    >
      <use href={symbolId} />
    </svg>
  )
}

export type { IconProps }
export default Icon
