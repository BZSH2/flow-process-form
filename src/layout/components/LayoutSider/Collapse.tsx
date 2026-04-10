interface CollapseProps {
  collapse: boolean
  onToggleCollapse: () => void
}

export default function Collapse({ collapse, onToggleCollapse }: CollapseProps) {
  return (
    <div className="collapse items-center p-4px flex items-center justify-center">
      <button
        className="cursor-pointer w-full py-6px border-none bg-transparent  hover:bg-slate-100"
        type="button"
        onClick={onToggleCollapse}
      >
        <Icon name="layout-fold" size={15} className={collapse ? 'rotate-180' : ''} />
      </button>
    </div>
  )
}
