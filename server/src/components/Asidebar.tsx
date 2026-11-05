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

// ================= STYLING =================

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-8 " +
  "group-data-[collapsible=icon]:justify-center " +
  "group-data-[collapsible=icon]:gap-0 " +
  "group-data-[collapsible=icon]:mx-auto";

const ACTIVE_CLASS =
  "bg-[#021127] text-white " +
  "hover:bg-[#021127] hover:text-white " +
  "data-[active=true]:bg-[#021127] " +
  "data-[active=true]:text-white " +
  "dark:!bg-[#1D4ED8] dark:!text-white " +
  "dark:hover:!bg-[#1D4ED8] " +
  "dark:data-[active=true]:!bg-[#1D4ED8] " +
  "dark:data-[active=true]:!text-white";

const INACTIVE_CLASS =
  "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A] " +
  "dark:text-slate-300 " +
  "dark:hover:bg-[#1E293B] " +
  "dark:hover:text-white";

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
    <SidebarHeader
      className="
        bg-white
        text-slate-900
        dark:!bg-[#0F172A]
        dark:text-slate-100
        p-0
        group-data-[collapsible=icon]:flex
        group-data-[collapsible=icon]:flex-col
        group-data-[collapsible=icon]:items-center
      "
    >
      <div
        className={`flex items-center justify-between
          group-data-[collapsible=icon]:w-full
          group-data-[collapsible=icon]:justify-center
          group-data-[collapsible=icon]:py-2
          ${collapsed ? "" : "pt-2 pl-2"}
        `}
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
            <span className="truncate text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
              IARVS PORTAL
            </span>
          )}
        </div>

        {!collapsed && (
          <SidebarTrigger
            className="
              mr-3 h-9 w-9 shrink-0
              text-slate-600
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-[#1E293B]
              [&_svg]:size-5
            "
          />
        )}
      </div>

      {collapsed && (
        <SidebarTrigger
          className="
            mt-1 h-8 w-8
            text-slate-600
            dark:text-slate-300
            dark:hover:bg-[#1E293B]
            [&_svg]:size-4
          "
        />
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
      <SidebarGroupLabel
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-[0.1em]
          text-slate-500
          dark:text-slate-400
        "
      >
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
              className="
                group-data-[collapsible=icon]:flex
                group-data-[collapsible=icon]:justify-center
              "
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

// ================= ADMIN SIDEBAR =================

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { setOpenMobile, state } = useSidebar();

  const collapsed = state === "collapsed";

  const [unreadCount, setUnreadCount] = useState(0);

  // ================= NOTIFICATION LISTENERS =================

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

  // ================= NAVIGATION =================

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  const supportActive = isActivePath(
    pathname,
    "/admin/support"
  );

  return (
    <Sidebar
      collapsible="icon"
      className="
        bg-white
        text-slate-900
        dark:!bg-[#0F172A]
        dark:text-slate-100
        [&_[data-slot=sidebar-inner]]:bg-white
        dark:[&_[data-slot=sidebar-inner]]:!bg-[#0F172A]
      "
    >
      <LogoHeader collapsed={collapsed} />

      {/* ================= MAIN MENU ================= */}

      <SidebarContent
        className="
          flex flex-1 flex-col overflow-y-auto
          bg-white
          dark:!bg-[#0F172A]
        "
      >
        <NavMenu
          pathname={pathname}
          onNavigate={navigate}
          collapsed={collapsed}
          label="Main Menu"
          links={mainLinks}
        />
      </SidebarContent>

      {/* ================= SUPPORT FOOTER ================= */}

      <SidebarFooter
        className="
          mt-auto
          shrink-0
          border-t
          border-slate-200
          bg-white
          px-2
          py-3
          dark:border-slate-700
          dark:!bg-[#0F172A]
        "
      >
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
              onClick={() => navigate("/admin/support")}
              className={`${menuBtnClass(supportActive)} relative`}
            >
              <CircleHelp strokeWidth={1.8} />

              <span className="group-data-[collapsible=icon]:hidden">
                Support
              </span>

              {/* UNREAD NOTIFICATION BADGE */}
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread student support messages`}
                  className="
                    ml-auto
                    inline-flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    group-data-[collapsible=icon]:absolute
                    group-data-[collapsible=icon]:-right-1
                    group-data-[collapsible=icon]:-top-1
                    group-data-[collapsible=icon]:h-4
                    group-data-[collapsible=icon]:min-w-4
                  "
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* UNREAD NOTIFICATION DESCRIPTION */}
        {!collapsed && unreadCount > 0 && (
          <button
            type="button"
            onClick={() => navigate("/admin/support")}
            className="
              mt-1
              flex
              w-full
              items-center
              gap-2
              rounded-md
              px-2
              text-left
              text-xs
              text-slate-500
              hover:text-blue-600
              dark:text-slate-400
              dark:hover:text-blue-400
            "
          >
            <Bell size={13} />

            {unreadCount} unread student{" "}
            {unreadCount === 1 ? "message" : "messages"}
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}