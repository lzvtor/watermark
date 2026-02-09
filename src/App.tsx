import { useRoutes } from "react-router-dom"
import { Toaster } from "@/components/ui"
import { RegistrationForm } from "@/components/voip"

const FormLayout = () => (
  <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4">
    <RegistrationForm />
  </div>
)

const routes = [
  {
    path: "/",
    element: <FormLayout />,
  },
  {
    path: "/register",
    element: <FormLayout />,
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