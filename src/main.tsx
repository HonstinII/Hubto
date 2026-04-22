import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { Root, HomePage } from './App'
import { PricingPage } from './pages/PricingPage'
import { ModelsPage } from './pages/ModelsPage'
import { ModelDetailPage } from './pages/ModelDetailPage'
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

const routeTree = rootRoute.addChildren([indexRoute, pricingRoute, modelsRoute, modelDetailRoute])
const router = createRouter({ 
  routeTree, 
  // 重点：必须加上这一行，告诉路由你在子目录下运行
  basepath: '/Hubto/', 
})
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
