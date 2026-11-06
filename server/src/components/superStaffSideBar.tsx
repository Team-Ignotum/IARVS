"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import crest from "../../src/app/favicon.ico";
import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  BookOpen, 
  ClipboardCheck,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainLinks = [
  {
    label: "Dashboard",
    href: "/super-staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Staff Management",
    href: "/super-staff/staff",
    icon: BriefcaseBusiness,
  },

  {
    label: "Schedule Management",
    href: "/super-staff/schedule",
    icon: CalendarDays,
  },
  
  {
    label: "Override Requests",
    href: "/super-staff/over-requests",
    icon: ClipboardCheck,
  },

  {
    label: "Curriculum Management",
    href: "/super-staff/curriculum",
    icon: BookOpen,
  },

];

type SupportTicket = {
  messages: {
    id: string;
    sender: "student" | "admin";
  }[];
};

const SUPPORT_STORAGE_KEY = "iarvs-admin-support-demo";
const SUPPORT_READ_KEY = "iarvs-admin-support-read";

function getUnreadSupportCount(): number {
  try {
    const savedTickets = localStorage.getItem(SUPPORT_STORAGE_KEY);
    if (!savedTickets) return 0;

    const parsedTickets: unknown = JSON.parse(savedTickets);
    if (!Array.isArray(parsedTickets)) return 0;

    const savedReadIds: unknown = JSON.parse(
      localStorage.getItem(SUPPORT_READ_KEY) || "[]",
    );
    if (!Array.isArray(savedReadIds)) return 0;

    const readIds = new Set(savedReadIds);

    return (parsedTickets as SupportTicket[]).reduce((count, ticket) => {
      if (!Array.isArray(ticket.messages)) return count;

      return count + ticket.messages.filter(
        (message) => message.sender === "student" && !readIds.has(message.id),
      ).length;
    }, 0);
  } catch {
    return 0;
  }
}

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto";
const ACTIVE_CLASS =
  "bg-[#021127] text-white hover:bg-[#021127] hover:text-white data-[active=true]:bg-[#021127] data-[active=true]:text-white data-[active=true]:hover:bg-[#021127]";
const INACTIVE_CLASS = "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]";

const menuBtnClass = (active: boolean) =>
  `${COLLAPSED_BASE} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`;

const isActivePath = (pathname: string, href: string) =>
  href === "/super-staff" ? pathname === "/super-staff" : pathname.startsWith(href);

function LogoHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <SidebarHeader className="p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
      <div
        className={`flex items-center justify-between group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-2 ${
          collapsed ? "" : "pt-2 pl-2"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={crest}
            alt="IARVS crest"
            width={30}
            height={30}
            className="shrink-0 rounded-md"
            style={{ display: "block" }}
          />
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-wide">
              IARVS PORTAL
            </span>
          )}
        </div>
        {!collapsed && (
          <SidebarTrigger className="mr-3 h-9 w-9 shrink-0 [&_svg]:size-5" />
        )}
      </div>
      {collapsed && <SidebarTrigger className="mt-1 h-8 w-8 [&_svg]:size-4" />}
    </SidebarHeader>
  );
}

function NavMenu({
  pathname,
  onNavigate,
  collapsed,
  label,
  links,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  collapsed: boolean;
  label: string;
  links: typeof mainLinks;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1.5">
      <SidebarGroupLabel className="text-[11px] font-bold tracking-[0.1em] text-[#737373] uppercase">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-3">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <SidebarMenuItem
              key={item.href}
              className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
            >
              <SidebarMenuButton
                isActive={active}
                title={collapsed ? item.label : undefined}
                onClick={() => onNavigate(item.href)}
                className={menuBtnClass(active)}
              >
                <Icon strokeWidth={1.8} />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function SuperStaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, state } = useSidebar();
  const collapsed = state === "collapsed";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const refreshNotifications = () => {
      setUnreadCount(getUnreadSupportCount());
    };

    refreshNotifications();
    window.addEventListener("storage", refreshNotifications);
    window.addEventListener("iarvs-support-updated", refreshNotifications);
    window.addEventListener("focus", refreshNotifications);

    return () => {
      window.removeEventListener("storage", refreshNotifications);
      window.removeEventListener("iarvs-support-updated", refreshNotifications);
      window.removeEventListener("focus", refreshNotifications);
    };
  }, [pathname]);

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  const supportActive = isActivePath(pathname, "/super-staff/support");

  return (
    <Sidebar collapsible="icon">
      <LogoHeader collapsed={collapsed} />
      <SidebarContent className="flex-1 overflow-auto">
        <NavMenu
          pathname={pathname}
          onNavigate={navigate}
          collapsed={collapsed}
          label="Main Menu"
          links={mainLinks}
        />
      </SidebarContent>
      <SidebarFooter className="mt-auto shrink-0 border-t border-slate-200 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={supportActive}
              title={collapsed ? `Support${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}` : undefined}
              onClick={() => navigate("/super-staff/support")}
              className={`${menuBtnClass(supportActive)} relative`}
            >
              <CircleHelp strokeWidth={1.8} />
              <span className="group-data-[collapsible=icon]:hidden">Support</span>
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread student support messages`}
                  className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-1 group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && unreadCount > 0 && (
          <button
            type="button"
            onClick={() => navigate("/super-staff/support")}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2 text-left text-xs text-slate-500 hover:text-blue-600"
          >
            <Bell size={13} />
            {unreadCount} unread student {unreadCount === 1 ? "message" : "messages"}
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
