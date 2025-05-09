// Importaciones obligatorias de react
import React from 'react' 
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar assets (recursos: hojas de estilom imagenes, fuentes)
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'

// Arrancando App de react
createRoot(document.getElementById('root')).render(
    <App />
)
