import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface StatsProps {
  refreshKey: number;
}

interface Stats {
  totalTransactions: number;
  fraudDetected: number;
  fraudRate: number;
  totalAmount: number;
  avgRiskScore: number;
  accuracyRate: number;
}

const DashboardStats: React.FC<StatsProps> = ({ refreshKey }) => {
  const { transactions, summary } = useData();
  
  const stats = useMemo(() => {
    // If we have bulk data from DataContext, use that
    if (summary && transactions.length > 0) {
      const fraudDetected = transactions.filter(t => t.is_fraud === 1).length;
      const totalAmount = transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
      const avgRiskScore = transactions.reduce((sum, t) => sum + t.risk_score, 0) / transactions.length;
      
      return {
        totalTransactions: summary.total_transactions,
        fraudDetected: summary.fraud_count,
        fraudRate: summary.fraud_percentage,
        totalAmount,
        avgRiskScore: avgRiskScore * 100,
        accuracyRate: Math.max(85, 100 - summary.fraud_percentage)
      };
    }
    
    // Fallback to localStorage for single transactions
    const localTransactions = JSON.parse(localStorage.getItem('fraudshield_transactions') || '[]');
    
    if (localTransactions.length === 0) {
      return {
        totalTransactions: 5,
        fraudDetected: 2,
        fraudRate: 40.0,
        totalAmount: 27950.50,
        avgRiskScore: 47.0,
        accuracyRate: 93.2
      };
    }

    const totalTransactions = localTransactions.length;
    const fraudDetected = localTransactions.filter((tx: any) => tx.prediction === 'fraud').length;
    const fraudRate = totalTransactions > 0 ? (fraudDetected / totalTransactions) * 100 : 0;
    const totalAmount = localTransactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.transactionAmount), 0);
    const avgRiskScore = localTransactions.reduce((sum: number, tx: any) => sum + tx.riskScore, 0) / totalTransactions;

    return {
      totalTransactions,
      fraudDetected,
      fraudRate,
      totalAmount,
      avgRiskScore,
      accuracyRate: 93.2
    };
  }, [transactions, summary, refreshKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statCards = useMemo(() => [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: Activity,
      trend: '+12% from last week',
      trendUp: true,
      color: 'text-primary'
    },
    {
      title: 'Fraud Detected',
      value: stats.fraudDetected.toString(),
      icon: AlertTriangle,
      trend: `${stats.fraudRate.toFixed(1)}% fraud rate`,
      trendUp: false,
      color: 'text-destructive'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      trend: '+8.2% from last week',
      trendUp: true,
      color: 'text-success'
    },
    {
      title: 'Model Accuracy',
      value: `${stats.accuracyRate.toFixed(1)}%`,
      icon: Shield,
      trend: '+0.3% improvement',
      trendUp: true,
      color: 'text-primary'
    },
    {
      title: 'Avg Risk Score',
      value: `${stats.avgRiskScore.toFixed(1)}%`,
      icon: TrendingUp,
      trend: stats.avgRiskScore > 50 ? 'High risk period' : 'Normal levels',
      trendUp: stats.avgRiskScore <= 50,
      color: stats.avgRiskScore > 50 ? 'text-warning' : 'text-success'
    }
  ], [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card key={`${stat.title}-${index}`} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.trendUp ? (
                <TrendingUp className="h-3 w-3 mr-1 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
              )}
              {stat.trend}
            </div>
          </CardContent>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <stat.icon className="w-full h-full" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;