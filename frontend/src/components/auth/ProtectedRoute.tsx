import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState, useRef } from "react"

const ProtectedRoute = () => {
  const { loading, refreshTokenHandler, fetchMe } = useAuthStore()
  const [starting, setstarting] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const hasInitialized = useRef(false)

  const init = async () => {
    try {
      // Luôn lấy từ getState() để có giá trị mới nhất từ localStorage
      const currentState = useAuthStore.getState()
      const currentToken = currentState.accessToken
      const currentUser = currentState.user
      
      console.log("ProtectedRoute init - current token:", currentToken ? "exists" : "null")
      
      // Nếu đã có token (từ localStorage), không cần refresh
      if (currentToken) {
        setIsAuthenticated(true)
        
        // Lấy thông tin user nếu chưa có
        if (!currentUser) {
          await fetchMe()
        }
      } else {
        // Chỉ khi KHÔNG có token, mới thử refresh (có thể có refresh token trong cookie)
        console.log("No token found, attempting refresh...")
        await refreshTokenHandler()
        
        // Kiểm tra lại sau khi refresh
        const newState = useAuthStore.getState()
        if (newState.accessToken) {
          setIsAuthenticated(true)
          
          if (!newState.user) {
            await fetchMe()
          }
        } else {
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error("Auth init error:", error)
      setIsAuthenticated(false)
    } finally {
      setstarting(false)
    }
  }

  useEffect(() => {
    if (location.pathname === "/signin" || location.pathname === "/signup") {
      setstarting(false)
      return
    }
    
    // Chỉ chạy init một lần, tránh double call từ StrictMode
    if (hasInitialized.current) {
      return
    }
    
    hasInitialized.current = true
    init()
  }, [])

  if (starting || loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    )
  }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute
