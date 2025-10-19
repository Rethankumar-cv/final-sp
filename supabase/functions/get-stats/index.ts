import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('get-stats function invoked');
    
    const { transactions } = await req.json();
    
    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ 
          status: 'error',
          message: 'Invalid input: transactions array is required',
          data: null 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate comprehensive statistics
    const totalTransactions = transactions.length;
    const fraudCount = transactions.filter((t: any) => 
      t.is_fraud === 1 || t.prediction === 'fraud'
    ).length;
    const legitCount = totalTransactions - fraudCount;
    
    const fraudRate = totalTransactions > 0 
      ? (fraudCount / totalTransactions) * 100 
      : 0;
    
    const totalAmount = transactions.reduce((sum: number, t: any) => 
      sum + (parseFloat(t.transaction_amount) || parseFloat(t.transactionAmount) || 0), 0
    );
    
    const avgRiskScore = totalTransactions > 0
      ? transactions.reduce((sum: number, t: any) => 
          sum + (parseFloat(t.risk_score) || parseFloat(t.riskScore) || 0), 0
        ) / totalTransactions
      : 0;
    
    // Model performance metrics (these would come from your ML model validation)
    const modelMetrics = {
      accuracy: 0.94,
      precision: 0.924,
      recall: 0.887,
      f1Score: 0.905,
      aucRoc: 0.951
    };
    
    // Calculate amount protected (fraud detected)
    const amountProtected = transactions
      .filter((t: any) => t.is_fraud === 1 || t.prediction === 'fraud')
      .reduce((sum: number, t: any) => 
        sum + (parseFloat(t.transaction_amount) || parseFloat(t.transactionAmount) || 0), 0
      );
    
    // Channel distribution
    const channelStats = transactions.reduce((acc: any, t: any) => {
      const channel = t.channel || t.Channel || 'Unknown';
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {});
    
    // Risk distribution
    const highRisk = transactions.filter((t: any) => 
      (t.risk_score || t.riskScore || 0) > 0.7
    ).length;
    const mediumRisk = transactions.filter((t: any) => {
      const score = t.risk_score || t.riskScore || 0;
      return score >= 0.4 && score <= 0.7;
    }).length;
    const lowRisk = totalTransactions - highRisk - mediumRisk;

    const stats = {
      status: 'success',
      message: 'Statistics calculated successfully',
      data: {
        overview: {
          totalTransactions,
          fraudDetected: fraudCount,
          legitimateTransactions: legitCount,
          fraudRate: parseFloat(fraudRate.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          avgRiskScore: parseFloat(avgRiskScore.toFixed(4)),
          amountProtected: parseFloat(amountProtected.toFixed(2))
        },
        modelPerformance: modelMetrics,
        riskDistribution: {
          high: highRisk,
          medium: mediumRisk,
          low: lowRisk
        },
        channelDistribution: channelStats,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Stats calculated successfully:', stats);

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in get-stats function:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
