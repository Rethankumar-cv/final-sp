import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaction {
  id: string;
  customerId: string;
  transactionAmount: string;
  channel: string;
  kycVerified: string;
  timestamp: string;
  prediction: 'fraud' | 'legit';
  riskScore: number;
  confidence: number;
}

interface TransactionLogProps {
  refreshKey: number;
}

const TransactionLog: React.FC<TransactionLogProps> = ({ refreshKey }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('fraudshield_transactions') || '[]');
    
    // If no transactions exist, create some mock data
    if (savedTransactions.length === 0) {
      const mockTransactions: Transaction[] = [
        {
          id: 'TXN001',
          customerId: 'CUST001',
          transactionAmount: '2500.00',
          channel: 'Online',
          kycVerified: 'yes',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          prediction: 'legit',
          riskScore: 25,
          confidence: 89
        },
        {
          id: 'TXN002',
          customerId: 'CUST002',
          transactionAmount: '15000.00',
          channel: 'ATM',
          kycVerified: 'no',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          prediction: 'fraud',
          riskScore: 85,
          confidence: 92
        },
        {
          id: 'TXN003',
          customerId: 'CUST003',
          transactionAmount: '750.50',
          channel: 'POS',
          kycVerified: 'yes',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          prediction: 'legit',
          riskScore: 15,
          confidence: 87
        },
        {
          id: 'TXN004',
          customerId: 'CUST004',
          transactionAmount: '8500.00',
          channel: 'Mobile',
          kycVerified: 'no',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          prediction: 'fraud',
          riskScore: 78,
          confidence: 85
        },
        {
          id: 'TXN005',
          customerId: 'CUST005',
          transactionAmount: '1200.00',
          channel: 'Online',
          kycVerified: 'yes',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          prediction: 'legit',
          riskScore: 32,
          confidence: 79
        }
      ];
      
      localStorage.setItem('fraudshield_transactions', JSON.stringify(mockTransactions));
      setTransactions(mockTransactions);
    } else {
      setTransactions(savedTransactions);
    }
  }, [refreshKey]);

  // Filter and search transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.channel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.prediction === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.transactionAmount);
          bValue = parseFloat(b.transactionAmount);
          break;
        case 'risk':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'timestamp':
        default:
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchTerm, filterStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportTransactions = () => {
    const csv = [
      ['ID', 'Customer ID', 'Amount', 'Channel', 'KYC', 'Timestamp', 'Prediction', 'Risk Score', 'Confidence'],
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.customerId,
        tx.transactionAmount,
        tx.channel,
        tx.kycVerified,
        tx.timestamp,
        tx.prediction,
        tx.riskScore.toString(),
        tx.confidence.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Log</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="legit">Legitimate</SelectItem>
              <SelectItem value="fraud">Fraudulent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp-desc">Newest First</SelectItem>
              <SelectItem value="timestamp-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              <SelectItem value="risk-desc">Highest Risk</SelectItem>
              <SelectItem value="risk-asc">Lowest Risk</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className={transaction.prediction === 'fraud' ? 'bg-destructive/5' : ''}
                >
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>{transaction.customerId}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(transaction.transactionAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.channel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.kycVerified === 'yes' ? 'default' : 'destructive'}>
                      {transaction.kycVerified === 'yes' ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(transaction.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.prediction === 'fraud' ? 'destructive' : 'default'}
                      className={transaction.prediction === 'fraud' ? '' : 'bg-success text-success-foreground'}
                    >
                      {transaction.prediction === 'fraud' ? '❌ Fraud' : '✅ Legit'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        transaction.riskScore > 60 ? 'text-destructive' : 
                        transaction.riskScore > 30 ? 'text-warning' : 'text-success'
                      }`}>
                        {transaction.riskScore}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionLog;