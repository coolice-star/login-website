'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { API_BASE_URL } from '@/lib/env'
import Image from 'next/image'
import { Loader2, XCircle, CheckCircle } from 'lucide-react'

export default function TestAlipayPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState('')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [pollStatus, setPollStatus] = useState<string | null>(null)

  useEffect(() => {
    // 显示当前API基础URL
    setApiUrl(API_BASE_URL)
  }, [])

  // 获取支付宝授权URL
  const handleGetAuthUrl = async () => {
    setLoading(true)
    setError(null)
    setQrCode(null)
    setApiResponse(null)
    setOrderId(null)
    setPollStatus(null)

    try {
      const url = `${API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`}/auth/alipay/authorize`
      console.log('请求URL:', url)

      const response = await fetch(url, {
        credentials: 'include'
      })

      const responseText = await response.text()
      console.log('原始响应:', responseText)

      try {
        const data = JSON.parse(responseText)
        setApiResponse(data)

        if (response.ok && data.success) {
          setQrCode(data.data.qrcode)
          setOrderId(data.data.order_id)
        } else {
          setError(data.message || '获取支付宝授权失败')
        }
      } catch (e) {
        setError(`解析响应失败: ${responseText}`)
      }
    } catch (e) {
      setError(`请求失败: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  // 手动轮询
  const handlePoll = async () => {
    if (!orderId) return

    setLoading(true)
    setPollStatus(null)

    try {
      const url = `${API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`}/auth/alipay/poll?order_id=${orderId}`
      console.log('轮询URL:', url)

      const response = await fetch(url, {
        credentials: 'include'
      })

      const data = await response.json()
      console.log('轮询响应:', data)

      if (response.ok && data.success) {
        setPollStatus(data.status)
      } else {
        setError(data.message || '轮询失败')
      }
    } catch (e) {
      setError(`轮询失败: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">支付宝授权登录测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm font-medium">当前API基础URL:</p>
            <p className="font-mono text-xs break-all">{apiUrl}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              onClick={handleGetAuthUrl}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  获取支付宝授权中...
                </>
              ) : '获取支付宝授权URL'}
            </Button>

            {orderId && (
              <Button 
                onClick={handlePoll}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    轮询中...
                  </>
                ) : '手动轮询登录状态'}
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-700">扫描下方二维码进行授权:</p>
              <div className="relative w-64 h-64 border border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={qrCode}
                  alt="支付宝登录二维码"
                  fill
                  className="object-contain"
                />
              </div>
              {orderId && (
                <p className="text-xs text-gray-500">订单ID: {orderId}</p>
              )}
              
              {/* 添加直接打开URL的按钮 */}
              <Button 
                onClick={() => window.open(qrCode, '_blank')}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                在新窗口中打开授权链接
              </Button>
            </div>
          )}

          {pollStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
              {pollStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <Loader2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5 animate-spin flex-shrink-0" />
              )}
              <p className="text-blue-700 text-sm">
                轮询状态: {pollStatus === 'success' ? '登录成功' : pollStatus === 'pending' ? '等待扫码' : pollStatus}
              </p>
            </div>
          )}

          {apiResponse && (
            <div className="mt-8">
              <p className="text-sm font-medium mb-2">API响应:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs max-h-60">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 