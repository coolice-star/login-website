"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, History, Coins, Calendar, CreditCard, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { UserDropdown } from "@/components/user-dropdown"

interface RechargeRecord {
  id: number
  order_no: string
  user_id: number
  amount: string
  points: number
  payment_type: string
  status: string
  created_at: string
  updated_at: string
}

export default function RechargeHistoryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [rechargeRecords, setRechargeRecords] = useState<RechargeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 检查用户是否已登录
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }
    
    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
      // 获取充值记录
      fetchRechargeRecords()
    } catch (error) {
      console.error("解析用户数据失败:", error)
      router.push("/login")
    }
  }, [router])

  // 获取充值记录
  const fetchRechargeRecords = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      
      if (!token) {
        toast.error("请先登录")
        router.push("/login")
        return
      }
      
      console.log("开始获取充值记录...")
      
      const response = await fetch(`${API_BASE_URL}/payment/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log("充值记录接口响应状态:", response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log("充值记录接口响应:", result)
        
        if (result.success) {
          setRechargeRecords(result.data || [])
          toast.success(`获取到 ${result.data?.length || 0} 条充值记录`)
        } else {
          console.error("获取充值记录失败:", result.message)
          toast.error(result.message || "获取充值记录失败")
        }
      } else if (response.status === 401) {
        toast.error("登录已过期，请重新登录")
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        router.push("/login")
      } else {
        const errorResult = await response.json().catch(() => ({}))
        console.error("获取充值记录失败，状态码:", response.status, errorResult)
        toast.error(errorResult.message || `获取充值记录失败 (${response.status})`)
      }
    } catch (error) {
      console.error("获取充值记录异常:", error)
      toast.error("网络错误，请检查网络连接")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 刷新记录
  const handleRefresh = () => {
    setRefreshing(true)
    fetchRechargeRecords()
  }

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  // 获取支付方式显示名称
  const getPaymentTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'alipay': '支付宝',
      'wxpay': '微信支付',
      'wechat': '微信支付'
    }
    return typeMap[type] || type
  }

  // 获取状态显示信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'success':
        return { text: '充值成功', color: 'bg-green-100 text-green-800' }
      case 'pending':
        return { text: '充值中', color: 'bg-yellow-100 text-yellow-800' }
      case 'failed':
        return { text: '充值失败', color: 'bg-red-100 text-red-800' }
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  // 跳转到充值页面
  const goToRecharge = () => {
    router.push('/recharge')
  }

  // 处理用户资料更新
  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser)
  }

  if (!user) {
    return null // 等待检查登录状态
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回
              </Button>
              <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-green-600" />
                <h1 className="font-bold text-xl">充值记录</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToRecharge}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Coins className="h-4 w-4 mr-1" />
                去充值
              </Button>
              
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题和刷新按钮 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">我的充值记录</h2>
              <p className="text-gray-600 mt-1">查看您的所有充值交易记录</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '刷新中...' : '刷新'}
            </Button>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">加载充值记录中...</span>
            </div>
          )}

          {/* 无记录状态 */}
          {!loading && rechargeRecords.length === 0 && (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无充值记录</h3>
                <p className="text-gray-600 mb-6">您还没有进行过充值，快去充值获取积分吧！</p>
                <Button onClick={goToRecharge} className="bg-blue-600 hover:bg-blue-700">
                  <Coins className="h-4 w-4 mr-2" />
                  立即充值
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 充值记录列表 */}
          {!loading && rechargeRecords.length > 0 && (
            <div className="space-y-4">
              {rechargeRecords.map((record) => {
                const statusInfo = getStatusInfo(record.status)
                
                return (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-full">
                              <Coins className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                充值 ¥{record.amount} 获得 {record.points} 积分
                              </h3>
                              <p className="text-sm text-gray-600">
                                订单号：{record.order_no}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              <span>{getPaymentTypeName(record.payment_type)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateTime(record.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={statusInfo.color}>
                            {statusInfo.text}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            {record.created_at !== record.updated_at && (
                              <span>更新于 {formatDateTime(record.updated_at)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* 统计信息 */}
          {!loading && rechargeRecords.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">充值统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {rechargeRecords.length}
                    </div>
                    <div className="text-sm text-gray-600">总充值次数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ¥{rechargeRecords
                        .filter(r => r.status === 'success')
                        .reduce((sum, r) => sum + parseFloat(r.amount), 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">累计充值金额</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {rechargeRecords
                        .filter(r => r.status === 'success')
                        .reduce((sum, r) => sum + r.points, 0)}
                    </div>
                    <div className="text-sm text-gray-600">累计获得积分</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 