"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingBag, ShoppingCart, Search, Heart, Wallet, Coins } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserDropdown } from "@/components/user-dropdown"

// 模拟商品数据
const PRODUCTS = [
  { id: 1, name: "高品质无线蓝牙耳机", price: 299, category: "数码电子", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=耳机" },
  { id: 2, name: "时尚简约双肩包", price: 199, category: "服饰鞋包", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=双肩包" },
  { id: 3, name: "智能手环健康监测", price: 249, category: "数码电子", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=手环" },
  { id: 4, name: "纯棉舒适T恤", price: 99, category: "服饰鞋包", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=T恤" },
  { id: 5, name: "多功能料理机", price: 599, category: "家用电器", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=料理机" },
  { id: 6, name: "天然有机护肤套装", price: 399, category: "美妆个护", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=护肤套装" },
  { id: 7, name: "便携式榨汁机", price: 159, category: "家用电器", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=榨汁机" },
  { id: 8, name: "高清智能投影仪", price: 2999, category: "数码电子", image: "https://placehold.co/300x300/e2e8f0/1e40af?text=投影仪" },
];

// 商品分类
const CATEGORIES = ["全部商品", "数码电子", "家用电器", "服饰鞋包", "美妆个护", "食品饮料", "母婴玩具"];

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("全部商品");
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  
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
    } catch (error) {
      console.error("解析用户数据失败:", error);
      router.push("/login");
    }
  }, [router]);
  
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
  
  // 跳转到充值页面
  const goToRecharge = () => {
    router.push('/recharge');
  };
  
  // 根据分类和搜索筛选商品
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "全部商品" || product.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // 添加到购物车
  const addToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
  };
  
  // 处理用户资料更新
  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };
  
  if (!user) {
    return null; // 等待检查登录状态
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <Link href="/" className="font-bold text-xl">优品商城</Link>
            </div>
            
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="搜索商品..." 
                  className="pl-10 pr-4 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 积分显示 */}
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{userPoints}积分</span>
              </div>
              
              {/* 充值按钮 */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToRecharge}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Wallet className="h-4 w-4 mr-1" />
                充值
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">0</Badge>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{cartCount}</Badge>
              </Button>
              
              <UserDropdown />
            </div>
          </div>
          
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="搜索商品..." 
                className="pl-10 pr-4 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* 移动端积分和充值按钮 */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{userPoints}积分</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToRecharge}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Wallet className="h-4 w-4 mr-1" />
                充值
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容 */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* 欢迎信息 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">欢迎回来，{user.name}</h1>
            <p className="text-gray-600">发现今日好物，享受品质生活</p>
          </div>
          
          {/* 分类选择 */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-blue-600" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 商品列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-blue-600 mb-1">{product.category}</div>
                  <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <div className="text-lg font-bold text-red-600">¥{product.price}</div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(product.id)}
                  >
                    加入购物车
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* 无结果提示 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到相关商品</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSelectedCategory("全部商品");
                  setSearchQuery("");
                }}
              >
                查看所有商品
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* 底部 */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 优品商城 版权所有</p>
        </div>
      </footer>
    </div>
  )
} 