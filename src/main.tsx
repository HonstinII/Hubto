import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { Root, HomePage } from './App'
import { PricingPage } from './pages/PricingPage'
import { ModelsPage } from './pages/ModelsPage'
import { ModelDetailPage } from './pages/ModelDetailPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ApiManagementPageWrapper } from './pages/ApiManagementPage'
import { TestAPIPageWrapper } from './pages/TestAPIPage'
import './index.css'

const rootRoute = createRootRoute({
  component: Root
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
})

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage
})

const modelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/models',
  component: ModelsPage
})

const modelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/models/$id',
  component: ({ params }) => <ModelDetailPage id={params.id} />
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage
})

const apiManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api-management',
  component: ApiManagementPageWrapper
})

const testAPIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-api',
  component: TestAPIPageWrapper
})

const routeTree = rootRoute.addChildren([indexRoute, pricingRoute, modelsRoute, modelDetailRoute, loginRoute, registerRoute, dashboardRoute, apiManagementRoute, testAPIRoute])
const router = createRouter({ routeTree, basepath: import.meta.env.BASE_URL })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="linear" darkMode="system">
        <Toaster />
        <RouterProvider router={router} />
      </BlinkUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)