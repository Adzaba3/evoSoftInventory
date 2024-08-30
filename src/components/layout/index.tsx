import React from 'react';
import Header from 'src/components/header'
import Footer from 'src/components/footer';


export const getNoneLayout = (page: React.ReactElement) => page;

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {page}
      </main>
      <Footer />
    </div>
  );
};