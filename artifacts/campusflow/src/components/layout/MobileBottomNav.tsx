import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  LayoutDashboard,
  MessageSquareWarning,
  CalendarDays,
  Megaphone,
  Bell,
  Wrench,
  TrendingUp,
} from "lucide-react";

export function MobileBottomNav() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const role = user.role;

  let navItems = [
    { label: "Home", href: `/dashboard/${role}`, icon: LayoutDashboard },
    { label: "Issues", href: "/student/issues", icon: MessageSquareWarning },
    { label: "Bookings", href: "/student/booking", icon: CalendarDays },
    { label: "Notices", href: "/notices", icon: Megaphone },
    {
      label: "Alerts",
      href: "/student/notifications",
      icon: Bell,
      badge: unreadCount,
    },
  ];

  if (role === "admin") {
    navItems = [
      { label: "Home", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Complaints", href: "/complaints", icon: MessageSquareWarning },
      { label: "Bookings", href: "/bookings/manage", icon: CalendarDays },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
      { label: "Notices", href: "/notices", icon: Megaphone },
    ];
  } else if (role === "faculty") {
    navItems = [
      { label: "Home", href: "/dashboard/faculty", icon: LayoutDashboard },
      { label: "Complaints", href: "/complaints", icon: MessageSquareWarning },
      { label: "Bookings", href: "/bookings/manage", icon: CalendarDays },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
      { label: "Notices", href: "/notices", icon: Megaphone },
    ];
  } else if (role === "maintenance") {
    navItems = [
      { label: "Home", href: "/dashboard/maintenance", icon: LayoutDashboard },
      { label: "My Tasks", href: "/complaints", icon: Wrench },
      { label: "Events", href: "/events", icon: CalendarDays },
      { label: "Notices", href: "/notices", icon: Megaphone },
    ];
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 py-2 px-3 flex items-center justify-around shadow-2xl safe-bottom">
      {navItems.map((item) => {
        const isActive =
          location === item.href || location.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <button
              type="button"
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-1.5 rounded-xl transition-all relative ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-primary" : ""
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary absolute bottom-0" />
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
