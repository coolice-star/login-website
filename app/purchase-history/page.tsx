"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingBag, Coins, Calendar, Package, RefreshCw, Eye } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PurchaseRecord {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  points_price: number;
  product_image: string;
  status: string;
  created_at: string;
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!token) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/purchase/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecords(result.data || []);
        } else {
          toast.error(result.message || '获取购买记录失败');
        }
      } else {
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录');
          localStorage.removeItem("access_token");
          router.push('/login');
        } else {
          toast.error('获取购买记录失败');
        }
      }
    } catch (error) {
      console.error("获取购买记录异常:", error);
      toast.error('网络连接失败，请检查网络');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchaseHistory();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">购买成功</Badge>;
      case 'failed':
        return <Badge variant="destructive">购买失败</Badge>;
      case 'pending':
        return <Badge variant="secondary">处理中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const viewProductDetail = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const filteredRecords = records.filter(record => {
    if (statusFilter === "all") return true;
    return record.status === statusFilter;
  });

  const sortedRecords = filteredRecords.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">加载购买记录中...</h2>
            <p className="text-gray-600">请稍候</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-2xl font-bold text-gray-900">购买记录</h1>
                <p className="text-gray-600">查看您的商品购买历史</p>
              </div>
            </div>
            
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  刷新中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </>
              )}
            </Button>
          </div>

          {/* Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">筛选状态:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="success">购买成功</SelectItem>
                    <SelectItem value="pending">处理中</SelectItem>
                    <SelectItem value="failed">购买失败</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600">
                  共找到 <span className="font-medium text-blue-600">{filteredRecords.length}</span> 条记录
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Records List */}
          {sortedRecords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无购买记录</h2>
                <p className="text-gray-500 mb-6">您还没有购买过任何商品，快去商城看看吧！</p>
                <Button onClick={() => router.push('/shop')}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  去购物
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedRecords.map((record) => (
                <Card key={record.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Left: Product Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {record.product_image ? (
                            <img 
                              src={record.product_image} 
                              alt={record.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {record.product_name}
                            </h3>
                            {getStatusBadge(record.status)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>订单号：</span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {record.order_id}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(record.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Price and Action */}
                      <div className="text-right">
                        <div className="mb-2">
                          <div className="text-lg font-bold text-blue-600 flex items-center gap-1 justify-end">
                            <Coins className="h-4 w-4" />
                            {record.points_price}积分
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewProductDetail(record.product_id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          查看商品
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          {sortedRecords.length > 0 && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-700 mb-3">需要帮助？</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    继续购物
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push('/recharge')}>
                    <Coins className="h-4 w-4 mr-1" />
                    充值积分
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