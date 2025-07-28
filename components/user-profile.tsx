'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Camera, User, Check } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { API_BASE_URL } from '@/lib/env'

interface UserProfileProps {
  onProfileUpdate?: (userData: any) => void
}

export function UserProfile({ onProfileUpdate }: UserProfileProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 加载用户信息
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 先从本地存储获取基本信息
        const userStr = localStorage.getItem('user')
        if (!userStr) return
        
        const userData = JSON.parse(userStr)
        setUser(userData)
        setUsername(userData.name || '')
        
        // 如果有访问令牌，尝试从API获取最新信息
        const token = localStorage.getItem('access_token')
        if (token) {
          const apiUrl = `${API_BASE_URL}/auth/user/info`
          console.log('获取用户信息:', apiUrl)
          
          try {
            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              mode: 'cors'
            })
            
            console.log('用户信息响应状态:', response.status, response.statusText)
            
            if (response.ok) {
              const data = await response.json()
              console.log('用户信息响应数据:', data)
              
              if (data.success && data.data.user) {
                // 更新用户信息
                const updatedUser = {
                  ...userData,
                  ...data.data.user,
                  name: data.data.user.username || userData.name,
                  avatar: data.data.user.avatar || userData.avatar // 确保头像URL正确保存
                }
                setUser(updatedUser)
                setUsername(updatedUser.name || '')
                
                // 更新本地存储
                localStorage.setItem('user', JSON.stringify(updatedUser))
                
                // 打印日志确认头像URL
                console.log('更新后的用户数据:', updatedUser)
                console.log('头像URL:', updatedUser.avatar)
              }
            } else {
              console.error('获取用户信息失败:', response.status, response.statusText)
              const errorText = await response.text()
              console.error('错误详情:', errorText)
            }
          } catch (error) {
            console.error('获取用户信息请求失败:', error)
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
    
    fetchUserData()
  }, [])

  // 处理头像选择
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '不支持的文件类型',
        description: '请选择JPG、PNG或GIF格式的图片',
        variant: 'destructive'
      })
      return
    }
    
    // 验证文件大小（最大2MB）
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: '文件过大',
        description: '头像图片大小不能超过2MB',
        variant: 'destructive'
      })
      return
    }
    
    // 设置预览
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    setAvatarFile(file)
  }

  // 保存用户资料
  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('未登录')
      }
      
      // 如果有新头像，先上传头像
      let avatarUrl = user.avatar
      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)
        
        const uploadUrl = `${API_BASE_URL}/auth/user/upload-avatar`
        console.log('上传头像:', uploadUrl)
        
        try {
          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include',
            mode: 'cors'
          })
          
          console.log('头像上传响应状态:', uploadResponse.status, uploadResponse.statusText)
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error('头像上传失败:', errorText)
            throw new Error('头像上传失败')
          }
          
          const uploadResult = await uploadResponse.json()
          console.log('头像上传响应数据:', uploadResult)
          
          // 获取头像URL，确保是完整URL
          if (uploadResult.data && uploadResult.data.avatar_url) {
            // 如果返回的是相对路径，转换为完整URL
            const avatarPath = uploadResult.data.avatar_url
            if (avatarPath.startsWith('/')) {
              // 提取API基础URL的域名部分
              const apiUrlObj = new URL(API_BASE_URL)
              const baseUrl = `${apiUrlObj.protocol}//${apiUrlObj.host}`
              avatarUrl = `${baseUrl}${avatarPath}`
            } else {
              avatarUrl = avatarPath
            }
            console.log('构建的完整头像URL:', avatarUrl)
          }
        } catch (error) {
          console.error('头像上传请求失败:', error)
          throw new Error('头像上传失败')
        }
      }
      
      // 更新用户资料
      const updateUrl = `${API_BASE_URL}/auth/user/update`
      console.log('更新用户资料:', updateUrl)
      
      try {
        const updateResponse = await fetch(updateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: username,
            avatar: avatarUrl
          }),
          credentials: 'include',
          mode: 'cors'
        })
        
        console.log('更新资料响应状态:', updateResponse.status, updateResponse.statusText)
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('更新资料失败:', errorText)
          throw new Error('更新资料失败')
        }
        
        const updateResult = await updateResponse.json()
        console.log('更新资料响应数据:', updateResult)
        
        // 更新本地用户信息 - 修正字段名
        const updatedUser = {
          ...user,
          username: username,
          name: username,  // 确保name字段也被更新
          avatar: avatarUrl  // 确保avatar字段正确
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // 回调通知
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser)
        }
        
        toast({
          title: '更新成功',
          description: '您的个人资料已更新',
        })
        
        // 关闭对话框
        setIsDialogOpen(false)
      } catch (error) {
        console.error('更新资料请求失败:', error)
        throw new Error('更新资料失败')
      }
    } catch (error) {
      console.error('保存用户资料失败:', error)
      toast({
        title: '更新失败',
        description: error instanceof Error ? error.message : '保存资料时出错',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>个人资料</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑个人资料</DialogTitle>
          <DialogDescription>
            更新您的个人信息和头像
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* 头像上传 */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-blue-200">
                <AvatarImage 
                  src={avatarPreview || user.avatar || '/placeholder-user.jpg'} 
                  alt={user.name || '用户头像'}
                />
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              <Label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">上传头像</span>
              </Label>
              
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/gif" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              点击图标上传新头像（JPG、PNG或GIF，最大2MB）
            </div>
          </div>
          
          {/* 用户名输入 */}
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="请输入用户名"
            />
          </div>
          
          {/* 其他信息展示 */}
          {user.email && (
            <div className="grid gap-2">
              <Label>邮箱</Label>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          )}
          
          {user.phone && (
            <div className="grid gap-2">
              <Label>手机号</Label>
              <div className="text-sm text-gray-500">{user.phone}</div>
            </div>
          )}
          
          {user.social_type && (
            <div className="grid gap-2">
              <Label>登录方式</Label>
              <div className="text-sm text-gray-500 capitalize">
                {user.social_type === 'alipay' ? '支付宝' : 
                 user.social_type === 'qq' ? 'QQ' : 
                 user.social_type}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                保存
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 