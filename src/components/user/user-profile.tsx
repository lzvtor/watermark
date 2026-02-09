import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui"
import { Badge } from "@/components/ui"
import { Separator } from "@/components/ui"
import { Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"

const UserProfile = () => {
  const userInfo = {
    name: "张三",
    email: "zhangsan@example.com",
    phone: "+86 138-0000-0000",
    location: "北京市朝阳区",
    joinDate: "2024-01-15",
    role: "管理员",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
  }

  const stats = [
    { label: "总订单", value: "1,234", icon: "📦" },
    { label: "总消费", value: "¥12,345", icon: "💰" },
    { label: "积分", value: "5,678", icon: "⭐" },
  ]

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>用户信息</CardTitle>
          <CardDescription>查看和管理您的个人资料</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 用户头像和信息 */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback>{userInfo.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {userInfo.role}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{userInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{userInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{userInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>加入于 {userInfo.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 统计数据 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">统计数据</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>您的账户最近的操作记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "登录系统", time: "2 小时前", icon: "🔐" },
              { action: "更新个人资料", time: "1 天前", icon: "✏️" },
              { action: "完成订单 #1234", time: "3 天前", icon: "✅" },
              { action: "修改密码", time: "1 周前", icon: "🔑" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { UserProfile }
