import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

interface Transaction {
  transaction_id: string;
  customer_id: string;
  transaction_amount: number;
  channel: string;
  timestamp: string;
  is_fraud: number;
  risk_score: number;
  // Additional fields from bulk upload
  Timestamp?: string;
  Device_Type?: string;
  Account_Balance?: number;
  Risk_Score?: number;
  Transaction_Type?: string;
  Location?: string;
  Merchant_Category?: string;
  IP_Address_Flag?: number;
  Previous_Fraudulent_Activity?: number;
  Daily_Transaction_Count?: number;
  Avg_Transaction_Amount_7d?: number;
  Failed_Transaction_Count_7d?: number;
  Card_Type?: string;
  Card_Age?: number;
  Transaction_Distance?: number;
  Authentication_Method?: string;
  Is_Weekend?: boolean;
}

interface BulkInsightsProps {
  transactions: Transaction[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

const BulkInsights: React.FC<BulkInsightsProps> = ({ transactions }) => {
  // Fraud vs Legit Count
  const fraudVsLegit = [
    { name: 'Legit', count: transactions.filter(t => t.is_fraud === 0).length, fill: COLORS[0] },
    { name: 'Fraud', count: transactions.filter(t => t.is_fraud === 1).length, fill: COLORS[1] }
  ];

  // Fraud Trend Over Time (by day)
  const fraudTrend = React.useMemo(() => {
    const dailyData = new Map<string, { total: number; fraud: number }>();
    
    transactions.forEach(transaction => {
      const timestamp = transaction.timestamp || transaction.Timestamp;
      if (!timestamp) return;
      
      const date = new Date(timestamp).toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, { total: 0, fraud: 0 });
      }
      const dayData = dailyData.get(date)!;
      dayData.total++;
      if (transaction.is_fraud === 1) {
        dayData.fraud++;
      }
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        fraudPercentage: data.total > 0 ? (data.fraud / data.total) * 100 : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10); // Last 10 days
  }, [transactions]);

  // Fraud by Channel
  const fraudByChannel = React.useMemo(() => {
    const channelData = new Map<string, { total: number; fraud: number }>();
    
    transactions.forEach(transaction => {
      const channel = transaction.channel || transaction.Device_Type || 'Unknown';
      if (!channelData.has(channel)) {
        channelData.set(channel, { total: 0, fraud: 0 });
      }
      const data = channelData.get(channel)!;
      data.total++;
      if (transaction.is_fraud === 1) {
        data.fraud++;
      }
    });

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    return Array.from(channelData.entries()).map(([channel, data], index) => ({
      name: channel,
      value: data.fraud,
      color: colors[index % colors.length]
    }));
  }, [transactions]);

  // Amount Distribution (simplified as risk score vs amount for fraud transactions)
  const scatterData = React.useMemo(() => {
    return transactions
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
          riskScore: riskScore
        };
      })
      .filter(d => d.amount > 0 && d.riskScore > 0);
  }, [transactions]);

  // Risk Score Distribution (histogram data)
  const riskDistribution = React.useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}%`,
      count: 0
    }));

    transactions
      .filter(t => t.is_fraud === 1)
      .forEach(t => {
        let riskScore = t.risk_score || t.Risk_Score || 0;
        
        // Normalize if needed
        if (riskScore > 1) {
          riskScore = riskScore / 100;
        }
        
        const binIndex = Math.min(Math.floor(riskScore * 10), 9);
        bins[binIndex].count++;
      });

    return bins;
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fraud vs Legit Count</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudVsLegit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Fraud Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="fraudPercentage" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudByChannel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fraudByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Amount vs Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="amount" 
                type="number"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis 
                dataKey="riskScore"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'amount' ? `$${value.toLocaleString()}` : `${value.toFixed(1)}%`,
                  name === 'amount' ? 'Amount' : 'Risk Score'
                ]}
              />
              <Scatter dataKey="riskScore" fill="hsl(var(--destructive))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Fraud Risk Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkInsights;