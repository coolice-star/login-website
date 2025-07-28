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
  Gift
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
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">优品商城</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
              登录
            </Link>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login?register=true">
                注册
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* 英雄区 */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              发现品质好物，享受美好生活
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              优品商城为您精选全球优质商品，让每一次购物都成为享受。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => router.push('/shop')}
              >
                立即购物 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
                    <Button
                      variant="outline"
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => router.push('/login')}
              >
                会员登录 <User className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] w-full relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {[
                    { icon: <Smartphone className="h-12 w-12 text-blue-200" />, name: "数码电子" },
                    { icon: <Shirt className="h-12 w-12 text-blue-200" />, name: "服饰鞋包" },
                    { icon: <Sparkles className="h-12 w-12 text-blue-200" />, name: "美妆个护" },
                    { icon: <Utensils className="h-12 w-12 text-blue-200" />, name: "食品饮料" }
                  ].map((item, i) => (
                    <div key={i} className="aspect-square bg-white/20 rounded-md flex flex-col items-center justify-center">
                      {item.icon}
                      <span className="mt-2 text-sm text-white">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      
      {/* 特色服务 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">我们的特色服务</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Truck className="h-8 w-8" />, title: "全国配送", desc: "快速可靠的物流服务" },
              { icon: <Shield className="h-8 w-8" />, title: "正品保障", desc: "所有商品均为正品" },
              { icon: <CreditCard className="h-8 w-8" />, title: "多种支付", desc: "支持多种支付方式" },
              { icon: <Star className="h-8 w-8" />, title: "优质服务", desc: "7×24小时客户服务" }
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
                </div>
                </div>
      </section>
      
      {/* 热门分类 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">热门分类</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              查看全部 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "数码电子", icon: <Smartphone className="h-6 w-6 text-blue-600" /> },
              { name: "家居生活", icon: <Home className="h-6 w-6 text-blue-600" /> },
              { name: "美妆个护", icon: <Sparkles className="h-6 w-6 text-blue-600" /> },
              { name: "服饰鞋包", icon: <Shirt className="h-6 w-6 text-blue-600" /> },
              { name: "食品饮料", icon: <Utensils className="h-6 w-6 text-blue-600" /> },
              { name: "母婴玩具", icon: <Baby className="h-6 w-6 text-blue-600" /> },
              { name: "运动户外", icon: <Dumbbell className="h-6 w-6 text-blue-600" /> },
              { name: "图书文娱", icon: <BookOpen className="h-6 w-6 text-blue-600" /> },
              { name: "家用电器", icon: <Tv className="h-6 w-6 text-blue-600" /> },
              { name: "汽车用品", icon: <Car className="h-6 w-6 text-blue-600" /> },
              { name: "医药健康", icon: <Heart className="h-6 w-6 text-blue-600" /> },
              { name: "珠宝配饰", icon: <Gift className="h-6 w-6 text-blue-600" /> }
            ].slice(0, 6).map((cat, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push('/shop')}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 mb-3 flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 促销活动 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">限时优惠</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "新人专享", 
                desc: "首单立减50元", 
                color: "from-pink-500 to-rose-500",
                icon: <Gift className="h-8 w-8 text-white" />
              },
              { 
                title: "限时折扣", 
                desc: "全场低至5折", 
                color: "from-amber-500 to-orange-500",
                icon: <Star className="h-8 w-8 text-white" />
              },
              { 
                title: "会员特权", 
                desc: "专属优惠券礼包", 
                color: "from-blue-500 to-indigo-500",
                icon: <CreditCard className="h-8 w-8 text-white" />
              }
            ].map((promo, i) => (
              <div 
                key={i} 
                className={`rounded-xl overflow-hidden shadow-lg h-64 bg-gradient-to-br ${promo.color} text-white p-6 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer`}
                onClick={() => router.push('/login')}
                >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-2xl mb-2">{promo.title}</h3>
                    <p className="text-white/80">{promo.desc}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    {promo.icon}
                  </div>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-max">
                  立即查看
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 底部 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">关于我们</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">公司简介</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">新闻中心</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">加入我们</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">购物指南</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">购物流程</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">会员介绍</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">配送方式</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">上门自提</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">211限时达</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">配送服务查询</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">联系我们</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">客服电话：400-123-4567</li>
                <li className="text-gray-400">服务时间：09:00-22:00</li>
                <li className="text-gray-400">邮箱：service@example.com</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2023 优品商城 版权所有</p>
          </div>
      </div>
      </footer>
    </div>
  )
}
