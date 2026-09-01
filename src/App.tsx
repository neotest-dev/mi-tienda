import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AppRouter } from './router/AppRouter'

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppRouter />
      </StoreProvider>
    </BrowserRouter>
  )
}

export default App
