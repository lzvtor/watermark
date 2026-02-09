import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@/components/ui"
import { toast } from "sonner"

// 表单验证 schema
const formSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "用户名至少需要2个字符",
      })
      .max(50, {
        message: "用户名不能超过50个字符",
      }),
    email: z
      .string()
      .email({
        message: "请输入有效的邮箱地址",
      }),
    password: z
      .string()
      .min(8, {
        message: "密码至少需要8个字符",
      })
      .regex(/[A-Z]/, {
        message: "密码必须包含至少一个大写字母",
      })
      .regex(/[a-z]/, {
        message: "密码必须包含至少一个小写字母",
      })
      .regex(/[0-9]/, {
        message: "密码必须包含至少一个数字",
      }),
    confirmPassword: z.string().min(1, {
      message: "请确认密码",
    }),
    country: z.string().min(1, {
      message: "请选择国家",
    }),
    bio: z
      .string()
      .max(500, {
        message: "个人简介不能超过500个字符",
      })
      .optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "必须同意服务条款",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "密码不匹配",
        path: ["confirmPassword"],
      })
    }
  })

export type RegistrationFormValues = z.infer<typeof formSchema>

interface RegistrationFormProps {
  onSubmit?: (values: RegistrationFormValues) => void
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      bio: "",
      terms: false,
    },
  })

  // 监听密码和确认密码字段，当任一字段变化时触发确认密码字段的验证
  const password = form.watch("password")
  const confirmPassword = form.watch("confirmPassword")

  useEffect(() => {
    if (confirmPassword) {
      form.trigger("confirmPassword")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword])

  function handleSubmit(values: RegistrationFormValues) {
    if (onSubmit) {
      onSubmit(values)
    } else {
      console.log(values)
      toast.success("表单提交成功！", {
        description: `欢迎，${values.username}！`,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>用户注册表单</CardTitle>
        <CardDescription>
          请填写以下信息完成注册。所有字段都是必填的。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormDescription>
                    这将作为您的显示名称
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱地址</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    我们将使用此邮箱与您联系
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请再次输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>国家/地区</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择国家/地区" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cn">中国</SelectItem>
                      <SelectItem value="us">美国</SelectItem>
                      <SelectItem value="uk">英国</SelectItem>
                      <SelectItem value="jp">日本</SelectItem>
                      <SelectItem value="kr">韩国</SelectItem>
                      <SelectItem value="sg">新加坡</SelectItem>
                      <SelectItem value="au">澳大利亚</SelectItem>
                      <SelectItem value="ca">加拿大</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    选择您所在的国家或地区
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>个人简介（可选）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="介绍一下你自己..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    最多500个字符
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      我同意服务条款和隐私政策
                    </FormLabel>
                    <FormDescription>
                      您必须同意我们的服务条款才能继续
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end gap-4 px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                重置
              </Button>
              <Button type="submit">提交</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
