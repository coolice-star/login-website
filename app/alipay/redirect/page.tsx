'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AlipayRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // 简单重定向到回调页面
    router.push('/alipay/callback')
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      <p className="mt-4 text-gray-600">正在重定向...</p>
    </div>
  )
} 