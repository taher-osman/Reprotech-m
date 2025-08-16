import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Search, 
  Bell, 
  User, 
  Globe, 
  Settings,
  ChevronDown,
  Home,
  Zap
} from 'lucide-react';
import { navigationConfig, NavGroup, NavItem } from '../navigation/config';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge, CountBadge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/Input';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['dashboard']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Real stats state
  const [realStats, setRealStats] = useState({
    animals: 247, // Default fallback
    successRate: 89,
    activeCount: 12,
    loading: true
  });
  
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-expand current group based on active route
  useEffect(() => {
    const currentItem = navigationConfig
      .flatMap(group => group.items)
      .find(item => item.href === location.pathname);
    
    if (currentItem) {
      const parentGroup = navigationConfig.find(group => 
        group.items.some(item => item.href === location.pathname)
      );
      if (parentGroup && !expandedGroups.includes(parentGroup.id)) {
        setExpandedGroups(prev => [...prev, parentGroup.id]);
      }
    }
  }, [location.pathname, expandedGroups]);

  // Fetch real stats from backend
  const fetchRealStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test/analytics`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched real stats:', data);
        
        setRealStats({
          animals: data.real_counts?.animals || 0,
          successRate: 89, // Keep default for now
          activeCount: data.real_counts?.animals || 0, // Use animal count as active count
          loading: false
        });
      } else {
        console.log('⚠️ Stats API failed, using defaults');
        setRealStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.log('❌ Stats API error, using defaults:', error);
      setRealStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchRealStats();
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const getColorClasses = (color: string = 'blue') => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-l-blue-500',
      green: 'bg-green-50 text-green-700 border-l-green-500',
      pink: 'bg-pink-50 text-pink-700 border-l-pink-500',
      purple: 'bg-purple-50 text-purple-700 border-l-purple-500',
      indigo: 'bg-indigo-50 text-indigo-700 border-l-indigo-500',
      orange: 'bg-orange-50 text-orange-700 border-l-orange-500',
      teal: 'bg-teal-50 text-teal-700 border-l-teal-500',
      emerald: 'bg-emerald-50 text-emerald-700 border-l-emerald-500',
      cyan: 'bg-cyan-50 text-cyan-700 border-l-cyan-500',
      amber: 'bg-amber-50 text-amber-700 border-l-amber-500',
      slate: 'bg-slate-50 text-slate-700 border-l-slate-500',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const NavGroupComponent: React.FC<{ group: NavGroup }> = ({ group }) => {
    const isExpanded = expandedGroups.includes(group.id);
    const GroupIcon = group.icon;
    const hasActiveItem = group.items.some(item => isActive(item.href));

    return (
      <div className="mb-1">
        <button
          onClick={() => toggleGroup(group.id)}
          className={cn(
            "flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg group hover:bg-gray-50",
            hasActiveItem ? "text-primary bg-primary/5" : "text-gray-700 hover:text-gray-900"
          )}
        >
          <div className="flex items-center space-x-3">
            <GroupIcon className="h-5 w-5 transition-colors" />
            <span className="truncate">{group.title}</span>
            {hasActiveItem && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200 text-gray-400",
              isExpanded && "rotate-90",
              hasActiveItem && "text-primary"
            )}
          />
        </button>
        
        {isExpanded && (
          <div className="mt-1 space-y-0.5 ml-2 animate-in slide-in-from-top-2 duration-200">
            {group.items.map((item) => (
              <NavItemComponent key={item.id} item={item} groupColor={group.color} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const NavItemComponent: React.FC<{ item: NavItem; groupColor?: string }> = ({ item, groupColor }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative",
          active
            ? cn("border-l-2 pl-4", getColorClasses(groupColor))
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 ml-6"
        )}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <Icon className="mr-3 h-4 w-4 transition-colors flex-shrink-0" />
        <span className="flex-1 truncate">{item.title}</span>
        <div className="flex items-center space-x-1">
          {item.badge && (
            <Badge variant="secondary" size="sm">
              {item.badge}
            </Badge>
          )}
          {active && (
            <div className="w-1.5 h-1.5 bg-current rounded-full" />
          )}
        </div>
      </Link>
    );
  };

  const filteredNavigation = searchQuery
    ? navigationConfig
        .map(group => ({
          ...group,
          items: group.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }))
        .filter(group => group.items.length > 0)
    : navigationConfig;

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-in fade-in-0 duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-md shadow-xl border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                  <span className="text-white font-bold text-lg">RT</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Reprotech
                </span>
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-green-600 font-medium">● Online</div>
                  <Badge variant="success" size="sm">Pro</Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {realStats.loading ? '...' : realStats.animals}
                </div>
                <div className="text-xs text-muted-foreground">Animals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {realStats.loading ? '...' : `${realStats.successRate}%`}
                </div>
                <div className="text-xs text-muted-foreground">Success</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {realStats.loading ? '...' : realStats.activeCount}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <SearchInput
              placeholder="Search modules..."
              onSearch={setSearchQuery}
              size="sm"
              className="bg-gray-50/50 border-gray-200"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin">
            <div className="space-y-1">
              {filteredNavigation.map((group) => (
                <NavGroupComponent key={group.id} group={group} />
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 border-t border-border/50 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Frontend Mode</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 bg-white/90 backdrop-blur-md shadow-sm border-b border-border/50">
          <div className="flex flex-1 items-center px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-3"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb / Page title */}
            <div className="flex items-center space-x-2 mr-4">
              <Button variant="ghost" size="icon-sm" className="hidden sm:flex">
                <Home className="h-4 w-4" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <span className="font-medium text-gray-900 truncate">
                {navigationConfig
                  .flatMap(g => g.items)
                  .find(item => item.href === location.pathname)?.title || 'Dashboard'}
              </span>
            </div>

            {/* Center search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <SearchInput
                placeholder="Search animals, samples, procedures..."
                size="sm"
                className="bg-gray-50/50"
              />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Globe className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <CountBadge count={3} className="absolute -top-1 -right-1" />
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Settings className="h-4 w-4" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-border">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Dr. Admin</div>
                  <div className="text-xs text-muted-foreground">Veterinarian</div>
                </div>
                <div className="relative">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-md ring-2 ring-primary/20">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6 lg:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 