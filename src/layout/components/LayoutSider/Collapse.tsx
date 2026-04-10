interface CollapseProps {
  collapse: boolean
  onToggleCollapse: () => void
}

export default function Collapse({ collapse, onToggleCollapse }: CollapseProps) {
  return (
    <div className="collapse items-center h-32px flex items-center justify-center">
      <button
        className="cursor-pointer border-none bg-transparent p-0"
        type="button"
        onClick={onToggleCollapse}
      >
        <Icon name="layout-fold" size={15} className={collapse ? 'rotate-180' : ''} />
      </button>
    </div>
  )
}
