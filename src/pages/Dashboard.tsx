import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TransactionForm from '@/components/TransactionForm';
import TransactionLog from '@/components/TransactionLog';
import DashboardStats from '@/components/DashboardStats';
import BulkUpload from '@/components/BulkUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor transactions, detect fraud, and analyze patterns in real-time.
          </p>
        </div>

        <DashboardStats refreshKey={refreshKey} />

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Single Transaction</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Check</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Transaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionForm onSubmit={handleTransactionSubmitted} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <TransactionLog refreshKey={refreshKey} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <BulkUpload refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;