import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { Badge } from "@/components/ui"
import { Globe, User, Mail, Phone, Building, MapPin } from "lucide-react"

// 使用 React 19 的 use hook 获取数据
// use hook 会自动处理 Promise 和 Suspense
const fetchUserData = async () => {
  // 使用 JSONPlaceholder API 获取用户数据
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
  if (!response.ok) {
    throw new Error("Failed to fetch user data")
  }
  return response.json()
}

const fetchPosts = async () => {
  // 获取用户的帖子
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5")
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }
  return response.json()
}

// 在组件外部创建 Promise，确保全局唯一
const userDataPromise = fetchUserData()
const postsPromise = fetchPosts()

// 用户信息组件 - 使用 use hook
const UserInfo = () => {
  // 使用组件外部的 Promise，确保只创建一次
  const user = use(userDataPromise)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          用户信息
        </CardTitle>
        <CardDescription>使用 React 19 的 use hook 获取数据</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">邮箱:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">电话:</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">网站:</span>
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {user.website}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">公司:</span>
            <span>{user.company.name}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">地址: </span>
            <span>
              {user.address.street}, {user.address.city}, {user.address.zipcode}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 帖子列表组件 - 使用 use hook
const PostsList = () => {
  // 使用组件外部的 Promise，确保只创建一次
  const posts = use(postsPromise)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          最新帖子
        </CardTitle>
        <CardDescription>用户最近发布的帖子</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post: { id: number; title: string; body: string }) => (
            <div
              key={post.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <h4 className="font-semibold mb-2 line-clamp-1">{post.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
              <Badge variant="secondary" className="mt-2">
                Post #{post.id}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 主组件
const DataFetch = () => {
  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold">API 数据展示</h1>
        <p className="text-muted-foreground">
          使用 React 19 的 <code className="px-2 py-1 bg-muted rounded text-sm">use</code> hook 获取数据
        </p>
      </div>

      <UserInfo />
      <PostsList />
    </div>
  )
}

export { DataFetch }
