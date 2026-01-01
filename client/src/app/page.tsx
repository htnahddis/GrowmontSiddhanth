import React from 'react'
import Link from 'next/link'
const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of our application.</p>
      <button className='bg-yellow-300 p-2 rounded-2xl px-6'><Link href="/dashboard">Go to dashboard</Link></button>
    </div>
  )
}

export default Home