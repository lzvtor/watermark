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
    <button
      type="submit"
      disabled={pending}
      className="submit-button relative px-10 py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 self-start overflow-hidden shadow-[0_4px_15px_rgba(102,126,234,0.4)] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_8px_25px_rgba(102,126,234,0.5)] enabled:active:-translate-y-0.5 enabled:active:shadow-[0_4px_15px_rgba(102,126,234,0.4)] disabled:bg-gradient-to-br disabled:from-[#cbd5e0] disabled:to-[#a0aec0] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:opacity-70 disabled:animate-pulse"
    >
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
    <div className="max-w-[650px] mx-auto my-8 px-12 py-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[fadeInUp_0.6s_ease-out] relative overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-right-1/2 before:w-[200%] before:h-[200%] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:animate-[rotate_20s_linear_infinite] before:pointer-events-none md:mx-4 md:px-6 md:py-8 md:rounded-[20px] sm:px-6 sm:py-6">
      <h1 className="text-center text-white mb-2 text-4xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] relative z-10 md:text-3xl sm:text-[28px]">
        联系表单
      </h1>
      <p className="text-center text-white/90 mb-10 text-base relative z-10">
        使用 React 19 的 useActionState 和 useFormStatus
      </p>

      <form
        action={formAction}
        className="flex flex-col gap-7 bg-white/95 p-10 rounded-2xl backdrop-blur-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative z-10 md:p-6 md:gap-6 sm:p-5"
      >
        <div className="flex flex-col gap-3 relative group">
          <label
            htmlFor="name"
            className="font-semibold text-[#2d3748] text-[0.95rem] transition-colors duration-300 flex items-center gap-2 group-focus-within:text-[#667eea] before:content-[''] before:w-1 before:h-4 before:bg-gradient-to-br before:from-[#667eea] before:to-[#764ba2] before:rounded-sm before:transition-all before:duration-300 group-focus-within:before:h-5"
          >
            姓名
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="请输入您的姓名"
            disabled={isPending}
            className="px-5 py-4 border-2 border-[#e2e8f0] rounded-xl text-base font-inherit bg-white transition-all duration-300 text-[#2d3748] resize-y placeholder:text-[#a0aec0] placeholder:transition-opacity placeholder:duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1),0_4px_12px_rgba(102,126,234,0.15)] focus:-translate-y-0.5 focus:placeholder:opacity-50 disabled:bg-[#f7fafc] disabled:border-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3.5"
          />
        </div>

        <div className="flex flex-col gap-3 relative group">
          <label
            htmlFor="email"
            className="font-semibold text-[#2d3748] text-[0.95rem] transition-colors duration-300 flex items-center gap-2 group-focus-within:text-[#667eea] before:content-[''] before:w-1 before:h-4 before:bg-gradient-to-br before:from-[#667eea] before:to-[#764ba2] before:rounded-sm before:transition-all before:duration-300 group-focus-within:before:h-5"
          >
            邮箱
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="请输入您的邮箱"
            disabled={isPending}
            className="px-5 py-4 border-2 border-[#e2e8f0] rounded-xl text-base font-inherit bg-white transition-all duration-300 text-[#2d3748] resize-y placeholder:text-[#a0aec0] placeholder:transition-opacity placeholder:duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1),0_4px_12px_rgba(102,126,234,0.15)] focus:-translate-y-0.5 focus:placeholder:opacity-50 disabled:bg-[#f7fafc] disabled:border-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3.5"
          />
        </div>

        <div className="flex flex-col gap-3 relative group">
          <label
            htmlFor="message"
            className="font-semibold text-[#2d3748] text-[0.95rem] transition-colors duration-300 flex items-center gap-2 group-focus-within:text-[#667eea] before:content-[''] before:w-1 before:h-4 before:bg-gradient-to-br before:from-[#667eea] before:to-[#764ba2] before:rounded-sm before:transition-all before:duration-300 group-focus-within:before:h-5"
          >
            留言
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="请输入您的留言"
            disabled={isPending}
            className="px-5 py-4 border-2 border-[#e2e8f0] rounded-xl text-base font-inherit bg-white transition-all duration-300 text-[#2d3748] resize-y placeholder:text-[#a0aec0] placeholder:transition-opacity placeholder:duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1),0_4px_12px_rgba(102,126,234,0.15)] focus:-translate-y-0.5 focus:placeholder:opacity-50 disabled:bg-[#f7fafc] disabled:border-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3.5"
          />
        </div>

        <SubmitButton />

        {state && (
          <div
            className={`px-5 py-5 rounded-xl mt-4 animate-[slideIn_0.4s_cubic-bezier(0.4,0,0.2,1)] border-l-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${
              state.success
                ? 'bg-gradient-to-br from-[#d4edda] to-[#c3e6cb] text-[#155724] border-l-[#28a745]'
                : 'bg-gradient-to-br from-[#f8d7da] to-[#f5c6cb] text-[#721c24] border-l-[#dc3545]'
            }`}
          >
            {state.message}
            {state.success && state.data && (
              <div className="mt-5 pt-5 border-t-2 border-black/10 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                <p className="font-bold mb-3 text-inherit text-lg">提交的数据：</p>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  <li className="px-3 py-2 bg-white/60 rounded-lg text-inherit font-medium transition-all duration-200 hover:translate-x-1 hover:bg-white/80">
                    姓名: {state.data.name}
                  </li>
                  <li className="px-3 py-2 bg-white/60 rounded-lg text-inherit font-medium transition-all duration-200 hover:translate-x-1 hover:bg-white/80">
                    邮箱: {state.data.email}
                  </li>
                  <li className="px-3 py-2 bg-white/60 rounded-lg text-inherit font-medium transition-all duration-200 hover:translate-x-1 hover:bg-white/80">
                    留言: {state.data.message}
                  </li>
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
