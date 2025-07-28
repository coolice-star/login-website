'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'
import { UserProfile } from '@/components/user-profile'
import { toast } from '@/components/ui/use-toast'

interface UserDropdownProps {
  className?: string
}

export function UserDropdown({ className }: UserDropdownProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  // 加载用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        console.log('UserDropdown - 加载的用户数据:', userData)
        console.log('UserDropdown - 头像URL:', userData.avatar)
        setUser(userData)
      } catch (error) {
        console.error('解析用户数据失败:', error)
      }
    }
  }, [])

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    toast({
      title: '已登出',
      description: '您已成功退出登录'
    })
    router.push('/')
  }

  // 处理用户资料更新
  const handleProfileUpdate = (updatedUser: any) => {
    console.log('UserDropdown - 用户资料已更新:', updatedUser)
    console.log('UserDropdown - 更新后的头像URL:', updatedUser.avatar)
    setUser(updatedUser)
  }

  if (!user) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/login')}>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  // 构建头像URL
  const avatarUrl = user.avatar || '/placeholder-user.jpg'
  console.log('UserDropdown - 显示的头像URL:', avatarUrl)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={avatarUrl} 
              alt={user.name || '用户头像'}
              onError={(e) => {
                console.log('头像加载失败，使用默认头像')
                // 如果头像加载失败，使用默认头像
                ;(e.target as HTMLImageElement).src = '/placeholder-user.jpg'
              }}
            />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={avatarUrl} 
              alt={user.name || '用户头像'} 
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/placeholder-user.jpg'
              }}
            />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.name || '未设置用户名'}</p>
            {user.social_type && (
              <p className="text-xs text-muted-foreground">
                {user.social_type === 'alipay' ? '支付宝账号登录' : 
                 user.social_type === 'qq' ? 'QQ账号登录' : 
                 user.social_type}
              </p>
            )}
          </div>
        </div>
        <UserProfile onProfileUpdate={handleProfileUpdate} />
        <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 