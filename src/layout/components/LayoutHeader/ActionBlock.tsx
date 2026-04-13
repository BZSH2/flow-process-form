import { Tooltip } from 'antd'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ActionBlockProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  children?: ReactNode
  title?: string
  icon?: string
  size?: number
}

export default forwardRef<HTMLButtonElement, ActionBlockProps>(function ActionBlock(
  { title, icon, size = 16, children, onClick, className = '', ...rest },
  ref
) {
  return (
    <Tooltip title={title}>
      <button
        ref={ref}
        className={`h-32px px-8px action-block rounded-8px flex cursor-pointer items-center justify-center border-none bg-transparent hover:bg-[var(--app-control-item-bg-hover)] ${className}`}
        type="button"
        onClick={onClick}
        {...rest}
      >
        {children || <Icon name={icon} size={size} />}
      </button>
    </Tooltip>
  )
})
