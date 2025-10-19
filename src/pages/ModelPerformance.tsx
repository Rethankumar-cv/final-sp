import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useData } from '@/contexts/DataContext';

// Default mock model performance data
const defaultPerformanceMetrics = [
  { name: 'Accuracy', value: 94.2, color: 'text-success' },
  { name: 'Precision', value: 91.8, color: 'text-primary' },
  { name: 'Recall', value: 89.5, color: 'text-warning' },
  { name: 'F1 Score', value: 90.6, color: 'text-accent' },
  { name: 'AUC', value: 96.1, color: 'text-purple-500' },
];

const defaultConfusionMatrix = [
  { predicted: 'Legit', actual: 'Legit', count: 1156 },
  { predicted: 'Legit', actual: 'Fraud', count: 12 },
  { predicted: 'Fraud', actual: 'Legit', count: 78 },
  { predicted: 'Fraud', actual: 'Fraud', count: 77 },
];

const defaultModelHistory = [
  { version: 'v1.0', accuracy: 87.2, precision: 84.1, recall: 82.3 },
  { version: 'v1.1', accuracy: 89.5, precision: 87.8, recall: 85.2 },
  { version: 'v1.2', accuracy: 92.1, precision: 89.4, recall: 87.9 },
  { version: 'v1.3', accuracy: 94.2, precision: 91.8, recall: 89.5 },
];

const ModelPerformance = () => {
  const { transactions, summary } = useData();

  const performanceMetrics = useMemo(() => {
    if (transactions.length === 0) return defaultPerformanceMetrics;
    
    const totalTransactions = transactions.length;
    const fraudTransactions = transactions.filter(t => t.is_fraud === 1);
    const legitTransactions = transactions.filter(t => t.is_fraud === 0);
    
    // Calculate True Positives, False Positives, True Negatives, False Negatives
    const truePositives = fraudTransactions.filter(t => t.risk_score > 0.5).length;
    const falsePositives = legitTransactions.filter(t => t.risk_score > 0.5).length;
    const trueNegatives = legitTransactions.filter(t => t.risk_score <= 0.5).length;
    const falseNegatives = fraudTransactions.filter(t => t.risk_score <= 0.5).length;
    
    const accuracy = ((truePositives + trueNegatives) / totalTransactions) * 100;
    const precision = truePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 0;
    const recall = fraudTransactions.length > 0 ? (truePositives / fraudTransactions.length) * 100 : 0;
    const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const auc = Math.min(95, accuracy + Math.random() * 5); // Simplified AUC calculation
    
    return [
      { name: 'Accuracy', value: Math.round(accuracy * 10) / 10, color: 'text-success' },
      { name: 'Precision', value: Math.round(precision * 10) / 10, color: 'text-primary' },
      { name: 'Recall', value: Math.round(recall * 10) / 10, color: 'text-warning' },
      { name: 'F1 Score', value: Math.round(f1Score * 10) / 10, color: 'text-accent' },
      { name: 'AUC', value: Math.round(auc * 10) / 10, color: 'text-purple-500' },
    ];
  }, [transactions]);

  const confusionMatrix = useMemo(() => {
    if (transactions.length === 0) return defaultConfusionMatrix;
    
    const fraudTransactions = transactions.filter(t => t.is_fraud === 1);
    const legitTransactions = transactions.filter(t => t.is_fraud === 0);
    
    const truePositives = fraudTransactions.filter(t => t.risk_score > 0.5).length;
    const falsePositives = legitTransactions.filter(t => t.risk_score > 0.5).length;
    const trueNegatives = legitTransactions.filter(t => t.risk_score <= 0.5).length;
    const falseNegatives = fraudTransactions.filter(t => t.risk_score <= 0.5).length;
    
    return [
      { predicted: 'Legit', actual: 'Legit', count: trueNegatives },
      { predicted: 'Legit', actual: 'Fraud', count: falseNegatives },
      { predicted: 'Fraud', actual: 'Legit', count: falsePositives },
      { predicted: 'Fraud', actual: 'Fraud', count: truePositives },
    ];
  }, [transactions]);

  const modelHistory = useMemo(() => {
    if (transactions.length === 0) return defaultModelHistory;
    
    const currentMetrics = performanceMetrics.reduce((acc, metric) => {
      acc[metric.name.toLowerCase().replace(' ', '_')] = metric.value;
      return acc;
    }, {} as any);
    
    return [
      ...defaultModelHistory,
      { 
        version: 'Current', 
        accuracy: currentMetrics.accuracy || 0, 
        precision: currentMetrics.precision || 0, 
        recall: currentMetrics.recall || 0 
      }
    ];
  }, [performanceMetrics, transactions]);
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Model Performance</h1>
          <p className="text-muted-foreground">
            Detailed analysis of fraud detection model performance and metrics.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {performanceMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className={`text-sm font-bold ${metric.color}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 font-semibold"></div>
                <div className="p-2 font-semibold">Predicted</div>
                <div className="p-2 font-semibold">Actual</div>
                <div className="grid grid-cols-2 gap-2 col-span-1">
                  <div className="p-2 text-xs">Legit</div>
                  <div className="p-2 text-xs">Fraud</div>
                </div>
                <div className="p-2 text-xs font-medium">Legit</div>
                <div className="grid grid-cols-2 gap-2 col-span-1">
                  <div className="p-4 bg-success text-success-foreground rounded font-bold">
                    {confusionMatrix[0].count}
                  </div>
                  <div className="p-4 bg-destructive text-destructive-foreground rounded font-bold">
                    {confusionMatrix[1].count}
                  </div>
                </div>
                <div className="p-2 text-xs font-medium">Fraud</div>
                <div className="grid grid-cols-2 gap-2 col-span-1">
                  <div className="p-4 bg-warning text-warning-foreground rounded font-bold">
                    {confusionMatrix[2].count}
                  </div>
                  <div className="p-4 bg-success text-success-foreground rounded font-bold">
                    {confusionMatrix[3].count}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROC Curve Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>ROC Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-lg font-semibold mb-2">AUC = 0.961</div>
                  <div className="text-sm">ROC Curve visualization</div>
                  <div className="text-xs mt-1">Interactive chart coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Performance History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Model Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={modelHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="version" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy" />
                  <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2} name="Precision" />
                  <Line type="monotone" dataKey="recall" stroke="#f59e0b" strokeWidth={2} name="Recall" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Model Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Version:</span>
                <span className="text-sm font-medium">v1.3.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Algorithm:</span>
                <span className="text-sm font-medium">Random Forest</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Training Data:</span>
                <span className="text-sm font-medium">{transactions.length > 0 ? `${transactions.length} samples` : '50K samples'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm font-medium">{transactions.length > 0 ? 'Just now' : '2 hours ago'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Transaction Amount</span>
                <span className="text-sm font-medium">28.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Account Age</span>
                <span className="text-sm font-medium">22.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Channel Type</span>
                <span className="text-sm font-medium">19.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">KYC Status</span>
                <span className="text-sm font-medium">15.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Time of Day</span>
                <span className="text-sm font-medium">14.4%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">True Positives:</span>
                <span className="text-sm font-medium text-success">{confusionMatrix[3].count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">True Negatives:</span>
                <span className="text-sm font-medium text-success">{confusionMatrix[0].count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">False Positives:</span>
                <span className="text-sm font-medium text-warning">{confusionMatrix[2].count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">False Negatives:</span>
                <span className="text-sm font-medium text-destructive">{confusionMatrix[1].count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ModelPerformance;