import { Suspense, lazy } from "react"
import { useRoutes, Navigate } from "react-router-dom"
import { Toaster, TabsContent, Spinner, Skeleton } from "@/components/ui"
import { RegistrationForm } from "@/components/voip"
import { UserProfile } from "@/components/user/user-profile"
import { DataFetch } from "@/components/api"
import { TabNavigation } from "@/components/tab-navigation"

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

// 过渡加载占位符组件
const TransitionFallback = () => (
  <div className="flex min-h-full flex-col items-center justify-center gap-4">
    <Spinner className="size-8" />
    <div className="space-y-2 w-full max-w-md px-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)

// Tab 布局组件
const TabLayout = () => {
  return (
    <TabNavigation>
      <TabsContent 
        value="watermark" 
        className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
      >
        <Suspense fallback={<TransitionFallback />}>
          <div className="flex min-h-full flex-col items-center justify-center bg-muted/30 p-4">
            <LazyRegistrationForm />
          </div>
        </Suspense>
      </TabsContent>

      <TabsContent 
        value="register" 
        className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
      >
        <Suspense fallback={<TransitionFallback />}>
          <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
            <LazyUserProfile />
          </div>
        </Suspense>
      </TabsContent>

      <TabsContent 
        value="api" 
        className="m-0 h-full bg-background data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:duration-200"
      >
        <Suspense fallback={<TransitionFallback />}>
          <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4">
            <LazyDataFetch />
          </div>
        </Suspense>
      </TabsContent>
    </TabNavigation>
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