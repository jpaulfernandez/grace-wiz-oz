import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Welcome from './routes/Welcome'
import Consent from './routes/Consent'
import Guided from './routes/Guided'
import EndSurvey from './routes/EndSurvey'
import PostSurvey from './routes/PostSurvey'
import FreeRoam from './routes/FreeRoam'
import Done from './routes/Done'
import Admin from './routes/Admin'

// Layout with pause affordance - for routes that have active sessions
function SessionLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/consent',
    element: <Consent />,
  },
  {
    element: <SessionLayout />,
    children: [
      {
        path: '/guided',
        element: <Guided />,
      },
      {
        path: '/survey',
        element: <EndSurvey />,
      },
      {
        path: '/post-survey',
        element: <PostSurvey />,
      },
      {
        path: '/free',
        element: <FreeRoam />,
      },
      {
        path: '/done',
        element: <Done />,
      },
    ],
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium text-gray-800 font-newsreader mb-4">404</h1>
        <p className="text-text-secondary">Page not found</p>
      </div>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
