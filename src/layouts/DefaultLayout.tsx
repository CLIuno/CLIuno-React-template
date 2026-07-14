import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
