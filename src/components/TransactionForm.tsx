import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TransactionFormProps {
  onSubmit: () => void;
}

interface PredictionResult {
  prediction: 'fraud' | 'legit';
  riskScore: number;
  confidence: number;
  reason?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    kycVerified: '',
    accountAgeDays: '',
    transactionAmount: '',
    channel: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerId || !formData.kycVerified || !formData.accountAgeDays || 
        !formData.transactionAmount || !formData.channel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to fraud detection backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction logic based on inputs
      const amount = parseFloat(formData.transactionAmount);
      const accountAge = parseInt(formData.accountAgeDays);
      const isKycVerified = formData.kycVerified === 'yes';
      
      let riskScore = 0;
      const riskFactors: string[] = [];
      
      // Risk factors with reasons
      if (amount > 10000) {
        riskScore += 30;
        riskFactors.push(`the amount (₹${amount.toLocaleString()}) is significantly higher than usual`);
      } else if (amount > 5000) {
        riskScore += 15;
        riskFactors.push(`the amount (₹${amount.toLocaleString()}) is higher than average`);
      }
      
      if (accountAge < 30) {
        riskScore += 25;
        riskFactors.push(`the account is very new (${accountAge} days old)`);
      } else if (accountAge < 90) {
        riskScore += 10;
        riskFactors.push(`the account is relatively new (${accountAge} days old)`);
      }
      
      if (!isKycVerified) {
        riskScore += 20;
        riskFactors.push('the account is not KYC verified');
      }
      
      if (formData.channel === 'Online') {
        riskScore += 10;
        riskFactors.push('the transaction occurred through an online channel');
      }
      
      // Check transaction time (late night/early morning is suspicious)
      const hour = new Date(formData.timestamp).getHours();
      if (hour >= 0 && hour < 6) {
        riskScore += 15;
        riskFactors.push(`it occurred at an unusual time (${hour}:00 AM)`);
      }
      
      // Add some randomness
      riskScore += Math.floor(Math.random() * 20);
      
      const isFraud = riskScore > 60;
      const confidence = Math.min(95, 75 + Math.floor(Math.random() * 20));
      
      // Generate dynamic reason for fraud
      let reason = '';
      if (isFraud && riskFactors.length > 0) {
        reason = `This transaction is suspicious because ${riskFactors.join(', ')}.`;
      }
      
      const result: PredictionResult = {
        prediction: isFraud ? 'fraud' : 'legit',
        riskScore: Math.min(100, riskScore),
        confidence,
        reason: isFraud ? reason : undefined
      };
      
      setPrediction(result);
      
      // Save transaction to local storage for the transaction log
      const transaction = {
        id: `TXN${Date.now()}`,
        ...formData,
        prediction: result.prediction,
        riskScore: result.riskScore,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
      };
      
      const existingTransactions = JSON.parse(localStorage.getItem('fraudshield_transactions') || '[]');
      existingTransactions.unshift(transaction);
      localStorage.setItem('fraudshield_transactions', JSON.stringify(existingTransactions.slice(0, 100)));
      
      onSubmit();
      
      toast({
        title: "Transaction Processed",
        description: `Prediction: ${result.prediction.toUpperCase()} (${result.riskScore}% risk)`,
        variant: isFraud ? "destructive" : "default",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      kycVerified: '',
      accountAgeDays: '',
      transactionAmount: '',
      channel: '',
      timestamp: new Date().toISOString().slice(0, 16),
    });
    setPrediction(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer ID *</Label>
          <Input
            id="customerId"
            placeholder="Enter customer ID"
            value={formData.customerId}
            onChange={(e) => handleInputChange('customerId', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kycVerified">KYC Verified *</Label>
          <Select value={formData.kycVerified} onValueChange={(value) => handleInputChange('kycVerified', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select KYC status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountAge">Account Age (Days) *</Label>
          <Input
            id="accountAge"
            type="number"
            placeholder="Enter account age in days"
            value={formData.accountAgeDays}
            onChange={(e) => handleInputChange('accountAgeDays', e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Transaction Amount *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.transactionAmount}
            onChange={(e) => handleInputChange('transactionAmount', e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel">Channel *</Label>
          <Select value={formData.channel} onValueChange={(value) => handleInputChange('channel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transaction channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATM">ATM</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timestamp">Timestamp</Label>
          <Input
            id="timestamp"
            type="datetime-local"
            value={formData.timestamp}
            onChange={(e) => handleInputChange('timestamp', e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze Transaction
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>

      {/* Prediction Result */}
      {prediction && (
        <Card className={`border-2 ${
          prediction.prediction === 'fraud' 
            ? 'border-destructive bg-destructive/5' 
            : 'border-success bg-success/5'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              {prediction.prediction === 'fraud' ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Fraud Detected
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  Legitimate Transaction
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Risk Score:</span>
              <Badge variant={prediction.riskScore > 60 ? 'destructive' : 'secondary'}>
                {prediction.riskScore}%
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Confidence:</span>
              <span className="font-medium">{prediction.confidence}%</span>
            </div>
            {prediction.reason && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prediction.reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionForm;