import { useLogout } from "@/app/lib/hooks/useLogout";

export function LogoutButton({ className }: { className?: string }) {
    const { logout, isLoggingOut } = useLogout();

  return (
    <button
      onClick={logout}
      className="mt-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 text-sm"
    >
    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
    </button>
  )
}