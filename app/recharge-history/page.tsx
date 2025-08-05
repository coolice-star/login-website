"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CreditCard, Coins, Filter, RefreshCw, Eye } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentRecord {
  id: number;
  order_no: string;
  user_id: number;
  amount: string;
  points: number;
  payment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function RechargeHistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchRechargeHistory();
  }, []);

  const fetchRechargeHistory = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }
      
      console.log("获取充值记录...");
      
      const response = await fetch(`${API_BASE_URL}/payment/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecords(result.data || []);
          console.log("充值记录获取成功:", result.data);
        } else {
          toast.error(result.message || '获取充值记录失败');
        }
      } else {
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录');
          localStorage.removeItem("access_token");
          router.push('/login');
        } else {
          toast.error('获取充值记录失败');
        }
      }
    } catch (error) {
      console.error("获取充值记录异常:", error);
      toast.error('网络连接失败，请检查网络');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRechargeHistory();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">充值成功</Badge>;
      case 'failed':
        return <Badge variant="destructive">充值失败</Badge>;
      case 'pending':
        return <Badge variant="secondary">待支付</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodName = (paymentType: string) => {
    switch (paymentType) {
      case 'alipay':
        return '支付宝';
      case 'wxpay':
        return '微信支付';
      default:
        return paymentType;
    }
  };

  const getPaymentMethodIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'alipay':
        return '支';
      case 'wxpay':
        return '微';
      default:
        return '💳';
    }
  };

  // 根据状态筛选记录
  const filteredRecords = records.filter(record => {
    if (statusFilter === "all") return true;
    return record.status === statusFilter;
  });

  // 按创建时间倒序排列
  const sortedRecords = filteredRecords.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const viewOrderDetail = (orderNo: string) => {
    router.push(`/payment/success?order_no=${orderNo}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载充值记录中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">充值记录</h1>
                <p className="text-gray-600">查看您的充值历史记录</p>
              </div>
            </div>
            
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  刷新中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </>
              )}
            </Button>
          </div>

          {/* 筛选器 */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">筛选状态:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="success">充值成功</SelectItem>
                    <SelectItem value="pending">待支付</SelectItem>
                    <SelectItem value="failed">充值失败</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600">
                  共找到 <span className="font-medium text-blue-600">{filteredRecords.length}</span> 条记录
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 充值记录列表 */}
          {sortedRecords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无充值记录</h2>
                <p className="text-gray-500 mb-6">您还没有进行过充值，快去体验一下吧！</p>
                <Button onClick={() => router.push('/recharge')}>
                  <Coins className="h-4 w-4 mr-2" />
                  立即充值
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedRecords.map((record) => (
                <Card key={record.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* 左侧：订单信息 */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">
                            {getPaymentMethodIcon(record.payment_type)}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {getPaymentMethodName(record.payment_type)}充值
                            </h3>
                            {getStatusBadge(record.status)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>订单号：</span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {record.order_no}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(record.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 右侧：金额和操作 */}
                      <div className="text-right">
                        <div className="mb-2">
                          <div className="text-lg font-bold text-blue-600">
                            ¥{record.amount}
                          </div>
                          <div className="text-sm text-green-600">
                            +{record.points}积分
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewOrderDetail(record.order_no)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 底部操作 */}
          {sortedRecords.length > 0 && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-700 mb-3">需要帮助？</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => router.push('/recharge')}>
                    <Coins className="h-4 w-4 mr-1" />
                    继续充值
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
                    返回商城
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 