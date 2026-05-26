import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-steel-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}
