import { SidebarRoutes } from "./sidebar-routes"
import { Logo } from "@/components/logo"
import { UserButton } from "./user-button"

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 pt-8">
      <Logo />
      </div>
      <div className="flex flex-col w-full flex-grow">
        <SidebarRoutes />
      </div>
      <div className="p-4">
        <UserButton />
      </div>
    </div>
  )
}