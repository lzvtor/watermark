import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import './App.css'

// 表单状态类型
interface FormState {
  success: boolean
  message: string
  data?: {
    name: string
    email: string
    message: string
  }
}

// 表单提交的 Action 函数
async function submitForm(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // 使用公开的 API 接口（JSONPlaceholder 的 posts API）
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: name,
        body: `${email} - ${message}`,
        userId: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('提交失败')
    }

    await response.json()

    return {
      success: true,
      message: '表单提交成功！',
      data: {
        name,
        email,
        message,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '提交失败，请稍后重试',
    }
  }
}

// 提交按钮组件（使用 useFormStatus）
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="submit-button">
      {pending ? '提交中...' : '提交表单'}
    </button>
  )
}

function App() {
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    submitForm,
    null
  )

  return (
    <div className="form-container">
      <h1>联系表单</h1>
      <p className="subtitle">使用 React 19 的 useActionState 和 useFormStatus</p>

      <form action={formAction} className="form">
        <div className="form-group">
          <label htmlFor="name">姓名</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="请输入您的姓名"
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="请输入您的邮箱"
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">留言</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="请输入您的留言"
            disabled={isPending}
          />
        </div>

        <SubmitButton />

        {state && (
          <div className={`message ${state.success ? 'success' : 'error'}`}>
            {state.message}
            {state.success && state.data && (
              <div className="submitted-data">
                <p>提交的数据：</p>
                <ul>
                  <li>姓名: {state.data.name}</li>
                  <li>邮箱: {state.data.email}</li>
                  <li>留言: {state.data.message}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default App
