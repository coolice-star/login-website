"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingCart, Heart, Star, Search, Grid3X3, List } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  isHot?: boolean
  isNew?: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 模拟商品数据
  const products: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      price: 9999,
      originalPrice: 10999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 1234,
      category: "数码",
      isHot: true,
    },
    {
      id: "2",
      name: "MacBook Pro 16英寸",
      price: 19999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 856,
      category: "数码",
      isNew: true,
    },
    {
      id: "3",
      name: "Nike Air Max 270",
      price: 899,
      originalPrice: 1299,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 432,
      category: "服装",
    },
    {
      id: "4",
      name: "小米电视 65英寸",
      price: 2999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 678,
      category: "家电",
      isHot: true,
    },
    {
      id: "5",
      name: "戴森吸尘器 V15",
      price: 3999,
      originalPrice: 4599,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 234,
      category: "家电",
    },
    {
      id: "6",
      name: "AirPods Pro 2",
      price: 1899,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 567,
      category: "数码",
      isNew: true,
    },
  ]

  const categories = ["all", "数码", "服装", "家电"]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                商城
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                测试环境
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    <span className="h-4 w-4">用户</span>
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.loginType === "phone"
                      ? "手机登录"
                      : user.loginType === "email"
                        ? "账号登录"
                        : user.loginType === "qq"
                          ? "QQ登录"
                          : "支付宝登录"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <span className="h-4 w-4"></span>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来，{user.name}！</h2>
          <p className="text-gray-600">发现更多优质商品，享受购物乐趣</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "全部" : category}
                  </Button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.isHot && <Badge className="bg-red-500 hover:bg-red-600">热销</Badge>}
                    {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">新品</Badge>}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">¥{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button className="w-full mt-4">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    加入购物车
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">没有找到相关商品</p>
          </div>
        )}
      </main>
    </div>
  )
}
