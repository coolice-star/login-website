"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Home, ShoppingBag, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface PaymentOrder {
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

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const orderNo = searchParams.get('order_no');

  useEffect(() => {
    if (orderNo) {
      fetchOrderStatus();
      
      // 定期检查支付状态（前30秒每5秒检查一次）
      const interval = setInterval(() => {
        fetchOrderStatus();
      }, 5000);
      
      // 30秒后停止轮询
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [orderNo]);

  const fetchOrderStatus = async () => {
    if (!orderNo) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("=== 订单状态查询调试信息 ===");
      console.log("查询订单号:", orderNo);
      console.log("API基础URL:", API_BASE_URL);
      console.log("Token存在:", !!token);
      console.log("Token内容:", token ? `${token.substring(0, 20)}...` : "无");
      
      if (!token) {
        console.error("Token不存在，跳转到登录页");
        toast.error('请先登录');
        router.push('/login');
        return;
      }
      
      const apiUrl = `${API_BASE_URL}/payment/status/${orderNo}`;
      console.log("请求URL:", apiUrl);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log("请求头:", headers);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        credentials: 'omit' // 避免CORS问题
      });
      
      console.log("响应状态码:", response.status);
      console.log("响应头:", Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log("响应原始内容:", responseText);
      
      if (response.ok) {
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON解析失败:", parseError);
          toast.error('服务器响应格式错误');
          return;
        }
        
        console.log("解析后的响应:", result);
        
        if (result.success) {
          setOrder(result.data);
          
          // 如果支付成功，显示成功提示
          if (result.data.status === 'success') {
            toast.success(`支付成功！获得 ${result.data.points} 积分`);
          }
        } else {
          console.error("API返回错误:", result.message);
          toast.error(result.message || '查询订单失败');
        }
      } else {
        console.error("HTTP请求失败:", response.status, responseText);
        
        // 处理不同的HTTP错误
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录');
          localStorage.removeItem("access_token");
          router.push('/login');
        } else if (response.status === 403) {
          toast.error('无权限查看此订单');
        } else if (response.status === 404) {
          toast.error('订单不存在');
        } else {
          try {
            const errorResult = JSON.parse(responseText);
            toast.error(errorResult.message || '查询订单失败');
          } catch {
            toast.error('查询订单失败');
          }
        }
      }
    } catch (error) {
      console.error("查询支付状态异常:", error);
      toast.error('网络连接失败，请检查网络');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderStatus();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: '支付成功',
          description: '恭喜您，支付已完成，积分已到账！',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: '支付失败',
          description: '很抱歉，支付未能完成，请重试或联系客服。',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: '等待支付确认',
          description: '支付处理中，请稍候...',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700'
        };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">查询支付状态中...</h2>
            <p className="text-gray-600">请稍候，正在确认您的支付结果</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderNo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">参数错误</h2>
            <p className="text-gray-600 mb-6">未找到订单信息</p>
            <Button onClick={() => router.push('/recharge')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              返回充值页面
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">订单不存在</h2>
            <p className="text-gray-600 mb-6">未找到相关订单信息</p>
            <Button onClick={() => router.push('/recharge')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              返回充值页面
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 支付结果展示 */}
          <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 mb-6`}>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                {statusInfo.icon}
              </div>
              <h1 className={`text-2xl font-bold ${statusInfo.textColor} mb-2`}>
                {statusInfo.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {statusInfo.description}
              </p>
              
              {order.status === 'pending' && (
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="mb-4"
                >
                  {refreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      刷新中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      刷新状态
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 订单详情 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>订单详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">订单号</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {order.order_no}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">支付状态</div>
                  <div>
                    <Badge 
                      variant={order.status === 'success' ? 'default' : order.status === 'failed' ? 'destructive' : 'secondary'}
                      className="mt-1"
                    >
                      {order.status === 'success' ? '支付成功' : 
                       order.status === 'failed' ? '支付失败' : '待支付'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">支付金额</div>
                  <div className="text-lg font-bold text-blue-600">¥{order.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">获得积分</div>
                  <div className="text-lg font-bold text-green-600">+{order.points}积分</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">支付方式</div>
                  <div className="font-medium">{getPaymentMethodName(order.payment_type)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">创建时间</div>
                  <div className="text-sm">{new Date(order.created_at).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push('/shop')} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              去购物
            </Button>
            <Button 
              onClick={() => router.push('/recharge')} 
              variant="outline"
              className="flex-1"
            >
              继续充值
            </Button>
          </div>

          {/* 提示信息 */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">温馨提示</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 支付成功后积分将立即到账</li>
                <li>• 如长时间未到账，请联系客服处理</li>
                <li>• 积分可在商城中用于购买商品</li>
                <li>• 支付问题可查看订单记录或联系客服</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 主组件，使用 Suspense 包装
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 