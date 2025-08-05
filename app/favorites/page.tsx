"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, ShoppingCart, Coins, Star, TrendingUp, RefreshCw, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

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

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    loadCartItems();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        const products = PRODUCTS.filter(product => favoriteIds.includes(product.id));
        setFavoriteProducts(products);
      }
    } catch (error) {
      console.error("加载收藏数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(new Set(JSON.parse(savedCart)));
      }
    } catch (error) {
      console.error("加载购物车数据失败:", error);
    }
  };

  const removeFavorite = (productId: number) => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      favorites = favorites.filter((id: number) => id !== productId);
      
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
      toast.success('已取消收藏');
    } catch (error) {
      console.error("取消收藏失败:", error);
      toast.error('操作失败');
    }
  };

  const addToCart = (productId: number) => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      let cartData = savedCart ? JSON.parse(savedCart) : [];
      
      if (!cartData.includes(productId)) {
        cartData.push(productId);
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        setCartItems(new Set(cartData));
        toast.success('已加入购物车');
      } else {
        toast.info('商品已在购物车中');
      }
    } catch (error) {
      console.error("加入购物车失败:", error);
      toast.error('操作失败');
    }
  };

  const goToProductDetail = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载收藏中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
                <p className="text-gray-600">管理您喜欢的商品</p>
              </div>
            </div>
            
            <Button 
              onClick={loadFavorites}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>

          {/* Favorites List */}
          {favoriteProducts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无收藏商品</h2>
                <p className="text-gray-500 mb-6">快去收藏您喜欢的商品吧！</p>
                <Button onClick={() => router.push('/shop')}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  去购物
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProducts.map(product => (
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
                    {/* 取消收藏按钮 */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500 hover:text-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(product.id);
                      }}
                    >
                      <Heart className="h-4 w-4 fill-red-500" />
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
                      {product.tags.slice(0, 2).map((tag: string, index: number) => (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      disabled={cartItems.has(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {cartItems.has(product.id) ? '已加入' : '加入购物车'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          {favoriteProducts.length > 0 && (
            <Card className="mt-6 bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-red-700 mb-3">共收藏了 {favoriteProducts.length} 件商品</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    继续购物
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push('/cart')}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    查看购物车
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 