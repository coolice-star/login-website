"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  ShoppingBag, 
  Shield, 
  Truck, 
  CreditCard, 
  Star, 
  ChevronRight, 
  User, 
  Smartphone, 
  Home, 
  Shirt, 
  Sparkles, 
  Utensils, 
  Baby, 
  Dumbbell, 
  BookOpen, 
  Tv, 
  Car, 
  Heart, 
  Gift,
  Zap,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Globe,
  Headphones,
  RefreshCw
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  
  // 检查用户是否已登录，如果已登录则直接进入商城
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/shop")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
              优品商城
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                登录
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                立即开始
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 英雄区块 */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-blue-600 border border-blue-200/50 relative z-30 shadow-md">
                <Sparkles className="h-4 w-4" />
                全新购物体验
              </span>
            </div>
            
            <div className="mb-6 relative z-30">
              <h1 className="text-5xl md:text-6xl font-bold mb-2 text-gray-900 leading-tight drop-shadow-sm">
                发现品质生活
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold mb-2 text-gray-900 leading-tight drop-shadow-sm">
                享受购物乐趣
              </h2>
            </div>
            
            <div className="mb-8 relative z-30">
              <p className="text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium bg-white/70 backdrop-blur-sm rounded-lg px-6 py-4 shadow-sm">
                汇聚全球优质商品，提供便捷安全的购物体验。从数码科技到时尚生活，一站式满足您的所有需求。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 relative z-30">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  开始购物
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-gray-400 hover:border-blue-400 px-8 py-3 text-lg bg-white/90 backdrop-blur-sm shadow-md text-gray-800 font-semibold">
                <Users className="mr-2 h-5 w-5" />
                了解更多
              </Button>
            </div>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto relative z-30">
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2 drop-shadow-sm">10万+</div>
                <div className="text-sm text-gray-800 font-semibold">优质商品</div>
              </div>
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-purple-600 mb-2 drop-shadow-sm">50万+</div>
                <div className="text-sm text-gray-800 font-semibold">满意用户</div>
              </div>
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-green-600 mb-2 drop-shadow-sm">99.9%</div>
                <div className="text-sm text-gray-800 font-semibold">好评率</div>
              </div>
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-orange-600 mb-2 drop-shadow-sm">24h</div>
                <div className="text-sm text-gray-800 font-semibold">快速配送</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 drop-shadow-sm">为什么选择优品商城</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              我们致力于为您提供最优质的购物体验，让每一次购买都成为愉悦的体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 drop-shadow-sm">品质保证</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                严格筛选每一件商品，确保品质优良，让您购买无忧
              </p>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 drop-shadow-sm">极速配送</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                24小时内发货，全国范围内快速配送，让您尽快收到心仪商品
              </p>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 drop-shadow-sm">安全支付</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                支持多种支付方式，采用银行级加密技术，保障资金安全
              </p>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 drop-shadow-sm">贴心服务</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                7×24小时客服支持，专业团队为您解答疑问，服务贴心周到
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 商品分类展示 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 drop-shadow-sm">热门分类</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              精选优质商品分类，满足您的不同需求
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Smartphone, name: "数码电子", color: "from-blue-500 to-blue-600", bg: "from-blue-50 to-blue-100" },
              { icon: Shirt, name: "服饰鞋包", color: "from-purple-500 to-purple-600", bg: "from-purple-50 to-purple-100" },
              { icon: Home, name: "家用电器", color: "from-green-500 to-green-600", bg: "from-green-50 to-green-100" },
              { icon: Sparkles, name: "美妆个护", color: "from-pink-500 to-pink-600", bg: "from-pink-50 to-pink-100" },
              { icon: Utensils, name: "食品饮料", color: "from-orange-500 to-orange-600", bg: "from-orange-50 to-orange-100" },
              { icon: Baby, name: "母婴玩具", color: "from-red-500 to-red-600", bg: "from-red-50 to-red-100" },
            ].map((category, index) => (
              <Card key={index} className={`text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br ${category.bg} cursor-pointer group shadow-md`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors drop-shadow-sm">
                  {category.name}
                </h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 drop-shadow-sm">用户好评</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              来自真实用户的评价，见证我们的服务品质
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "张小明",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                rating: 5,
                comment: "商品质量很好，物流速度超快，客服态度也很棒！已经推荐给朋友了。"
              },
              {
                name: "李美丽",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                rating: 5,
                comment: "购物体验非常好，界面简洁易用，商品描述详细准确，下次还会再来。"
              },
              {
                name: "王强",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                rating: 5,
                comment: "价格实惠，品质保证，售后服务也很到位，是我见过最好的购物平台之一。"
              }
            ].map((review, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 drop-shadow-sm">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">"{review.comment}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区块 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">开启您的购物之旅</h2>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto font-medium drop-shadow-md">
            加入我们的大家庭，享受优质商品和贴心服务，让购物成为一种享受
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold shadow-xl">
                <User className="mr-2 h-5 w-5" />
                立即注册
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold shadow-xl">
                <ShoppingBag className="mr-2 h-5 w-5" />
                开始购物
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">优品商城</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                致力于为用户提供优质的购物体验，汇聚全球好物，让生活更美好。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">购物指南</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">如何购买</a></li>
                <li><a href="#" className="hover:text-white transition-colors">支付方式</a></li>
                <li><a href="#" className="hover:text-white transition-colors">配送说明</a></li>
                <li><a href="#" className="hover:text-white transition-colors">退换政策</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">客户服务</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                <li><a href="#" className="hover:text-white transition-colors">意见反馈</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务承诺</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">关于我们</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">公司介绍</a></li>
                <li><a href="#" className="hover:text-white transition-colors">招聘信息</a></li>
                <li><a href="#" className="hover:text-white transition-colors">合作伙伴</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 优品商城 版权所有 | 让购物成为一种享受</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
