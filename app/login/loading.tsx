import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold">加载中...</h2>
        <p className="text-gray-500 mt-2">请稍候</p>
      </div>
    </div>
  )
} 