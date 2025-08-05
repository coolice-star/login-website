"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wallet, Coins, CreditCard, CheckCircle, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface RechargePackage {
  id: string;
  amount: number;
  points: number;
  name: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

interface PaymentForm {
  action: string;
  method: string;
  params: Record<string, string>;
}

export default function RechargePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('alipay');
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // 默认充值套餐（如果API调用失败时使用）
  const DEFAULT_PACKAGES = [
    {
      id: '0.01',
      name: '体验包',
      amount: 0.01,
      points: 50,
      description: '充值0.01元获得50积分'
    },
    {
      id: '0.02',
      name: '基础包', 
      amount: 0.02,
      points: 200,
      description: '充值0.02元获得200积分'
    }
  ];

  // 默认支付方式
  const DEFAULT_PAYMENT_METHODS = [
    {
      id: 'alipay',
      name: '支付宝',
      icon: '支',
      description: '使用支付宝安全支付',
      available: true
    },
    {
      id: 'wxpay',
      name: '微信支付',
      icon: '微',
      description: '使用微信安全支付',
      available: true
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
      // 获取用户积分
      fetchUserPoints();
      // 获取充值套餐
      fetchPackages();
      // 获取支付方式
      fetchPaymentMethods();
    } catch (error) {
      console.error("解析用户数据失败:", error);
      router.push("/login");
    }
  }, [router]);

  // 获取用户积分
  const fetchUserPoints = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) {
        setUserPoints(0);
        return;
      }
      
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
      setUserPoints(0);
    }
  };

  // 获取充值套餐
  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("请求充值套餐:", `${API_BASE_URL}/payment/packages`);
      
      const response = await fetch(`${API_BASE_URL}/payment/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("充值套餐接口响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("充值套餐接口响应:", result);
        
        if (result.success && result.data) {
          setPackages(result.data);
        } else {
          console.warn("使用默认充值套餐");
          setPackages(DEFAULT_PACKAGES);
        }
      } else {
        console.error("获取充值套餐失败，使用默认配置");
        setPackages(DEFAULT_PACKAGES);
      }
    } catch (error) {
      console.error("获取充值套餐异常:", error);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setPackagesLoading(false);
    }
  };

  // 获取支付方式
  const fetchPaymentMethods = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      const response = await fetch(`${API_BASE_URL}/payment/methods`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPaymentMethods(result.data);
        } else {
          setPaymentMethods(DEFAULT_PAYMENT_METHODS);
        }
      } else {
        setPaymentMethods(DEFAULT_PAYMENT_METHODS);
      }
    } catch (error) {
      console.error("获取支付方式失败:", error);
      setPaymentMethods(DEFAULT_PAYMENT_METHODS);
    }
  };

  // 处理充值
  const handleRecharge = async () => {
    if (!selectedPackage) {
      toast.error('请选择充值套餐');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('请选择支付方式');
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      console.log("创建支付订单:", {
        package_id: selectedPackage,
        payment_method: selectedPaymentMethod
      });
      
      const response = await fetch(`${API_BASE_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: selectedPackage,
          payment_method: selectedPaymentMethod
        })
      });
      
      console.log("创建支付订单响应状态:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("创建支付订单响应:", result);
        
        if (result.success) {
          toast.success('正在跳转到支付页面...');
          
          // 提交支付表单
          setTimeout(() => {
            submitPaymentForm(result.data.payment_form);
          }, 1000);
        } else {
          toast.error(result.message || '创建支付订单失败');
        }
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.message || '创建支付订单失败');
      }
    } catch (error) {
      console.error("创建支付订单异常:", error);
      toast.error('创建支付订单失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交支付表单
  const submitPaymentForm = (paymentForm: PaymentForm) => {
    try {
      console.log("提交支付表单:", paymentForm);
      
      // 创建表单元素
      const form = document.createElement('form');
      form.method = paymentForm.method;
      form.action = paymentForm.action;
      form.target = '_blank'; // 新窗口打开
      
      // 添加表单参数
      Object.keys(paymentForm.params).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentForm.params[key];
        form.appendChild(input);
      });
      
      // 提交表单
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      toast.info('请在新窗口完成支付');

    } catch (error) {
      console.error("跳转支付页面失败:", error);
      toast.error('跳转支付页面失败');
    }
  };

  if (!user) {
    return null; // 等待检查登录状态
  }

  const selectedPackageInfo = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/70"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">充值中心</h1>
            <p className="text-gray-600">选择充值套餐，快速获得积分</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 左侧：用户信息和当前积分 */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    账户信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">用户名</div>
                    <div className="font-medium">{user.name || user.username || user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">当前积分</div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-yellow-600">{userPoints}</span>
                      <span className="text-gray-500">积分</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：充值套餐和支付方式 */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* 充值套餐选择 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      选择充值套餐
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {packagesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">加载充值套餐...</p>
                      </div>
                    ) : (
                      <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
                        <div className="grid gap-4">
                          {packages.map((pkg) => (
                            <div key={pkg.id} className="relative">
                              <RadioGroupItem 
                                value={pkg.id} 
                                id={pkg.id}
                                className="peer sr-only"
                              />
                              <Label 
                                htmlFor={pkg.id}
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg">{pkg.name}</span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                      +{pkg.points}积分
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-blue-600">¥{pkg.amount}</div>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>

                {/* 支付方式选择 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      选择支付方式
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <div className="grid gap-3">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="relative">
                            <RadioGroupItem 
                              value={method.id} 
                              id={method.id}
                              className="peer sr-only"
                              disabled={!method.available}
                            />
                            <Label 
                              htmlFor={method.id}
                              className={`flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 peer-checked:border-purple-600 peer-checked:bg-purple-50 transition-all ${
                                !method.available ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                method.id === 'alipay' ? 'bg-blue-600' : 'bg-green-600'
                              }`}>
                                {method.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                              </div>
                              {method.available && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* 订单预览和确认支付 */}
                {selectedPackage && selectedPaymentMethod && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-900">订单预览</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">充值套餐:</span>
                          <span className="font-medium">{selectedPackageInfo?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">支付金额:</span>
                          <span className="font-bold text-lg text-blue-600">¥{selectedPackageInfo?.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">获得积分:</span>
                          <span className="font-bold text-green-600">+{selectedPackageInfo?.points}积分</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">支付方式:</span>
                          <span className="font-medium">
                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                          </span>
                        </div>
                        <div className="pt-4 border-t">
                          <Button 
                            onClick={handleRecharge}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                创建订单中...
                              </>
                            ) : (
                              <>
                                <Wallet className="h-4 w-4 mr-2" />
                                立即支付 ¥{selectedPackageInfo?.amount}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 