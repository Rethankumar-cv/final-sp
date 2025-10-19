import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  transaction_id: string;
  customer_id: string;
  transaction_amount: number;
  channel: string;
  timestamp: string;
  is_fraud: number;
  risk_score: number;
  kyc_verified?: boolean;
  account_age_days?: number;
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

interface DatasetSummary {
  total_transactions: number;
  fraud_count: number;
  fraud_percentage: number;
  avg_fraud_risk_score: number;
  highest_risk_transaction: {
    id: string;
    score: number;
    amount: number;
  };
}

interface DataContextType {
  transactions: Transaction[];
  summary: DatasetSummary | null;
  bulkTransactions: Transaction[];
  modelInfo: any;
  updateDataset: (transactions: Transaction[], summary: DatasetSummary, modelInfo?: any) => void;
  clearDataset: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [bulkTransactions, setBulkTransactions] = useState<Transaction[]>([]);
  const [modelInfo, setModelInfo] = useState<any>({});

  const updateDataset = (newTransactions: Transaction[], newSummary: DatasetSummary, newModelInfo?: any) => {
    setTransactions(newTransactions);
    setSummary(newSummary);
    setBulkTransactions(newTransactions);
    if (newModelInfo) {
      setModelInfo(newModelInfo);
    }
  };

  const clearDataset = () => {
    setTransactions([]);
    setSummary(null);
    setBulkTransactions([]);
    setModelInfo({});
  };

  return (
    <DataContext.Provider value={{ transactions, summary, bulkTransactions, modelInfo, updateDataset, clearDataset }}>
      {children}
    </DataContext.Provider>
  );
};