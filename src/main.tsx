import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './infra/redux/store';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
