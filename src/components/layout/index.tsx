import React from 'react'
import Header from 'src/components/header'

export const getNoneLayout = (page: React.ReactElement) => page

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">{page}</main>
    </div>
  )
}
