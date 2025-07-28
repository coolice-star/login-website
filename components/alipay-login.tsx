'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreditCard, Loader2, XCircle } from 'lucide-react'
import { API_BASE_URL } from '@/lib/env'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

interface AlipayLoginProps {
  onLoginSuccess?: (userData: any) => void
}

export function AlipayLogin({ onLoginSuccess }: AlipayLoginProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'success'>('loading')
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  // 关闭弹窗时清理轮询
  useEffect(() => {
    if (!isOpen && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [isOpen])

  // 获取支付宝授权URL
  const getAlipayAuthUrl = async () => {
    setIsLoading(true)
    setStatus('loading')
    setError('')

    try {
      const apiUrl = `${API_BASE_URL}/auth/alipay/authorize`;
      console.log("获取支付宝授权URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        credentials: "include", // 添加凭证
      })
      
      // 打印响应状态
      console.log("支付宝授权响应状态:", response.status, response.statusText);
      
      const responseText = await response.text();
      console.log("支付宝授权原始响应:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("解析响应失败:", e);
        throw new Error(`解析响应失败: ${responseText}`);
      }
      
      console.log("支付宝授权响应:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || '获取支付宝授权失败')
      }

      // 检查必要的数据
      if (!data.data || (!data.data.qrcode && !data.data.url)) {
        console.error("缺少授权数据:", data);
        throw new Error("返回的数据缺少授权信息");
      }

      // 如果返回的是直接跳转URL而不是二维码图片URL
      if (data.data.url) {
        // 直接跳转到支付宝授权页面
        console.log("检测到直接跳转URL，将打开新窗口:", data.data.url);
          
          // 关闭弹窗
          setIsOpen(false);
          
        // 直接在当前窗口打开授权URL，而不是新窗口
        window.location.href = data.data.url;
        return;
      }

      // 如果有二维码，则显示二维码
      setQrCodeUrl(data.data.qrcode)
      setOrderId(data.data.order_id)
      setStatus('ready')

      // 开始轮询
      if (data.data.order_id) {
        startPolling(data.data.order_id)
      } else {
        console.log("没有order_id，将不会启动轮询");
        
        // 如果没有order_id，可能是直接跳转模式，添加一个按钮让用户手动点击
        toast({
          title: "授权提示",
          description: "请点击'在新窗口打开'按钮完成授权",
        });
      }
    } catch (error) {
      console.error('获取支付宝授权失败:', error)
      setError(error instanceof Error ? error.message : '获取支付宝授权失败')
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  // 轮询登录状态
  const startPolling = (orderId: string) => {
    if (!orderId) {
      console.log("没有order_id，无法启动轮询");
      return;
    }
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    console.log("开始轮询，order_id:", orderId);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const apiUrl = `${API_BASE_URL}/auth/alipay/poll?order_id=${orderId}`;
        console.log("轮询支付宝登录状态:", apiUrl);
        
        const response = await fetch(apiUrl, {
          credentials: "include", // 添加凭证
        })
        
        console.log("轮询响应状态:", response.status, response.statusText);
        
        const responseText = await response.text();
        console.log("轮询原始响应:", responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("解析轮询响应失败:", e);
          throw new Error(`解析轮询响应失败: ${responseText}`);
        }
        
        console.log("轮询响应数据:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || '轮询失败')
        }

        if (data.status === 'success') {
          // 登录成功，停止轮询
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }

          setStatus('success')

          // 如果有重定向URL，直接跳转
          if (data.redirect) {
            console.log("重定向到:", data.redirect);

            // 关闭弹窗
            setIsOpen(false);
            
            // 直接在当前窗口跳转到重定向URL
            window.location.href = data.redirect;
          } else {
            // 没有重定向URL，直接跳转到商城页面
            console.log("无重定向URL，将跳转到商城页面");
            
            // 关闭弹窗
            setIsOpen(false);
            
            // 跳转到商城页面
              router.push('/shop');
          }
        }
      } catch (error) {
        console.error('轮询失败:', error)
        setError(error instanceof Error ? error.message : '轮询失败')
        setStatus('error')

        // 停止轮询
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }
      }
    }, 2000) // 每2秒轮询一次
  }

  // 打开弹窗并获取授权URL
  const handleOpenDialog = () => {
    setIsOpen(true)
    getAlipayAuthUrl()
  }

  // 关闭弹窗
  const handleCloseDialog = () => {
    setIsOpen(false)
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  // 重试
  const handleRetry = () => {
    getAlipayAuthUrl()
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenDialog}
        disabled={isLoading}
        className="h-12 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
      >
        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
        支付宝
      </Button>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">支付宝扫码登录</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-4">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                <p className="text-center text-gray-600">正在获取支付宝二维码...</p>
              </div>
            )}

            {status === 'ready' && qrCodeUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-64 h-64 border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={qrCodeUrl}
                    alt="支付宝登录二维码"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-center text-gray-600">请使用支付宝扫描二维码登录</p>
                
                {/* 添加手动打开按钮 */}
                <Button 
                  onClick={() => window.location.href = qrCodeUrl.replace('&client=1', '')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  在当前窗口打开授权链接
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-center text-red-600">{error || '获取二维码失败'}</p>
                <Button onClick={handleRetry}>重试</Button>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-green-500" />
                <p className="text-center text-green-600">登录成功，正在跳转...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 