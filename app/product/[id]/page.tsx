"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, TrendingUp, Heart, ShoppingCart, Coins, Truck, Shield, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// 商品数据（与shop页面保持一致）
const PRODUCTS = [
  // 数码电子类
  { 
    id: 1, 
    name: "苹果AirPods Pro 2代", 
    price: 1899, 
    originalPrice: 2199,
    pointsPrice: 500,
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

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [product, setProduct] = useState<any>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    // 查找商品
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    if (!foundProduct) {
      toast.error('商品不存在');
      router.push('/shop');
      return;
    }
    setProduct(foundProduct);

    // 检查登录状态
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    // 获取用户积分
    fetchUserPoints();

    // 检查收藏状态
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.includes(productId));
    }
  }, [productId, router]);

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

  // 切换收藏状态
  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem("favorites");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter((id: number) => id !== productId);
    } else {
      favorites.push(productId);
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '已取消收藏' : '已加入收藏');
  };

  // 购买商品
  const handlePurchase = async () => {
    if (!product) return;

    // 检查积分是否足够
    if (userPoints < product.pointsPrice) {
      toast.error(`积分不足！需要${product.pointsPrice}积分，当前只有${userPoints}积分`);
      return;
    }

    // 显示确认对话框
    setShowConfirmDialog(true);
  };

  // 确认购买
  const confirmPurchase = async () => {
    if (!product) return;

    setPurchasing(true);
    setShowConfirmDialog(false);

    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }

      // 创建购买订单
      const response = await fetch(`${API_BASE_URL}/purchase/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          points_price: product.pointsPrice,
          product_image: product.image
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success('购买成功！');
          // 更新用户积分
          setUserPoints(prev => prev - product.pointsPrice);
          // 跳转到购买成功页面
          router.push(`/purchase-success?order_id=${result.data.order_id}`);
        } else {
          toast.error(result.message || '购买失败');
        }
      } else {
        toast.error('购买失败，请重试');
      }
    } catch (error) {
      console.error("购买商品失败:", error);
      toast.error('网络错误，请重试');
    } finally {
      setPurchasing(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载商品信息中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 商品图片 */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 商品信息 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                    
                    {/* 评分和销量 */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span>({product.sales}+评价)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{product.sales}+已售</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className="hover:bg-red-50 hover:border-red-300"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 价格 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                      <Coins className="h-6 w-6" />
                      {product.pointsPrice}积分
                    </div>
                    <div className="text-lg text-gray-400 line-through">¥{product.price}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    您当前拥有 <span className="font-semibold text-blue-600">{userPoints}积分</span>
                  </div>
                </div>

                {/* 商品描述 */}
                <div>
                  <h3 className="font-semibold mb-2">商品描述</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* 标签 */}
                <div>
                  <h3 className="font-semibold mb-2">商品特色</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 服务保障 */}
                <div>
                  <h3 className="font-semibold mb-2">服务保障</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>免费配送</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>品质保证</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RefreshCw className="h-4 w-4 text-purple-600" />
                      <span>7天退换</span>
                    </div>
                  </div>
                </div>

                {/* 购买按钮 */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                    onClick={handlePurchase}
                    disabled={purchasing || userPoints < product.pointsPrice}
                  >
                    {purchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        购买中...
                      </>
                    ) : userPoints < product.pointsPrice ? (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        积分不足
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        立即购买
                      </>
                    )}
                  </Button>

                  {userPoints < product.pointsPrice && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/recharge')}
                    >
                      去充值获取积分
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 确认购买对话框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认购买</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>您确定要购买此商品吗？</p>
                
                {product && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                            <Coins className="h-4 w-4" />
                            {product.pointsPrice}积分
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>您当前积分：</span>
                        <span className="font-semibold text-blue-600">{userPoints}积分</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>购买后剩余：</span>
                        <span className="font-semibold text-green-600">{userPoints - product.pointsPrice}积分</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-600">购买后积分将立即扣除，请确认您的选择。</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPurchase}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={purchasing}
            >
              {purchasing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  购买中...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  确认购买
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 