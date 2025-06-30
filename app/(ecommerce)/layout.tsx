import Navbar from '@/components/navbar';
import React from 'react'
import Footer from '@/components/footer';
const layout = ({ 
    children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default layout
