import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'

// Instance chính dùng cho các API request
const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:8080/" : "api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true
})

// Instance riêng dùng CHỈ cho refresh token, không có interceptor
// Điều này tránh tình huống lồng nhau và vòng lặp
const refreshApi = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:8080/" : "api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  isRefreshing = false
  failedQueue = []
}

// Interceptor request - Thêm access token vào header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState() 
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
})

// Interceptor response - Xử lý lỗi 401 bằng cách refresh token
api.interceptors.response.use(
    // Success case - chỉ trả về response
    (response) => response,
    
    // Error case - xử lý lỗi 401
    async (error) => {
        const originalRequest = error.config

        // Nếu request là auth endpoint, không retry
        const authEndpoints = [
            '/api/auth/refresh',
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/me',
            '/api/auth/logout',
            '/api/auth/verify-otp',
            '/api/auth/resend-otp'
        ]
        const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))

        if (isAuthEndpoint) {
            return Promise.reject(error)
        }

        // Nếu không phải 401, reject luôn
        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }

        // Nếu đã đang refresh, thêm request vào queue chờ
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return api(originalRequest)
            }).catch(err => Promise.reject(err))
        }

        // Bắt đầu quá trình refresh
        isRefreshing = true

        try {
            console.log("Attempting to refresh token...")

            // Dùng refreshApi (không có interceptor) để gọi endpoint refresh
            // Cookies sẽ tự động được gửi kèm nhờ withCredentials: true
            const response = await refreshApi.post(
                '/auth/refresh', 
                {},
                { withCredentials: true }
            )

            console.log("Refresh response data:", response.data)  // Debug: xem toàn bộ response
            
            const newToken = response.data.accessToken || response.data.token

            if (!newToken) {
                throw new Error('No token in refresh response. Response: ' + JSON.stringify(response.data))
            }

            console.log("New token extracted:", newToken)  // Debug: xem token mới

            // Cập nhật token mới vào store
            const authStore = useAuthStore.getState()
            authStore.setAccessToken(newToken)
            console.log("Token updated in store. Current accessToken:", authStore.accessToken)  // Debug: verify store update

            console.log("Token refreshed successfully")

            // Xử lý queue - resolve tất cả pending requests với token mới
            processQueue(null, newToken)

            // Retry request gốc với token mới
            console.log("Retrying original request with new token:", newToken)  // Debug
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            return api(originalRequest)

        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError)

            // Refresh thất bại - xóa toàn bộ auth data
            processQueue(refreshError, null)
            
            useAuthStore.getState().clearState()

            // Điều hướng về trang login
            window.location.href = '/signin'

            return Promise.reject(refreshError)
        }
    }
)

export default api