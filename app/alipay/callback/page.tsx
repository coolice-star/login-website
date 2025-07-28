'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { API_BASE_URL } from '@/lib/env'
import { toast } from '@/components/ui/use-toast'

// 创建加载状态组件
function LoadingState() {
  return (
    <div className="flex flex-col items-center space-y-3 py-8">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      <p className="text-gray-600">正在加载页面...</p>
    </div>
  );
}

// 将主要内容提取到一个单独的组件
function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 获取URL参数
    const code = searchParams.get('code')
    const type = searchParams.get('type')
    
    console.log('回调页面接收到的参数:', { code, type })
    
    if (!code || !type) {
      setStatus('error')
      setMessage('缺少必要参数')
      return
    }
    
    const processCallback = async () => {
      try {
        // 构建回调URL - 确保API路径正确
        const apiUrl = `${API_BASE_URL}/auth/callback?type=${type}&code=${code}`
        console.log('处理回调:', apiUrl)
        
        const response = await fetch(apiUrl, {
          credentials: 'include'
        })
        
        console.log('回调响应状态:', response.status, response.statusText)
        
        const responseText = await response.text()
        console.log('回调原始响应:', responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error('解析回调响应失败:', e)
          throw new Error(`解析回调响应失败: ${responseText}`)
        }
        
        console.log('回调响应数据:', data)
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || '登录失败')
        }
        
        // 检查用户数据
        if (!data.data || !data.data.user) {
          throw new Error('返回的数据缺少用户信息')
        }
        
        // 存储用户信息
        const userData = {
          id: data.data.user.id,
          name: data.data.user.username || '支付宝用户',
          avatar: data.data.user.avatar || '',
          social_type: data.data.user.social_type || 'alipay',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        
        // 存储访问令牌
        if (data.data.access_token) {
          localStorage.setItem('access_token', data.data.access_token)
        }
        
        setUser(userData)
        setStatus('success')
        setMessage('支付宝登录成功！正在跳转...')
        
        // 显示欢迎提示
        toast({
          title: '登录成功',
          description: `欢迎回来，${userData.name}`,
        })
        
        // 2秒后跳转到商城页面
        setTimeout(() => {
          router.push('/shop')
        }, 2000)
      } catch (error) {
        console.error('处理回调失败:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : '登录失败')
        
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    }
    
    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Image 
                src="/placeholder-logo.svg" 
                alt="支付宝登录" 
                width={32} 
                height={32} 
                className="relative z-10"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">支付宝登录</CardTitle>
          <CardDescription>
            {status === 'loading' ? '正在处理您的支付宝登录信息...' : 
             status === 'success' ? '授权成功！' : 
             '登录出现问题'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-6">
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
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name || "用户"} 
                        width={32} 
                        height={32}
                        onError={(e) => {
                          // 如果头像加载失败，使用默认头像
                          e.currentTarget.src = '/placeholder-user.jpg'
                        }}
                      />
                    ) : (
                      <Image 
                        src="/placeholder-user.jpg" 
                        alt="默认头像" 
                        width={32} 
                        height={32} 
                      />
                    )}
                  </div>
                  <span>{user.name || "支付宝用户"}</span>
                </div>
              )}
              <p className="text-sm text-gray-500">页面将自动跳转</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-3">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-600 font-medium">{message || '登录失败'}</p>
              <p className="text-sm text-gray-500">即将返回登录页面</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// 主页面组件
export default function AlipayCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CallbackContent />
    </Suspense>
  )
} 