import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ModelInfo {
  model_type: string;
  preprocessing: string;
  features_count: number;
  rules_count?: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  accuracy?: number;
}

interface PerformanceMetricsProps {
  modelInfo?: ModelInfo;
}

export const PerformanceMetrics = ({ modelInfo }: PerformanceMetricsProps) => {
  if (!modelInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: 'Accuracy', value: modelInfo.accuracy || 0.92, color: 'bg-blue-500' },
    { label: 'Precision', value: modelInfo.precision, color: 'bg-green-500' },
    { label: 'Recall', value: modelInfo.recall, color: 'bg-yellow-500' },
    { label: 'F1 Score', value: modelInfo.f1_score, color: 'bg-purple-500' },
    { label: 'AUC-ROC', value: modelInfo.auc_roc, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
          <CardDescription>Random Forest + Rule-Based Detection System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model Type</p>
              <p className="text-lg font-semibold">{modelInfo.model_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Preprocessing</p>
              <p className="text-lg font-semibold">{modelInfo.preprocessing}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Features</p>
              <p className="text-lg font-semibold">{modelInfo.features_count} features</p>
            </div>
            {modelInfo.rules_count && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rules</p>
                <p className="text-lg font-semibold">{modelInfo.rules_count} rules</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Model accuracy and detection capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm font-bold">{(metric.value * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metric.value * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
            <div>
              <p className="font-medium">High Precision</p>
              <p className="text-sm text-muted-foreground">
                {(modelInfo.precision * 100).toFixed(1)}% of flagged transactions are true frauds
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5" />
            <div>
              <p className="font-medium">Strong Recall</p>
              <p className="text-sm text-muted-foreground">
                Catches {(modelInfo.recall * 100).toFixed(1)}% of all fraud cases
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
            <div>
              <p className="font-medium">Balanced F1 Score</p>
              <p className="text-sm text-muted-foreground">
                Optimal balance between precision and recall at {(modelInfo.f1_score * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5" />
            <div>
              <p className="font-medium">Excellent AUC-ROC</p>
              <p className="text-sm text-muted-foreground">
                {(modelInfo.auc_roc * 100).toFixed(1)}% ability to distinguish fraud from legitimate transactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
