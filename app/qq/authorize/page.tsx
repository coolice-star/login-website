'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function QQAuthorizePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  
  // 处理授权
  const handleAuthorize = () => {
    if (!agreed) return
    
    setIsLoading(true)
    
    // 模拟授权过程
    setTimeout(() => {
      // 授权成功后跳转到回调页面，并携带code参数
      // 在真实场景中，这个code会由QQ服务器生成
      const authCode = 'auth_' + Math.random().toString(36).substring(2, 15)
      router.push(`/qq/callback?code=${authCode}&state=success`)
    }, 1500)
  }
  
  // 取消授权
  const handleCancel = () => {
    router.push(`/qq/callback?error=user_denied&error_description=用户取消了授权`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16 mr-2">
              <Image 
                src="/QQ图标.png" 
                alt="QQ图标" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">QQ账号授权</CardTitle>
          <CardDescription className="mt-2">
            授权登录"短信测试登录系统"
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">将获得以下权限</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>获得您的公开信息（昵称、头像等）</span>
                </li>
              </ul>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  我已阅读并同意
                  <a href="#" className="text-blue-600 hover:underline mx-1">服务协议</a>
                  和
                  <a href="#" className="text-blue-600 hover:underline mx-1">隐私政策</a>
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={handleAuthorize}
            disabled={!agreed || isLoading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                授权中...
              </>
            ) : (
              "确认授权登录"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full h-10"
          >
            取消
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 