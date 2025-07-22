'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    // 可以在这里记录错误到错误报告服务
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">出错了</h2>
        <p className="text-gray-600 mt-2 mb-6 text-center">
          {error.message || '加载登录页面时发生错误'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={reset} className="flex-1">
            重试
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')} 
            className="flex-1"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
} 