'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在这里记录错误到错误报告服务
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">出错了</CardTitle>
          <CardDescription>
            QQ登录回调处理过程中出现错误
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-600 font-medium">
              {error.message || '处理QQ登录时发生错误'}
            </p>
            <div className="space-y-2 w-full">
              <Button onClick={reset} className="w-full">
                重试
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                返回登录页面
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 