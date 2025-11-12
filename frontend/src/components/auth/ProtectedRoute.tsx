import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react"

const ProtectedRoute = () => {
  const { accessToken, user, loading, refreshTokenHandler, fetchMe } = useAuthStore()
  const [starting, setstarting] = useState(true)

  const init = async () => {
    // Thử refresh token nếu chưa có accessToken
    // Cookies sẽ tự động được gửi để verify refresh_token
    if(!accessToken) {
      await refreshTokenHandler()
    }

    if(accessToken && !user) {
      await fetchMe()
    }
    
    setstarting(false)
  }

  useEffect(() => {
    if (location.pathname === "/signin" || location.pathname === "/signup") {
      setstarting(false)
      return
    }
    init()
  }, [])

  if(starting || loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
  }

  if(!accessToken) {
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
