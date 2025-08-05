"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Coins, Calendar, ShoppingBag, History, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface OrderDetails {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  points_price: number;
  product_image: string;
  status: string;
  created_at: string;
}

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchUserPoints();
    } else {
      toast.error('订单信息不完整');
      router.push('/shop');
    }
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/purchase/detail/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOrderDetails(result.data);
        } else {
          toast.error(result.message || '获取订单详情失败');
          router.push('/purchase-history');
        }
      } else {
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录');
          localStorage.removeItem("access_token");
          router.push('/login');
        } else {
          toast.error('获取订单详情失败');
          router.push('/purchase-history');
        }
      }
    } catch (error) {
      console.error("获取订单详情异常:", error);
      toast.error('网络连接失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/payment/user/points`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserPoints(result.data.points);
        }
      }
    } catch (error) {
      console.error("获取用户积分失败:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">购买成功</Badge>;
      case 'failed':
        return <Badge variant="destructive">购买失败</Badge>;
      case 'pending':
        return <Badge variant="secondary">处理中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载订单详情中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">订单不存在</h2>
            <p className="text-gray-500 mb-6">无法找到相关订单信息</p>
            <Button onClick={() => router.push('/shop')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              返回商城
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">购买成功！</h1>
            <p className="text-gray-600">您的订单已成功创建，积分已扣除</p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                订单详情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {orderDetails.product_image ? (
                    <img 
                      src={orderDetails.product_image} 
                      alt={orderDetails.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {orderDetails.product_name}
                    </h3>
                    {getStatusBadge(orderDetails.status)}
                  </div>
                  
                  <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {orderDetails.points_price}积分
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">订单号</span>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                    {orderDetails.order_id}
                  </code>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">购买时间</span>
                  <div className="flex items-center gap-1 text-gray-900">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(orderDetails.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">支付方式</span>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Coins className="h-4 w-4" />
                    <span>积分支付</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">当前积分余额</span>
                  <div className="text-lg font-semibold text-green-600 flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {userPoints}积分
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              onClick={() => router.push('/purchase-history')}
            >
              <History className="h-4 w-4 mr-2" />
              查看购买记录
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/shop')}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                继续购物
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push(`/product/${orderDetails.product_id}`)}
              >
                <Package className="h-4 w-4 mr-2" />
                查看商品
              </Button>
            </div>
          </div>

          {/* Tips */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">温馨提示</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 您的订单已成功创建，积分已立即扣除</li>
                <li>• 可在"购买记录"中查看所有订单信息</li>
                <li>• 如有问题，请联系客服获取帮助</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 