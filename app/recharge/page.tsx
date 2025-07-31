"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wallet, Coins, CreditCard, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RechargePackage {
  id: string;
  amount: number;
  points: number;
  name: string;
  description: string;
}

export default function RechargePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // 默认充值套餐（如果API调用失败时使用）
  const DEFAULT_PACKAGES = [
    {
      id: '0.1',
      name: '体验包',
      amount: 0.1,  // 调整为0.1元
      points: 50,
      description: '充值0.1元获得50积分'
    },
    {
      id: '0.2',
      name: '基础包', 
      amount: 0.2,  // 调整为0.2元
      points: 200,
      description: '充值0.2元获得200积分'
    }
  ];

  // 检查用户是否已登录
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchRechargePackages();
      fetchUserPoints();
    } catch (error) {
      console.error("解析用户数据失败:", error);
      router.push("/login");
    }
  }, [router]);

  // 获取充值档位
  const fetchRechargePackages = async () => {
    setPackagesLoading(true);
    try {
      const token = localStorage.getItem("access_token"); // 修复：使用正确的key
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("请求充值档位:", `${API_BASE_URL}/payment/packages`);
      console.log("使用的token:", token ? "已获取" : "未获取");
      
      if (!token) {
        console.warn("未找到认证token，使用默认档位");
        setPackages(DEFAULT_PACKAGES);
        setPackagesLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/payment/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("充值档位接口响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("充值档位接口响应:", result);
        if (result.success) {
          setPackages(result.data);
        } else {
          console.error("获取充值档位失败，使用默认档位:", result.message);
          setPackages(DEFAULT_PACKAGES);
        }
      } else if (response.status === 422 || response.status === 401) {
        console.warn("认证失败，使用默认档位");
        setPackages(DEFAULT_PACKAGES);
      } else {
        const errorData = await response.text();
        console.error("充值档位接口错误，使用默认档位:", response.status, errorData);
        setPackages(DEFAULT_PACKAGES);
      }
    } catch (error) {
      console.error("获取充值档位失败，使用默认档位:", error);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setPackagesLoading(false);
    }
  };

  // 获取用户积分
  const fetchUserPoints = async () => {
    try {
      const token = localStorage.getItem("access_token"); // 修复：使用正确的key
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("请求用户积分:", `${API_BASE_URL}/payment/user/points`);
      
      if (!token) {
        console.warn("未找到认证token，积分显示为0");
        setUserPoints(0);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/payment/user/points`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("积分接口响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("积分接口响应:", result);
        if (result.success) {
          setUserPoints(result.data.points);
        } else {
          console.error("获取积分失败:", result.message);
          setUserPoints(0);
        }
      } else if (response.status === 422 || response.status === 401) {
        console.warn("积分接口认证失败，积分显示为0");
        setUserPoints(0);
      } else {
        console.error("获取积分失败，状态码:", response.status);
        setUserPoints(0);
      }
    } catch (error) {
      console.error("获取用户积分失败:", error);
      setUserPoints(0);
    }
  };

  // 发起充值
  const handleRecharge = async () => {
    if (!selectedPackage) {
      alert('请选择充值档位');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem("access_token"); // 修复：使用正确的key
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("发起充值请求:", {
        package_id: selectedPackage,
        url: `${API_BASE_URL}/payment/create`
      });
      
      const response = await fetch(`${API_BASE_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: selectedPackage
        })
      });
      
      console.log("充值接口响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("充值接口响应:", result);
        
        if (result.success) {
          // 创建新窗口显示支付页面
          const paymentWindow = window.open("", "_blank", "width=800,height=600");
          if (paymentWindow) {
            paymentWindow.document.write(result.data.payment_html);
            paymentWindow.document.close();
            
            // 监听支付窗口关闭
            const checkClosed = setInterval(() => {
              if (paymentWindow.closed) {
                clearInterval(checkClosed);
                // 支付窗口关闭后，跳转到支付结果页面
                router.push(`/payment/success?order_no=${result.data.order_no}`);
              }
            }, 1000);
          } else {
            // 如果无法打开新窗口，在当前页面跳转
            const blob = new Blob([result.data.payment_html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.location.href = url;
          }
        } else {
          alert(`充值失败: ${result.message}`);
        }
      } else {
        const error = await response.json();
        alert(`充值失败: ${error.message || '请求失败'}`);
      }
    } catch (error) {
      console.error("发起充值失败:", error);
      alert('充值失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // 等待检查登录状态
  }

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
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">积分充值</h1>
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
          {/* 用户信息卡片 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                充值说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 充值成功后积分将立即到账</p>
                <p>• 积分可用于购买商品或兑换优惠券</p>
                <p>• 支付完成后将自动返回确认页面</p>
                <p>• 如有问题请联系客服</p>
              </div>
            </CardContent>
          </Card>

          {/* 充值档位选择 */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold">选择充值档位</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packagesLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="mt-2 text-gray-500">加载充值档位中...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">暂无充值档位，请稍后再试。</p>
                </div>
              ) : (
                packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPackage === pkg.id
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            {pkg.id === '0.02' && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                推荐
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-blue-600">
                              ¥{pkg.amount}
                            </p>
                            <p className="text-lg font-medium text-green-600">
                              获得 {pkg.points} 积分
                            </p>
                            <p className="text-sm text-gray-500">
                              {pkg.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {selectedPackage === pkg.id ? (
                            <CheckCircle className="h-6 w-6 text-blue-500" />
                          ) : (
                            <div className="h-6 w-6 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* 支付按钮 */}
          <div className="space-y-4">
            <Button
              onClick={handleRecharge}
              disabled={!selectedPackage || loading || packagesLoading}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  创建订单中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  立即充值
                </div>
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              点击充值即表示您同意我们的
              <Link href="/terms" className="text-blue-600 hover:underline">服务条款</Link>
              和
              <Link href="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 