"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, Coins, ShoppingBag, RefreshCw } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('order_no');
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // 检查用户是否已登录
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    if (!orderNo) {
      router.push("/recharge");
      return;
    }

    // 查询支付状态
    checkPaymentStatus();
    fetchUserPoints();
  }, [orderNo, router]);

  // 查询支付状态
  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem("access_token"); // 修复：使用正确的key
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("查询支付状态:", `${API_BASE_URL}/payment/status/${orderNo}`);
      
      const response = await fetch(`${API_BASE_URL}/payment/status/${orderNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("支付状态接口响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("支付状态接口响应:", result);
        
        if (result.success) {
          setPaymentData(result.data);
        }
      }
    } catch (error) {
      console.error("查询支付状态失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户积分
  const fetchUserPoints = async () => {
    try {
      const token = localStorage.getItem("access_token"); // 修复：使用正确的key
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
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

  // 刷新支付状态
  const refreshStatus = () => {
    setLoading(true);
    checkPaymentStatus();
    fetchUserPoints();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在查询支付状态...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未找到订单信息</p>
          <Button onClick={() => router.push("/recharge")}>
            返回充值页面
          </Button>
        </div>
      </div>
    );
  }

  const isSuccess = paymentData.status === 'success';
  const isPending = paymentData.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/shop")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">支付结果</h1>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <Coins className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{userPoints}积分</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 支付结果卡片 */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              {isSuccess && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">充值成功！</h2>
                  <p className="text-gray-600 mb-6">恭喜您，积分已成功到账</p>
                </>
              )}
              
              {isPending && (
                <>
                  <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">支付处理中</h2>
                  <p className="text-gray-600 mb-6">请稍等，我们正在确认您的支付</p>
                </>
              )}
              
              {paymentData.status === 'failed' && (
                <>
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">✕</span>
                  </div>
                  <h2 className="text-2xl font-bold text-red-700 mb-2">支付失败</h2>
                  <p className="text-gray-600 mb-6">支付未完成，请重试</p>
                </>
              )}
              
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h3 className="font-semibold mb-4">订单详情</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单号：</span>
                    <span className="font-mono">{paymentData.order_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">充值金额：</span>
                    <span className="font-semibold text-red-600">¥{paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">获得积分：</span>
                    <span className="font-semibold text-green-600">{paymentData.points}积分</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付方式：</span>
                    <span>支付宝</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单状态：</span>
                    <span className={`font-semibold ${
                      isSuccess ? 'text-green-600' : 
                      isPending ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {isSuccess ? '已完成' : isPending ? '处理中' : '已失败'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建时间：</span>
                    <span>{new Date(paymentData.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-4">
            {isPending && (
              <Button
                onClick={refreshStatus}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新状态
              </Button>
            )}
            
            <Button
              onClick={() => router.push("/shop")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              返回商城
            </Button>
            
            {(paymentData.status === 'failed' || isPending) && (
              <Button
                onClick={() => router.push("/recharge")}
                variant="outline"
                className="w-full"
              >
                重新充值
              </Button>
            )}
          </div>
          
          {/* 温馨提示 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">温馨提示</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 如果支付后状态仍显示"处理中"，请稍等几分钟后刷新页面</p>
                <p>• 积分到账后可在商城中使用</p>
                <p>• 如有任何问题，请联系客服</p>
                <p>• 订单记录可在个人中心查看</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 