"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import crest from "../../src/app/favicon.ico";
import {
  BriefcaseBusiness,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  Settings,
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
} from "@/components/ui/sidebar";

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
];

const bottomLinks = [
  {
    label: "Support",
    href: "/admin/support",
    icon: CircleHelp,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const COLLAPSED_BASE =
  "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:mx-auto";
const ACTIVE_CLASS =
  "bg-[#021127] text-white hover:bg-[#021127] hover:text-white data-[active=true]:bg-[#021127] data-[active=true]:text-white data-[active=true]:hover:bg-[#021127]";
const INACTIVE_CLASS = "text-[#737373] hover:bg-gray-100 hover:text-[#0A0A0A]";

const menuBtnClass = (active: boolean) =>
  `${COLLAPSED_BASE} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`;

const isActivePath = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, state } = useSidebar();
  const collapsed = state === "collapsed";

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

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
        <NavMenu
          pathname={pathname}
          onNavigate={navigate}
          collapsed={collapsed}
          label="Settings"
          links={bottomLinks}
        />
      </SidebarContent>
    </Sidebar>
  );
}
