import { useTransition, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui"
import { useIsMobile } from "@/hooks/use-mobile"

// Tab 路由配置
export const tabRoutes = [
  { path: "/w/watermark/", label: "水印", value: "watermark" },
  { path: "/w/register", label: "注册", value: "register" },
  { path: "/w/api", label: "API 数据", value: "api" },
]

interface TabNavigationProps {
  children: React.ReactNode
}

// Tab 布局组件 - 使用 React Router v7 的新 API 和 React 19.2 的 startTransition
export function TabNavigation({ children }: TabNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const isMobile = useIsMobile()

  // 根据当前路径确定激活的 tab - 使用 useMemo 缓存结果
  const activeTab = useMemo(() => {
    const currentPath = location.pathname
    const tab = tabRoutes.find((route) => currentPath === route.path)
    return tab?.value || "watermark"
  }, [location.pathname])

  // Tab 切换处理 - 使用 startTransition 优化路由切换性能
  const handleTabChange = (value: string) => {
    const route = tabRoutes.find((r) => r.value === value)
    if (route && location.pathname !== route.path) {
      // 使用 startTransition 标记路由切换为非紧急更新，提升用户体验
      // 这适用于桌面端和移动端
      startTransition(() => {
        navigate(route.path)
      })
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex-1 flex flex-col"
      >
        {/* 桌面端：顶部 tabs */}
        {!isMobile && (
          <div className="border-b px-4 py-2">
            <TabsList>
              {tabRoutes.map((route) => (
                <TabsTrigger
                  key={route.value}
                  value={route.value}
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {route.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        )}

        <div className={`flex-1 overflow-auto relative bg-background ${isMobile ? 'pb-20' : ''}`}>
          {/* 过渡进度条指示器 */}
          {isPending && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 z-50 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ 
                  width: '60%',
                  animation: 'shimmer 1.5s ease-in-out infinite'
                }} 
              />
            </div>
          )}
          
          {children}
        </div>

        {/* 移动端：底部 tabs with 液态玻璃效果 */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom pointer-events-none will-change-transform">
            <div className="apple-glass mx-4 mb-4 rounded-3xl px-2 py-2 shadow-2xl pointer-events-auto overflow-hidden will-change-transform">
              <TabsList className="w-full h-auto bg-transparent p-0 gap-1 rounded-none">
                {tabRoutes.map((route, index) => {
                  const isFirst = index === 0
                  const isLast = index === tabRoutes.length - 1
                  // 增大圆角，确保激活状态与容器对齐
                  const roundedClass = isFirst 
                    ? '!rounded-l-3xl !rounded-r-xl data-[state=active]:!rounded-l-3xl data-[state=active]:!rounded-r-xl' 
                    : isLast 
                    ? '!rounded-r-3xl !rounded-l-xl data-[state=active]:!rounded-r-3xl data-[state=active]:!rounded-l-xl' 
                    : '!rounded-xl data-[state=active]:!rounded-xl'
                  
                  return (
                    <TabsTrigger
                      key={route.value}
                      value={route.value}
                      disabled={isPending}
                      aria-busy={isPending}
                      className={`flex-1 h-12 text-xs border-0 data-[state=active]:bg-white/20 dark:data-[state=active]:bg-white/10 transition-colors duration-150 ${roundedClass}`}
                    >
                      {route.label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  )
}
