import { useTransition, Suspense, lazy } from "react"
import { useRoutes, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Toaster, Tabs, TabsList, TabsTrigger, TabsContent, Spinner, Skeleton } from "@/components/ui"
import { RegistrationForm } from "@/components/voip"
import { UserProfile } from "@/components/user/user-profile"
import { DataFetch } from "@/components/api"

// 懒加载组件以展示 Suspense 过渡效果
// 添加小延迟以展示过渡动画
const LazyRegistrationForm = lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return { default: RegistrationForm }
})
const LazyUserProfile = lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return { default: UserProfile }
})
const LazyDataFetch = lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return { default: DataFetch }
})

// Tab 路由配置
const tabRoutes = [
  { path: "/w/watermark/", label: "水印", value: "watermark" },
  { path: "/w/register", label: "注册", value: "register" },
  { path: "/w/api", label: "API 数据", value: "api" },
]

// 过渡加载占位符组件
const TransitionFallback = ({ isPending }: { isPending: boolean }) => (
  <div className="flex min-h-full flex-col items-center justify-center gap-4">
    <Spinner className="size-8" />
    {isPending && (
      <div className="space-y-2 w-full max-w-md px-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )}
  </div>
)

// Tab 布局组件 - 使用 React Router v7 的新 API 和 React 19.2 的 startTransition
const TabLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  // 根据当前路径确定激活的 tab
  const getActiveTab = () => {
    const currentPath = location.pathname
    const tab = tabRoutes.find((route) => currentPath === route.path)
    return tab?.value || "watermark"
  }

  // Tab 切换处理 - 使用 startTransition 优化路由切换性能
  const handleTabChange = (value: string) => {
    const route = tabRoutes.find((r) => r.value === value)
    if (route) {
      // 使用 startTransition 标记路由切换为非紧急更新，提升用户体验
      startTransition(() => {
        navigate(route.path)
      })
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Tabs
        value={getActiveTab()}
        onValueChange={handleTabChange}
        className="flex-1 flex flex-col"
      >
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

        <div className="flex-1 overflow-auto relative bg-background">
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
          
          <TabsContent 
            value="watermark" 
            className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
          >
            <Suspense fallback={<TransitionFallback isPending={isPending} />}>
              <div className="flex min-h-full flex-col items-center justify-center bg-muted/30 p-4">
                <LazyRegistrationForm />
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent 
            value="register" 
            className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
          >
            <Suspense fallback={<TransitionFallback isPending={isPending} />}>
              <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
                <LazyUserProfile />
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent 
            value="api" 
            className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
          >
            <Suspense fallback={<TransitionFallback isPending={isPending} />}>
              <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4">
                <LazyDataFetch />
              </div>
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

const routes = [
  {
    path: "/",
    element: <Navigate to="/w/watermark/" replace />,
  },
  {
    path: "/w/",
    element: <Navigate to="/w/watermark/" replace />,
  },
  {
    path: "/w/watermark/",
    element: <TabLayout />,
  },
  {
    path: "/w/register",
    element: <TabLayout />,
  },
  {
    path: "/w/api",
    element: <TabLayout />,
  },
]

function App() {
  const element = useRoutes(routes)

  return (
    <>
      <Toaster />
      {element}
    </>
  )
}

export default App