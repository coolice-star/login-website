'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { API_BASE_URL } from '@/lib/env'
import { Button } from '@/components/ui/button'

export default function WxAuthorizePage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('正在获取微信授权链接...')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [directUrl, setDirectUrl] = useState('')

  useEffect(() => {
    // 获取微信授权URL并显示二维码
    const getWxAuthUrl = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/auth/wx/authorize`
        console.log("获取微信授权URL:", apiUrl)
        
        const response = await fetch(apiUrl, {
          credentials: "include"
        })
        
        console.log("微信授权响应状态:", response.status, response.statusText)
        
        const responseText = await response.text()
        console.log("微信授权原始响应:", responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("解析响应失败:", e)
          throw new Error(`解析响应失败: ${responseText}`)
        }
        
        console.log("微信授权响应:", data)

        if (!response.ok || !data.success) {
          throw new Error(data.message || '获取微信授权失败')
        }

        // 检查必要的数据
        if (!data.data || (!data.data.qrcode && !data.data.url)) {
          console.error("缺少授权数据:", data)
          throw new Error("返回的数据缺少授权信息")
        }

        // 如果有URL，保存URL
        if (data.data.url) {
          console.log("检测到微信授权URL:", data.data.url)
          setDirectUrl(data.data.url)
        }

        // 如果有二维码，显示二维码
        if (data.data.qrcode) {
          console.log("检测到微信二维码:", data.data.qrcode)
          setQrCodeUrl(data.data.qrcode)
          setStatus('ready')
          return
        } else if (data.data.url) {
          // 如果只有URL没有二维码，直接跳转
          console.log("没有二维码，直接跳转到微信授权URL:", data.data.url)
          window.location.href = data.data.url
          return
        }
        
        // 如果都没有，返回登录页
        router.push('/login')
      } catch (error) {
        console.error('获取微信授权失败:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : '获取微信授权失败')
      }
    }

    getWxAuthUrl()
  }, [router])

  // 直接跳转到授权URL
  const handleDirectAuth = () => {
    if (directUrl) {
      console.log("直接跳转到微信授权URL:", directUrl)
      window.location.href = directUrl
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Image 
                src="/wx.png" 
                alt="微信登录" 
                width={32} 
                height={32} 
                className="relative z-10"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">微信授权登录</CardTitle>
          <CardDescription>
            {status === 'loading' ? '正在准备微信授权...' : 
             status === 'ready' ? '请使用微信扫描下方二维码' : 
             '授权出现问题'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'ready' && qrCodeUrl && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-64 h-64 border border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={qrCodeUrl}
                  alt="微信登录二维码"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-center text-gray-600">请使用微信扫描二维码登录</p>
              <p className="text-xs text-gray-500">打开微信 → 扫一扫 → 扫描上方二维码</p>
              
              {/* 添加直接打开按钮 */}
              {directUrl && (
                <Button 
                  onClick={handleDirectAuth}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  在浏览器中打开授权链接
                </Button>
              )}
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-3">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-600 font-medium">{message}</p>
              <Button onClick={() => router.push('/login')} className="bg-green-600 hover:bg-green-700">
                返回登录页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 