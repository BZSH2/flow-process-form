interface LogoProps {
  collapse: boolean
  isMobile: boolean
}

export default function Logo({ collapse, isMobile }: LogoProps) {
  return (
    <div className="logo flex items-center justify-center h-44px font-bold font-size-16px">
      {/* 桌面端折叠时显示短标题，移动端抽屉内始终显示完整标题 */}
      {collapse && !isMobile ? 'FPF' : 'Flow Process Form'}
    </div>
  )
}
