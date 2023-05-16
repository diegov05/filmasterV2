import React, { FC } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext'


interface AppProps {

}

const App: FC<AppProps> = () => {
  return (
    <div>
      App
    </div>
  )
}

export { App };