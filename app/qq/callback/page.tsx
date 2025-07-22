'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// 创建一个内部组件来使用useSearchParams
function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 获取URL参数
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    // 无论有没有错误参数，都模拟登录成功
    setTimeout(() => {
      // 模拟登录成功
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "qq-" + Math.random().toString(36).substring(2, 10),
          name: "QQ用户",
          loginType: "qq",
          loginTime: new Date().toISOString(),
        })
      );
      
      setStatus('success')
      setMessage('QQ登录成功！正在跳转...')
      
      // 2秒后跳转到商城页面
      setTimeout(() => {
        router.push('/shop')
      }, 2000)
    }, 1500)
  }, [searchParams, router])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <Image 
              src="/QQ图标.svg" 
              alt="QQ图标" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">QQ登录回调</CardTitle>
        <CardDescription>
          {status === 'loading' ? '正在处理您的QQ登录信息...' : '授权成功！'}
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
      </CardContent>
    </Card>
  )
}

// 加载中状态组件
function LoadingCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <Image 
              src="/QQ图标.svg" 
              alt="QQ图标" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">QQ登录回调</CardTitle>
        <CardDescription>
          正在加载...
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </CardContent>
    </Card>
  )
}

// 主页面组件
export default function QQCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      <Suspense fallback={<LoadingCard />}>
        <CallbackContent />
      </Suspense>
    </div>
  )
}