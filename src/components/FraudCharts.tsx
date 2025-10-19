import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Transaction {
  is_fraud: number;
  timestamp: string;
  risk_score: number;
}

interface FraudChartsProps {
  transactions: Transaction[];
}

const COLORS = {
  fraud: 'hsl(var(--destructive))',
  legit: 'hsl(var(--primary))',
};

export const FraudCharts = ({ transactions }: FraudChartsProps) => {
  // Pie chart data
  const fraudCount = transactions.filter(t => t.is_fraud === 1).length;
  const legitCount = transactions.length - fraudCount;
  
  const pieData = [
    { name: 'Fraud', value: fraudCount, color: COLORS.fraud },
    { name: 'Legitimate', value: legitCount, color: COLORS.legit },
  ];

  // Line chart data - fraud detection over time
  const timeData = transactions
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .reduce((acc, transaction, index) => {
      const date = new Date(transaction.timestamp).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        if (transaction.is_fraud === 1) existing.frauds++;
        existing.total++;
      } else {
        acc.push({
          date,
          frauds: transaction.is_fraud === 1 ? 1 : 0,
          total: 1,
          index: index + 1
        });
      }
      return acc;
    }, [] as Array<{ date: string; frauds: number; total: number; index: number }>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fraud Distribution</CardTitle>
          <CardDescription>Ratio of fraudulent to legitimate transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-destructive">{fraudCount}</p>
              <p className="text-sm text-muted-foreground">Fraudulent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{legitCount}</p>
              <p className="text-sm text-muted-foreground">Legitimate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Trends</CardTitle>
          <CardDescription>Cumulative fraud detection over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="frauds" 
                stroke={COLORS.fraud}
                strokeWidth={2}
                name="Fraud Cases"
                dot={{ fill: COLORS.fraud }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={COLORS.legit}
                strokeWidth={2}
                name="Total Transactions"
                dot={{ fill: COLORS.legit }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
