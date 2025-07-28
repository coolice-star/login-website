'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/env'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface QQLoginProps {
  onLoginSuccess?: (userData: any) => void
}

export function QQLogin({ onLoginSuccess }: QQLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 获取QQ授权URL
  const handleQQLogin = async () => {
    setIsLoading(true)

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
      toast({
        title: "授权失败",
        description: error instanceof Error ? error.message : "获取QQ授权失败",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleQQLogin}
      disabled={isLoading}
      className="h-12 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Image
          src="/qq-icon.svg"
          alt="QQ图标"
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      QQ登录
    </Button>
  )
} 