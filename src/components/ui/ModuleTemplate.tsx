import React from 'react';
import { LucideIcon, Plus, Search, Filter, Download, Upload, MoreHorizontal } from 'lucide-react';
import { Button, ButtonGroup } from './Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, FeatureCard } from './Card';
import { Badge, ModuleBadge } from './Badge';
import { SearchInput } from './Input';
import { cn } from '../../lib/utils';

interface ModuleTemplateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  children?: React.ReactNode;
  actions?: {
    primary?: { label: string; onClick: () => void; icon?: LucideIcon };
    secondary?: { label: string; onClick: () => void; icon?: LucideIcon };
    tertiary?: { label: string; onClick: () => void; icon?: LucideIcon };
  };
  features?: string[];
  badge?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    trend?: { value: number; direction: 'up' | 'down' | 'neutral' };
    color?: string;
  }>;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  headerActions?: React.ReactNode;
  loading?: boolean;
}

export const ModuleTemplate: React.FC<ModuleTemplateProps> = ({
  title,
  description,
  icon: Icon,
  color = 'blue',
  children,
  actions,
  features = [],
  badge,
  stats = [],
  searchPlaceholder,
  onSearch,
  headerActions,
  loading = false,
}) => {
  const getColorClasses = (colorName: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      amber: 'bg-amber-100 text-amber-600 border-amber-200',
      slate: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return colorMap[colorName as keyof typeof colorMap] || colorMap.blue;
  };

  const getGradientClasses = (colorName: string) => {
    const gradientMap = {
      blue: 'from-blue-50 to-blue-100/50',
      green: 'from-green-50 to-green-100/50',
      pink: 'from-pink-50 to-pink-100/50',
      purple: 'from-purple-50 to-purple-100/50',
      indigo: 'from-indigo-50 to-indigo-100/50',
      orange: 'from-orange-50 to-orange-100/50',
      teal: 'from-teal-50 to-teal-100/50',
      emerald: 'from-emerald-50 to-emerald-100/50',
      cyan: 'from-cyan-50 to-cyan-100/50',
      amber: 'from-amber-50 to-amber-100/50',
      slate: 'from-slate-50 to-slate-100/50',
    };
    return gradientMap[colorName as keyof typeof gradientMap] || gradientMap.blue;
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", getGradientClasses(color))} />
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className={cn("p-3 rounded-xl shadow-lg ring-1 ring-black/5", getColorClasses(color))}>
                <Icon className="h-8 w-8 lg:h-10 lg:w-10" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 tracking-tight">
                    {title}
                  </h1>
                  {badge && <ModuleBadge module={badge as any} />}
                  {loading && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  )}
                </div>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  {description}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {headerActions}
              {actions && (
                <ButtonGroup variant="separated" className="flex-wrap">
                  {actions.tertiary && (
                    <Button 
                      variant="ghost" 
                      onClick={actions.tertiary.onClick}
                      leftIcon={actions.tertiary.icon ? <actions.tertiary.icon className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    >
                      {actions.tertiary.label}
                    </Button>
                  )}
                  {actions.secondary && (
                    <Button 
                      variant="outline" 
                      onClick={actions.secondary.onClick}
                      leftIcon={actions.secondary.icon ? <actions.secondary.icon className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    >
                      {actions.secondary.label}
                    </Button>
                  )}
                  {actions.primary && (
                    <Button 
                      onClick={actions.primary.onClick}
                      leftIcon={actions.primary.icon ? <actions.primary.icon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      animation="bounce"
                    >
                      {actions.primary.label}
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" hover="lift" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <div className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2",
                        stat.trend.direction === 'up' ? "text-green-600 bg-green-50" :
                        stat.trend.direction === 'down' ? "text-red-600 bg-red-50" :
                        "text-gray-600 bg-gray-50"
                      )}>
                        <span className="mr-1">
                          {stat.trend.direction === 'up' ? '↗' : stat.trend.direction === 'down' ? '↘' : '→'}
                        </span>
                        {stat.trend.value}%
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl",
                    stat.color ? getColorClasses(stat.color) : getColorClasses(color)
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {onSearch ? (
                <SearchInput
                  placeholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
                  onSearch={onSearch}
                  className="w-full"
                />
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                  />
                </div>
              )}
            </div>
            <ButtonGroup variant="separated">
              <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {children ? (
        <div className="space-y-6">
          {children}
        </div>
      ) : (
        <Card variant="elevated" className="min-h-[400px]">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center max-w-md">
              <div className={cn("mx-auto p-4 rounded-xl mb-6", getColorClasses(color))}>
                <Icon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No data available
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                This is a clean frontend environment. Connect to backend or add sample data to get started.
              </p>
              {actions?.primary && (
                <Button 
                  onClick={actions.primary.onClick} 
                  size="lg"
                  leftIcon={actions.primary.icon && <actions.primary.icon className="h-5 w-5" />}
                  animation="bounce"
                >
                  {actions.primary.label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Features */}
      {features.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span>Module Features</span>
                <Badge variant="info" size="sm">Ready</Badge>
              </CardTitle>
              <CardDescription>
                Available features for backend integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getColorClasses(color).split(' ')[0])} />
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <FeatureCard
            title="Integration Ready"
            description="This module is designed with modern architecture patterns and is ready for seamless backend integration with RESTful APIs."
            icon={<Icon className="h-5 w-5" />}
            badge="Frontend Mode"
            action={
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}; 