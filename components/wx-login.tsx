'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/env'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

interface WxLoginProps {
  onLoginSuccess?: (userData: any) => void
}

export function WxLogin({ onLoginSuccess }: WxLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 获取微信授权URL并直接跳转
  const handleWxLogin = async () => {
    setIsLoading(true)

    try {
      const apiUrl = `${API_BASE_URL}/auth/wx/authorize`;
      console.log("获取微信授权URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        credentials: "include"
      })
      
      console.log("微信授权响应状态:", response.status, response.statusText);
      
      const responseText = await response.text();
      console.log("微信授权原始响应:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("解析响应失败:", e);
        throw new Error(`解析响应失败: ${responseText}`);
      }
      
      console.log("微信授权响应:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || '获取微信授权失败')
      }

      // 检查必要的数据
      if (!data.data || (!data.data.qrcode && !data.data.url)) {
        console.error("缺少授权数据:", data);
        throw new Error("返回的数据缺少授权信息");
      }

      // 如果有URL，直接跳转
      if (data.data.url) {
        console.log("检测到微信授权URL，将跳转:", data.data.url);
        window.location.href = data.data.url;
        return;
      }

      // 如果只有二维码，则跳转到授权页面
      if (data.data.qrcode) {
        console.log("检测到微信二维码，将跳转到授权页面");
        router.push('/wx/authorize');
        return;
      }
      
    } catch (error) {
      console.error('获取微信授权失败:', error)
      toast({
        title: "授权失败",
        description: error instanceof Error ? error.message : "获取微信授权失败",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleWxLogin}
      disabled={isLoading}
      className="h-12 border-green-200 hover:border-green-300 hover:bg-green-50"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Image
          src="/wx.png"
          alt="微信图标"
          width={30}
          height={30}
          className="mr-2"
        />
      )}
      微信
    </Button>
  )
} 