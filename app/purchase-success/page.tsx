"use client"

import { useEffect, useState, Suspense } from "react"
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

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function PurchaseSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (!orderId) {
      toast.error('订单ID不存在');
      router.push('/shop');
      return;
    }

    fetchOrderDetails();
    fetchUserPoints();
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

      console.log("获取订单详情:", `${API_BASE_URL}/purchase/detail/${orderId}`);
      
      const response = await fetch(`${API_BASE_URL}/purchase/detail/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("订单详情响应状态:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("订单详情响应:", result);
        
        if (result.success) {
          setOrderDetails(result.data);
        } else {
          console.error("获取订单详情失败:", result.message);
          toast.error(result.message || '获取订单详情失败');
          
          // 如果订单不存在，跳转到购买记录页面
          setTimeout(() => {
            router.push('/purchase-history');
          }, 2000);
        }
      } else if (response.status === 401) {
        toast.error('登录已过期，请重新登录');
        router.push('/login');
      } else if (response.status === 404) {
        toast.error('订单不存在');
        router.push('/purchase-history');
      } else {
        console.error("获取订单详情失败，状态码:", response.status);
        toast.error('获取订单详情失败');
      }
    } catch (error) {
      console.error("获取订单详情异常:", error);
      toast.error('网络错误，请重试');
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
        return <Badge className="bg-green-100 text-green-800">购买成功</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">处理中</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">购买失败</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载订单详情中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Package className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">订单不存在</h2>
            <p className="text-gray-500 mb-6">无法找到相关的订单信息</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/purchase-history')}>
                <History className="h-4 w-4 mr-2" />
                查看购买记录
              </Button>
              <Button variant="outline" onClick={() => router.push('/shop')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                继续购物
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">购买成功</h1>
              <p className="text-gray-600">您的订单已完成</p>
            </div>
          </div>

          {/* Success Message */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">购买成功！</h2>
              <p className="text-green-700">感谢您的购买，商品信息已记录到您的账户中</p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                订单详情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {orderDetails.product_image && (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={orderDetails.product_image} 
                      alt={orderDetails.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{orderDetails.product_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      {orderDetails.points_price}积分
                    </div>
                    {getStatusBadge(orderDetails.status)}
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">订单号</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {orderDetails.order_id}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">购买时间</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(orderDetails.created_at).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Points */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">当前积分</span>
                </div>
                <div className="text-xl font-bold text-blue-600">{userPoints}积分</div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/purchase-history')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <History className="h-4 w-4 mr-2" />
              查看购买记录
            </Button>
            <Button 
              onClick={() => router.push('/shop')}
              variant="outline"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              继续购物
            </Button>
            <Button 
              onClick={() => router.push(`/product/${orderDetails.product_id}`)}
              variant="outline"
            >
              <Package className="h-4 w-4 mr-2" />
              查看商品
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 主组件，使用 Suspense 包装
export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
} 