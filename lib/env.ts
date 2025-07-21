/**
 * 环境变量工具
 * 用于获取和管理环境变量
 */

// API基础URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// 环境判断
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// 获取环境变量的工具函数
export function getEnv(key: string, defaultValue: string = ''): string {
  return (process.env[`NEXT_PUBLIC_${key}`] || defaultValue) as string;
}

// 当前环境名称
export const ENV_NAME = process.env.NODE_ENV || 'development'; 