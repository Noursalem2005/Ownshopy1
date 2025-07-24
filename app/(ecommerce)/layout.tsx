import Navbar from '@/components/navbar';
import React from 'react'
import Footer from '@/components/footer';
const layout = ({ 
    children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (  <div>
    <Navbar />
    <div className=""></div>
    {children}
    <Footer />
    </div>
  )
}

export default layout
