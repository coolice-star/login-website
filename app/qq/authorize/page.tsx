'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { API_BASE_URL } from '@/lib/env'
import { Button } from '@/components/ui/button'

export default function QQAuthorizePage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [message, setMessage] = useState('正在获取QQ授权链接...')

  useEffect(() => {
    // 获取QQ授权URL并重定向
    const getQQAuthUrl = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/auth/qq/authorize`
        console.log("获取QQ授权URL:", apiUrl)
        
        const response = await fetch(apiUrl, {
          credentials: "include"
        })
        
        console.log("QQ授权响应状态:", response.status, response.statusText)
        
        const responseText = await response.text()
        console.log("QQ授权原始响应:", responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("解析响应失败:", e)
          throw new Error(`解析响应失败: ${responseText}`)
        }
        
        console.log("QQ授权响应:", data)

        if (!response.ok || !data.success) {
          throw new Error(data.message || '获取QQ授权失败')
        }

        // 检查必要的数据
        if (!data.data || !data.data.url) {
          console.error("缺少授权数据:", data)
          throw new Error("返回的数据缺少授权信息")
        }

        // 直接跳转到QQ授权页面
        console.log("检测到QQ授权URL，将跳转:", data.data.url)
        window.location.href = data.data.url
        
      } catch (error) {
        console.error('获取QQ授权失败:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : '获取QQ授权失败')
      }
    }

    getQQAuthUrl()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Image 
                src="/qq-icon.svg" 
                alt="QQ登录" 
                width={32} 
                height={32} 
                className="relative z-10"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">QQ授权登录</CardTitle>
          <CardDescription>
            {status === 'loading' ? '正在准备QQ授权...' : '授权出现问题'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-3">
              <p className="text-red-600 font-medium">{message}</p>
              <Button onClick={() => router.push('/login')}>
                返回登录页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 