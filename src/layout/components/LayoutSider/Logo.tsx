interface LogoProps {
  collapse: boolean
}

export default function Logo({ collapse }: LogoProps) {
  return (
    <div className="logo flex items-center justify-center h-44px font-bold font-size-16px">
      {/* 桌面端折叠时显示短标题，移动端抽屉内始终显示完整标题 */}
      {collapse ? 'FPF' : 'Flow Process Form'}
    </div>
  )
}
