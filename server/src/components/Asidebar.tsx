
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import crest from "../../src/app/favicon.ico";

import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// ================= NAVIGATION LINKS =================

const mainLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Staff Management",
    href: "/admin/staff",
    icon: BriefcaseBusiness,
  },
  {
    label: "Student Management",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Schedule Management",
    href: "/admin/schedule",
    icon: CalendarDays,
  },
  {
    label: "User Registration",
    href: "/admin/user-registration",
    icon: UserPlus,
  },
];

type NavLink = (typeof mainLinks)[number];

type SupportTicket = {
  id: string;
  messages: {
    id: string;
    sender: "student" | "admin";
    content: string;
    date: string;
  }[];
};

const SUPPORT_STORAGE_KEY = "iarvs-admin-support-demo";
const SUPPORT_READ_KEY = "iarvs-admin-support-read";

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-8 " +
  "group-data-[collapsible=icon]:justify-center " +
  "group-data-[collapsible=icon]:gap-0 " +
  "group-data-[collapsible=icon]:mx-auto";

const ACTIVE_CLASS =
  "bg-[#021127] text-white hover:bg-[#021127] " +
  "hover:text-white data-[active=true]:bg-[#021127] " +
  "data-[active=true]:text-white " +
  "data-[active=true]:hover:bg-[#021127]";

const INACTIVE_CLASS =
  "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]";

const menuBtnClass = (active: boolean) =>
  `${COLLAPSED_BASE} ${
    active ? ACTIVE_CLASS : INACTIVE_CLASS
  }`;

const isActivePath = (
  pathname: string,
  href: string
) =>
  href === "/admin"
    ? pathname === "/admin"
    : pathname === href ||
      pathname.startsWith(`${href}/`);

// ================= SUPPORT NOTIFICATIONS =================

function getUnreadSupportCount(): number {
  try {
    const saved = localStorage.getItem(
      SUPPORT_STORAGE_KEY
    );

    if (!saved) return 0;

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return 0;

    const tickets = parsed as SupportTicket[];

    const readMessages = JSON.parse(
      localStorage.getItem(SUPPORT_READ_KEY) || "[]"
    ) as string[];

    if (!Array.isArray(readMessages)) return 0;

    const readSet = new Set(readMessages);

    return tickets.reduce((count, ticket) => {
      if (!Array.isArray(ticket.messages)) {
        return count;
      }

      const unread = ticket.messages.filter(
        (message) =>
          message.sender === "student" &&
          !readSet.has(message.id)
      );

      return count + unread.length;
    }, 0);
  } catch {
    return 0;
  }
}

// ================= LOGO HEADER =================

function LogoHeader({
  collapsed,
}: {
  collapsed: boolean;
}) {
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

      {collapsed && (
        <SidebarTrigger className="mt-1 h-8 w-8 [&_svg]:size-4" />
      )}
    </SidebarHeader>
  );
}

// ================= MAIN NAVIGATION =================

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
  links: NavLink[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1.5">
      <SidebarGroupLabel className="text-[11px] font-bold tracking-[0.1em] text-[#737373] uppercase">
        {label}
      </SidebarGroupLabel>

      <SidebarMenu className="gap-3">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(
            pathname,
            item.href
          );

          return (
            <SidebarMenuItem
              key={item.href}
              className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
            >
              <SidebarMenuButton
                isActive={active}
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                onClick={() =>
                  onNavigate(item.href)
                }
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

// ================= ADMIN SIDEBAR =================

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { setOpenMobile, state } =
    useSidebar();

  const collapsed = state === "collapsed";

  const [unreadCount, setUnreadCount] =
    useState(0);

  // Read support notifications from localStorage.
  useEffect(() => {
    const refreshNotifications = () => {
      setUnreadCount(getUnreadSupportCount());
    };

    refreshNotifications();

    window.addEventListener(
      "storage",
      refreshNotifications
    );

    window.addEventListener(
      "iarvs-support-updated",
      refreshNotifications
    );

    window.addEventListener(
      "focus",
      refreshNotifications
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshNotifications
      );

      window.removeEventListener(
        "iarvs-support-updated",
        refreshNotifications
      );

      window.removeEventListener(
        "focus",
        refreshNotifications
      );
    };
  }, [pathname]);

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  const supportActive = isActivePath(
    pathname,
    "/admin/support"
  );

  return (
    <Sidebar collapsible="icon">
      <LogoHeader collapsed={collapsed} />

      {/* MAIN MENU */}
      <SidebarContent className="flex flex-1 flex-col overflow-y-auto">
        <NavMenu
          pathname={pathname}
          onNavigate={navigate}
          collapsed={collapsed}
          label="Main Menu"
          links={mainLinks}
        />
      </SidebarContent>

      {/* SUPPORT — BOTTOM */}
      <SidebarFooter className="mt-auto shrink-0 border-t border-slate-200 px-2 py-3 dark:border-slate-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={supportActive}
              title={
                collapsed
                  ? `Support${
                      unreadCount > 0
                        ? ` (${unreadCount} unread)`
                        : ""
                    }`
                  : undefined
              }
              onClick={() =>
                navigate("/admin/support")
              }
              className={`${menuBtnClass(
                supportActive
              )} relative`}
            >
              <CircleHelp strokeWidth={1.8} />

              <span className="group-data-[collapsible=icon]:hidden">
                Support
              </span>

              {/* UNREAD NOTIFICATION BADGE */}
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread student support messages`}
                  className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-1 group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4"
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* SMALL NOTIFICATION DESCRIPTION */}
        {!collapsed && unreadCount > 0 && (
          <button
            type="button"
            onClick={() =>
              navigate("/admin/support")
            }
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2 text-left text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <Bell size={13} />

            {unreadCount} unread student{" "}
            {unreadCount === 1
              ? "message"
              : "messages"}
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
