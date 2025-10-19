import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, DollarSign, Target } from 'lucide-react';

interface SummaryPanelProps {
  summary: {
    total_transactions: number;
    fraud_count: number;
    fraud_percentage: number;
    avg_fraud_risk_score: number;
    highest_risk_transaction: {
      id: string;
      score: number;
      amount: number;
    };
  };
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total_transactions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Processed in bulk upload</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fraud Transactions</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{summary.fraud_count}</div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              {summary.fraud_percentage.toFixed(1)}%
            </Badge>
            <p className="text-xs text-muted-foreground">of total</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Fraud Risk Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(summary.avg_fraud_risk_score * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Average risk level</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Risk Transaction</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            ${(summary.highest_risk_transaction?.amount ?? 0).toLocaleString()}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              ID: {summary.highest_risk_transaction?.id ?? 'N/A'}
            </p>
            <Badge variant="destructive" className="text-xs">
              {((summary.highest_risk_transaction?.score ?? 0) * 100).toFixed(1)}% Risk
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryPanel;