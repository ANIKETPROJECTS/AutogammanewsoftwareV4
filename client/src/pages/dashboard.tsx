import { useDashboard } from "@/hooks/use-dashboard";
import { Layout } from "@/components/layout/layout";
import { StatCard } from "@/components/ui/stat-card";
import { 
  IndianRupee, 
  Wrench, 
  MessageCircle, 
  Users,
  TrendingUp,
  Activity,
  History,
  Box
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const getIcon = (key: string) => {
    switch (key) {
      case "Balance Amount": return <IndianRupee className="h-6 w-6" />;
      case "Inquiries Today": return <MessageCircle className="h-6 w-6" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here's what's happening at Auto Gamma today.</p>
          </div>
          <div className="hidden sm:block text-sm text-muted-foreground font-medium bg-white px-4 py-2 rounded-lg border border-border">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard 
                label={stat.label}
                value={stat.label.includes("Amount") ? `₹${stat.value}` : stat.value}
                subtext={stat.subtext}
                icon={getIcon(stat.label)}
              />
            </motion.div>
          ))}
        </div>

        {/* Tickets Section */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b py-3 px-6 flex flex-row items-center gap-2">
            <History className="h-4 w-4 text-red-600" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {data?.activeJobs && data.activeJobs.length > 0 ? (
                data.activeJobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{job.customerName}</p>
                      <p className="text-sm text-slate-500">{job.vehicleInfo}</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 font-bold">
                      {job.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No tickets currently.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function DashboardSkeleton() {
  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </Layout>
  );
}

