'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function QQCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 获取URL参数
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      setStatus('error')
      setMessage('QQ登录授权失败，请重试')
    } else if (code) {
      // 模拟处理登录逻辑
      setTimeout(() => {
        setStatus('success')
        setMessage('QQ登录成功！正在跳转...')
        
        // 3秒后跳转到首页或仪表板
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 3000)
      }, 1500)
    } else {
      setStatus('error')
      setMessage('缺少必要的授权参数')
    }
  }, [searchParams])

  const handleRetry = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">QQ登录回调</CardTitle>
          <CardDescription>
            正在处理您的QQ登录信息...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600">正在验证登录信息...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-500">页面将自动跳转</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-600 font-medium">{message}</p>
              <Button onClick={handleRetry} className="w-full">
                返回登录页面
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}