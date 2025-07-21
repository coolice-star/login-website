import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
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
    </div>
  )
} 