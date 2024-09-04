import React from 'react'
import { LanguageSelector } from '../language-selector'

const Header: React.FC = () => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-lg backdrop-filter">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 py-4 sm:flex-row sm:py-6">
        <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
          EvoSoft Inventory
        </h1>
        <div className="mt-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 p-2 sm:mt-0">
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}

export default Header
