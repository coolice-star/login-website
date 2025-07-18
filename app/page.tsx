"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, MessageSquare, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// API基础URL
const API_BASE_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")

  // 处理登录/注册
  const handleAuth = async (type: string, data: any) => {
    setIsLoading(true)
    
    try {
      let endpoint = "";
      
      if (type === "phone") {
        endpoint = "/api/auth/login/phone";
      } else {
        endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      }
      
      // 发送API请求
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "登录失败");
      }
      
      // 登录成功，存储用户信息和令牌
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.data.user.id,
          name: result.data.user.username || result.data.user.email || result.data.user.phone,
          email: result.data.user.email,
          phone: result.data.user.phone,
          loginType: type,
          loginTime: new Date().toISOString(),
        })
      );
      
      // 存储访问令牌
      localStorage.setItem("access_token", result.data.access_token);
      
      toast({
        title: "登录成功",
        description: `欢迎回来，${result.data.user.username || result.data.user.email || result.data.user.phone}`,
      });
      
      // 跳转到仪表板
      router.push("/dashboard");
    } catch (error) {
      console.error("登录失败:", error);
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "请检查您的凭据并重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 发送短信验证码
  const sendSMSCode = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sms/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "发送验证码失败");
      }
      
      setCodeSent(true);
      toast({
        title: "验证码已发送",
        description: "请查看您的手机短信",
      });
    } catch (error) {
      console.error("发送验证码失败:", error);
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 手机号登录
  const handlePhoneLogin = () => {
    handleAuth("phone", { phone: phoneNumber, code: verificationCode });
  }

  // 账号密码登录/注册
  const handleEmailAuth = () => {
    const data = isRegistering 
      ? { email, password, username: username || undefined }
      : { email, password };
    
    handleAuth("email", data);
  }

  // 第三方登录
  const handleThirdPartyLogin = (provider: string) => {
    // 第三方登录暂时保持模拟
    setIsLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "third-party-1",
          name: `${provider}用户`,
          loginType: provider,
          loginTime: new Date().toISOString(),
        })
      );
      
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  }

  // 切换登录/注册模式
  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isRegistering ? "欢迎注册" : "欢迎登录"}
          </h1>
          <p className="text-gray-600 mt-2">选择您喜欢的{isRegistering ? "注册" : "登录"}方式</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">{isRegistering ? "创建账户" : "登录账户"}</CardTitle>
            <CardDescription className="text-center">安全便捷的多种{isRegistering ? "注册" : "登录"}方式</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  手机登录
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {isRegistering ? "邮箱注册" : "账号登录"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号码"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendSMSCode}
                      disabled={!phoneNumber || isLoading}
                      className="h-12 px-4 whitespace-nowrap bg-transparent"
                    >
                      {codeSent ? "重新发送" : "发送验证码"}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handlePhoneLogin}
                  disabled={!phoneNumber || !verificationCode || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isLoading ? "登录中..." : "手机号登录"}
                </Button>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                {isRegistering && (
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名 (可选)</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="请输入用户名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱{!isRegistering && "/用户名"}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={`请输入邮箱${!isRegistering ? "或用户名" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isRegistering ? "请设置密码 (至少8位，包含字母和数字)" : "请输入密码"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={handleEmailAuth}
                  disabled={!email || !password || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isLoading ? "处理中..." : isRegistering ? "注册账号" : "账号密码登录"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {isRegistering ? "已有账号？返回登录" : "没有账号？立即注册"}
                  </button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator className="my-4" />
              <p className="text-center text-sm text-gray-600 mb-4">或使用第三方账号登录</p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleThirdPartyLogin("qq")}
                  disabled={isLoading}
                  className="h-12 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  QQ登录
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleThirdPartyLogin("alipay")}
                  disabled={isLoading}
                  className="h-12 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  支付宝
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              {isRegistering ? "注册" : "登录"}即表示您同意我们的
              <a href="#" className="text-blue-600 hover:underline">
                服务条款
              </a>
              和
              <a href="#" className="text-blue-600 hover:underline">
                隐私政策
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
