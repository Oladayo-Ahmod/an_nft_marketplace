import Image from 'next/image'
import Navbar from "@/app/components/Navbar";
import Render from '@/app/components/Render'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Render />
    </main>
  )
}

