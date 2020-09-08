declare global {
  interface Window {
    APP_CONFIG: any
  }
}

export const env = {
  debug: false,
  apiServer: `${window.APP_CONFIG.apiServer || 'http://localhost:4444'}`
}

// env.debug = true
