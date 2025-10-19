import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { useData } from '@/contexts/DataContext';

// Default mock data for when no dataset is uploaded
const defaultFraudVsLegitData = [
  { name: 'Legitimate', count: 1234, color: '#10b981' },
  { name: 'Fraudulent', count: 89, color: '#ef4444' },
];

const defaultFraudTrendData = [
  { month: 'Jan', fraudRate: 6.5 },
  { month: 'Feb', fraudRate: 7.2 },
  { month: 'Mar', fraudRate: 5.8 },
  { month: 'Apr', fraudRate: 6.9 },
  { month: 'May', fraudRate: 4.3 },
  { month: 'Jun', fraudRate: 5.1 },
];

const defaultChannelData = [
  { name: 'Online', value: 45, color: '#3b82f6' },
  { name: 'ATM', value: 25, color: '#8b5cf6' },
  { name: 'POS', value: 20, color: '#10b981' },
  { name: 'Mobile', value: 10, color: '#f59e0b' },
];

const defaultRiskScatterData = [
  { amount: 100, risk: 15, status: 'safe' },
  { amount: 500, risk: 25, status: 'safe' },
  { amount: 1000, risk: 35, status: 'medium' },
  { amount: 2500, risk: 45, status: 'medium' },
  { amount: 5000, risk: 75, status: 'high' },
  { amount: 10000, risk: 85, status: 'high' },
  { amount: 15000, risk: 95, status: 'fraud' },
];

const Analytics = () => {
  const { transactions, summary } = useData();

  const fraudVsLegitData = useMemo(() => {
    if (transactions.length === 0) return defaultFraudVsLegitData;
    
    const legitCount = transactions.filter(t => t.is_fraud === 0).length;
    const fraudCount = transactions.filter(t => t.is_fraud === 1).length;
    
    return [
      { name: 'Legitimate', count: legitCount, color: '#10b981' },
      { name: 'Fraudulent', count: fraudCount, color: '#ef4444' },
    ];
  }, [transactions]);

  const fraudTrendData = useMemo(() => {
    if (transactions.length === 0) return defaultFraudTrendData;
    
    const dailyData = new Map<string, { total: number; fraud: number }>();
    
    transactions.forEach(transaction => {
      const timestamp = transaction.timestamp || transaction.Timestamp;
      if (!timestamp) return;
      
      const date = new Date(timestamp).toLocaleDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, { total: 0, fraud: 0 });
      }
      const dayData = dailyData.get(date)!;
      dayData.total++;
      if (transaction.is_fraud === 1) {
        dayData.fraud++;
      }
    });

    const sortedData = Array.from(dailyData.entries())
      .map(([date, data]) => ({
        month: date,
        fraudRate: data.total > 0 ? (data.fraud / data.total) * 100 : 0
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-10);
    
    return sortedData.length > 0 ? sortedData : defaultFraudTrendData;
  }, [transactions]);

  const channelData = useMemo(() => {
    if (transactions.length === 0) return defaultChannelData;
    
    const channelCounts = new Map<string, number>();
    transactions.filter(t => t.is_fraud === 1).forEach(transaction => {
      const channel = transaction.channel || transaction.Device_Type || 'Unknown';
      channelCounts.set(channel, (channelCounts.get(channel) || 0) + 1);
    });

    if (channelCounts.size === 0) return defaultChannelData;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    return Array.from(channelCounts.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [transactions]);

  const riskScatterData = useMemo(() => {
    if (transactions.length === 0) return defaultRiskScatterData;
    
    const scatterData = transactions
      .filter(t => t.is_fraud === 1)
      .map(t => {
        const amount = t.transaction_amount || t.Account_Balance || 0;
        let riskScore = t.risk_score || t.Risk_Score || 0;
        
        // Normalize risk score to 0-100 range
        if (riskScore <= 1) {
          riskScore = riskScore * 100;
        }
        
        return {
          amount: amount,
          risk: riskScore,
          status: riskScore > 80 ? 'fraud' : riskScore > 50 ? 'high' : 'medium'
        };
      })
      .filter(d => d.amount > 0 && d.risk > 0);
    
    return scatterData.length > 0 ? scatterData : defaultRiskScatterData;
  }, [transactions]);
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {transactions.length > 0 
              ? `Viewing analytics for ${transactions.length} uploaded transactions` 
              : 'Upload a CSV dataset to see dynamic analytics and insights'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fraud vs Legitimate */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud vs Legitimate Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fraudVsLegitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fraud Trend Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fraudTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="fraudRate" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fraud by Channel */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Distribution by Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry: any) => `${entry.name}`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction Amount vs Risk Score */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Amount vs Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={riskScatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="amount" name="Amount" />
                  <YAxis dataKey="risk" name="Risk Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="risk" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {summary?.total_transactions || 1323}
              </div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-destructive">
                {summary?.fraud_count || 89}
              </div>
              <div className="text-sm text-muted-foreground">Fraud Detected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">
                {summary ? (100 - summary.fraud_percentage).toFixed(1) : 93.3}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">
                ${summary ? (
                  transactions
                    .filter(t => t.is_fraud === 0)
                    .reduce((sum, t) => sum + t.transaction_amount, 0) / 1000000
                ).toFixed(1) : 2.4}M
              </div>
              <div className="text-sm text-muted-foreground">Amount Protected</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;