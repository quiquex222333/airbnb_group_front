import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon } from "lucide-react"

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ReactNode
  matchPaths?: string[]
}

interface NavMainProps {
  items: NavMainItem[]
  primaryAction?: {
    label: string
    url: string
    icon?: React.ReactNode
  }
}

export function NavMain({ items, primaryAction }: NavMainProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isItemActive = (item: NavMainItem) => {
    const candidates = [item.url, ...(item.matchPaths ?? [])]
    return candidates.some((p) =>
      p === "/" ? location.pathname === "/" : location.pathname.startsWith(p),
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {primaryAction && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={primaryAction.label}
                onClick={() => navigate(primaryAction.url)}
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground cursor-pointer"
              >
                {primaryAction.icon ?? <CirclePlusIcon />}
                <span>{primaryAction.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isItemActive(item)}
                render={
                  <NavLink to={item.url} className="cursor-pointer">
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
