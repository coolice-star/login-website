"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingBag, ShoppingCart, Search, Heart, Wallet, Coins, History, Star, TrendingUp, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserDropdown } from "@/components/user-dropdown"

// 扩展商品数据 - 使用稳定的图片链接，添加积分价格
const PRODUCTS = [
  // 数码电子类
  { 
    id: 1, 
    name: "苹果AirPods Pro 2代", 
    price: 1899, 
    originalPrice: 2199,
    pointsPrice: 500, // 积分价格
    category: "数码电子", 
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
    rating: 4.8,
    sales: 2341,
    tags: ["降噪", "无线", "苹果"],
    description: "全新苹果AirPods Pro 2代，主动降噪技术，无线充电盒，完美音质体验。"
  },
  { 
    id: 2, 
    name: "索尼WH-1000XM5头戴式耳机", 
    price: 2399, 
    originalPrice: 2699,
    pointsPrice: 600,
    category: "数码电子", 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.9,
    sales: 1876,
    tags: ["降噪", "头戴式", "高音质"],
    description: "索尼旗舰级头戴式降噪耳机，30小时续航，极致音质体验。"
  },
  { 
    id: 3, 
    name: "小米13 Pro 智能手机", 
    price: 4299, 
    originalPrice: 4999,
    pointsPrice: 1000,
    category: "数码电子", 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    rating: 4.7,
    sales: 3245,
    tags: ["5G", "拍照", "快充"],
    description: "小米13 Pro，骁龙8 Gen2处理器，徕卡影像系统，5G全网通。"
  },
  { 
    id: 4, 
    name: "iPad Air 5代 平板电脑", 
    price: 4399, 
    originalPrice: 4799,
    pointsPrice: 1100,
    category: "数码电子", 
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    rating: 4.8,
    sales: 1567,
    tags: ["M1芯片", "轻薄", "创作"],
    description: "iPad Air 5代，M1芯片强劲性能，10.9英寸液视网膜显示屏。"
  },
  { 
    id: 5, 
    name: "华为智能手表GT 4", 
    price: 1488, 
    originalPrice: 1688,
    pointsPrice: 400,
    category: "数码电子", 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    sales: 2134,
    tags: ["健康监测", "长续航", "运动"],
    description: "华为WATCH GT 4，健康管理专家，14天超长续航，100+运动模式。"
  },

  // 服饰鞋包类
  { 
    id: 6, 
    name: "优衣库纯棉基础T恤", 
    price: 79, 
    originalPrice: 99,
    pointsPrice: 50,
    category: "服饰鞋包", 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.5,
    sales: 5432,
    tags: ["纯棉", "基础款", "舒适"],
    description: "优衣库经典纯棉T恤，舒适透气，多色可选，日常百搭必备。"
  },
  { 
    id: 7, 
    name: "Levi's 经典牛仔裤", 
    price: 499, 
    originalPrice: 599,
    pointsPrice: 150,
    category: "服饰鞋包", 
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    rating: 4.7,
    sales: 3876,
    tags: ["经典", "耐穿", "百搭"],
    description: "Levi's 501经典牛仔裤，传承百年工艺，经典直筒版型。"
  },
  { 
    id: 8, 
    name: "Nike Air Max 运动鞋", 
    price: 899, 
    originalPrice: 1099,
    pointsPrice: 250,
    category: "服饰鞋包", 
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    rating: 4.8,
    sales: 4521,
    tags: ["运动", "舒适", "时尚"],
    description: "Nike Air Max经典运动鞋，气垫缓震技术，时尚运动首选。"
  },
  { 
    id: 9, 
    name: "Coach 真皮手提包", 
    price: 2899, 
    originalPrice: 3299,
    pointsPrice: 700,
    category: "服饰鞋包", 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.9,
    sales: 876,
    tags: ["真皮", "奢侈品", "经典"],
    description: "Coach经典真皮手提包，精湛工艺，时尚与实用并存。"
  },
  { 
    id: 10, 
    name: "Adidas 运动套装", 
    price: 399, 
    originalPrice: 499,
    pointsPrice: 120,
    category: "服饰鞋包", 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.6,
    sales: 2987,
    tags: ["运动", "套装", "透气"],
    description: "Adidas经典运动套装，透气面料，运动休闲两相宜。"
  },

  // 家用电器类
  { 
    id: 11, 
    name: "戴森V15吸尘器", 
    price: 4990, 
    originalPrice: 5490,
    pointsPrice: 1200,
    category: "家用电器", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.9,
    sales: 1234,
    tags: ["无线", "强吸力", "除螨"],
    description: "戴森V15无线吸尘器，激光显尘科技，强劲吸力深度清洁。"
  },
  { 
    id: 12, 
    name: "小米空气净化器4", 
    price: 1299, 
    originalPrice: 1499,
    pointsPrice: 350,
    category: "家用电器", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.7,
    sales: 3456,
    tags: ["除甲醛", "静音", "智能"],
    description: "小米空气净化器4，智能除甲醛，静音运行，守护家人健康。"
  },
  { 
    id: 13, 
    name: "美的破壁料理机", 
    price: 599, 
    originalPrice: 799,
    pointsPrice: 180,
    category: "家用电器", 
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    rating: 4.5,
    sales: 2765,
    tags: ["破壁", "多功能", "易清洗"],
    description: "美的破壁料理机，多功能一体，破壁技术释放营养。"
  },
  { 
    id: 14, 
    name: "海尔智能冰箱", 
    price: 3999, 
    originalPrice: 4599,
    pointsPrice: 1000,
    category: "家用电器", 
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    rating: 4.8,
    sales: 987,
    tags: ["智能", "大容量", "节能"],
    description: "海尔智能冰箱，大容量设计，智能保鲜，节能环保。"
  },

  // 美妆个护类
  { 
    id: 15, 
    name: "兰蔻小黑瓶精华", 
    price: 1080, 
    originalPrice: 1280,
    pointsPrice: 300,
    category: "美妆个护", 
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    rating: 4.9,
    sales: 1876,
    tags: ["抗老", "精华", "奢侈品"],
    description: "兰蔻小黑瓶精华，抗老修护，肌肤年轻态，奢华护肤体验。"
  },
  { 
    id: 16, 
    name: "雅诗兰黛护肤套装", 
    price: 899, 
    originalPrice: 1199,
    pointsPrice: 250,
    category: "美妆个护", 
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    rating: 4.7,
    sales: 2341,
    tags: ["套装", "保湿", "美白"],
    description: "雅诗兰黛护肤套装，保湿美白双重功效，打造完美肌肤。"
  },
  { 
    id: 17, 
    name: "飞利浦电动牙刷", 
    price: 799, 
    originalPrice: 999,
    pointsPrice: 200,
    category: "美妆个护", 
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    rating: 4.8,
    sales: 3245,
    tags: ["电动", "清洁", "护齿"],
    description: "飞利浦电动牙刷，声波震动技术，深度清洁，呵护口腔健康。"
  },

  // 食品饮料类
  { 
    id: 18, 
    name: "星巴克精选咖啡豆", 
    price: 168, 
    originalPrice: 198,
    pointsPrice: 80,
    category: "食品饮料", 
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    rating: 4.6,
    sales: 4567,
    tags: ["精选", "香醇", "进口"],
    description: "星巴克精选咖啡豆，香醇浓郁，精选产地，品味生活。"
  },
  { 
    id: 19, 
    name: "蒙牛特仑苏纯牛奶", 
    price: 89, 
    originalPrice: 109,
    pointsPrice: 40,
    category: "食品饮料", 
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    rating: 4.5,
    sales: 6789,
    tags: ["纯牛奶", "营养", "品质"],
    description: "蒙牛特仑苏纯牛奶，优质奶源，营养丰富，健康每一天。"
  },

  // 母婴玩具类
  { 
    id: 20, 
    name: "乐高经典创意积木", 
    price: 299, 
    originalPrice: 399,
    pointsPrice: 100,
    category: "母婴玩具", 
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    rating: 4.9,
    sales: 1987,
    tags: ["益智", "创意", "安全"],
    description: "乐高经典创意积木，激发想象力，安全材质，寓教于乐。"
  }
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
  const [favorites, setFavorites] = useState<Set<number>>(new Set()); // 收藏状态
  const [cartItems, setCartItems] = useState<Set<number>>(new Set()); // 购物车状态
  
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
      // 加载本地存储的收藏和购物车数据
      loadLocalData();
    } catch (error) {
      console.error("解析用户数据失败:", error);
      router.push("/login");
    }
  }, [router]);

  // 加载本地存储的数据
  const loadLocalData = () => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      const savedCart = localStorage.getItem("cartItems");
      
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCartItems(new Set(cartData));
        setCartCount(cartData.length);
      }
    } catch (error) {
      console.error("加载本地数据失败:", error);
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
  
  // 跳转到充值页面
  const goToRecharge = () => {
    router.push('/recharge');
  };
  
  // 跳转到充值记录页面
  const goToRechargeHistory = () => {
    router.push('/recharge-history');
  };

  // 跳转到购买记录页面
  const goToPurchaseHistory = () => {
    router.push('/purchase-history');
  };

  // 跳转到商品详情页
  const goToProductDetail = (productId: number) => {
    router.push(`/product/${productId}`);
  };
  
  // 根据分类和搜索筛选商品
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "全部商品" || product.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // 切换收藏状态
  const toggleFavorite = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
  };

  // 添加到购物车
  const addToCart = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    const newCartItems = new Set(cartItems);
    if (!newCartItems.has(productId)) {
      newCartItems.add(productId);
      setCartItems(newCartItems);
      setCartCount(prev => prev + 1);
      localStorage.setItem("cartItems", JSON.stringify(Array.from(newCartItems)));
    }
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
              
              {/* 购买记录按钮 */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPurchaseHistory}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <History className="h-4 w-4 mr-1" />
                购买记录
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => router.push('/favorites')}
              >
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{favorites.size}</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => router.push('/cart')}
              >
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
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToRecharge}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  充值
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPurchaseHistory}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <History className="h-4 w-4 mr-1" />
                  购买记录
                </Button>
              </div>
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
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => goToProductDetail(product.id)}
              >
                <div className="aspect-square relative bg-gray-100 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 折扣标签 */}
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  {/* 爱心按钮 */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-gray-600 hover:text-red-500 transition-colors"
                    onClick={(e) => toggleFavorite(product.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="text-xs text-blue-600 mb-1 font-medium">{product.category}</div>
                  <h3 className="font-semibold mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* 评分和销量 */}
                  <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{product.sales}+已售</span>
                    </div>
                  </div>
                  
                  {/* 价格 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      {product.pointsPrice}积分
                    </div>
                    <div className="text-sm text-gray-400 line-through">¥{product.price}</div>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{product.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                    onClick={(e) => addToCart(product.id, e)}
                    disabled={cartItems.has(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cartItems.has(product.id) ? '已加入' : '加入购物车'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover:bg-blue-50 hover:border-blue-300"
                    onClick={(e) => toggleFavorite(product.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
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