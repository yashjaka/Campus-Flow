import { useState } from "react";
import { useAuth, UserProfile } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Wrench,
  Shield,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface DemoRole {
  role: "student" | "faculty" | "maintenance" | "admin";
  title: string;
  name: string;
  email?: string;
  enrollmentNumber?: string;
  department?: string;
  dashboardPath: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgHover: string;
  badgeClass: string;
}

const DEMO_ROLES: DemoRole[] = [
  {
    role: "student",
    title: "Student",
    name: "Priya Sharma",
    enrollmentNumber: "ENR2024001",
    department: "Computer Engineering",
    dashboardPath: "/dashboard/student",
    icon: GraduationCap,
    color: "text-emerald-400",
    bgHover: "hover:bg-emerald-500/15 hover:border-emerald-500/40",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    role: "faculty",
    title: "Faculty",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@campusflow.demo",
    department: "Computer Engineering",
    dashboardPath: "/dashboard/faculty",
    icon: BookOpen,
    color: "text-blue-400",
    bgHover: "hover:bg-blue-500/15 hover:border-blue-500/40",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    role: "maintenance",
    title: "Maintenance",
    name: "Carlos Rivera",
    email: "carlos.rivera@campusflow.demo",
    department: "Facilities & Maintenance",
    dashboardPath: "/dashboard/maintenance",
    icon: Wrench,
    color: "text-amber-400",
    bgHover: "hover:bg-amber-500/15 hover:border-amber-500/40",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    role: "admin",
    title: "Admin",
    name: "Campus Admin",
    email: "admin@campusflow.demo",
    department: "Administration",
    dashboardPath: "/dashboard/admin",
    icon: Shield,
    color: "text-purple-400",
    bgHover: "hover:bg-purple-500/15 hover:border-purple-500/40",
    badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
];

export function DemoRoleSwitcher() {
  const { user, login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const activeRole = user?.role;

  const handleSwitch = (target: DemoRole) => {
    const profile: UserProfile = {
      id: `cu-${target.role}-1`,
      name: target.name,
      role: target.role,
      email: target.email || null,
      enrollmentNumber: target.enrollmentNumber || null,
      department: target.department || null,
      createdAt: new Date().toISOString(),
    };

    login(`mock-token-${target.role}`, profile);
    setLocation(target.dashboardPath);
    setIsOpen(false);

    toast({
      title: `Switched to ${target.title}`,
      description: `Logged in as ${target.name}. Navigating to ${target.title} Dashboard.`,
    });
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 right-5 z-40 flex flex-col items-end gap-2 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.18 }}
            className="w-72 p-3 rounded-2xl glass-card border border-primary/20 shadow-2xl backdrop-blur-xl bg-background/95 dark:bg-zinc-950/90"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50 px-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Quick Role Switcher</span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-mono tracking-wider py-0 px-1.5"
              >
                Demo
              </Badge>
            </div>

            <div className="space-y-1.5">
              {DEMO_ROLES.map((item) => {
                const isActive = activeRole === item.role;
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSwitch(item)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all text-xs ${
                      isActive
                        ? "border-primary/50 bg-primary/10 shadow-sm"
                        : `border-transparent bg-muted/30 ${item.bgHover}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${isActive ? "text-primary-foreground" : item.color}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Switch →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size="sm"
        className="rounded-full shadow-lg border border-primary/30 backdrop-blur-md bg-background/90 text-foreground hover:bg-primary/10 hover:text-primary transition-all px-3 py-1.5 h-9 gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium">
          Role: {user ? user.role.toUpperCase() : "DEMO"}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5" />
        )}
      </Button>
    </div>
  );
}
