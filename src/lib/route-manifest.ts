// Force API routes to be included in build
// Next.js tree-shaking was removing unused routes

// Dynamic imports to force inclusion
export const apiRoutes = {
  health: '/api/health',
  calculate: '/api/calculate',
  calculations: '/api/calculations',
} as const

// This ensures Next.js knows these routes exist
export type ApiRoute = typeof apiRoutes[keyof typeof apiRoutes]
