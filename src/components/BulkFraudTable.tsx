import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  transaction_id: string;
  customer_id: string;
  transaction_amount: number;
  channel: string;
  timestamp: string;
  risk_score: number;
}

interface BulkFraudTableProps {
  transactions: Transaction[];
}

const BulkFraudTable: React.FC<BulkFraudTableProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = aValue.toString();
      const bStr = bValue.toString();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [transactions, searchTerm, sortField, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Transaction ID', 'Customer ID', 'Amount', 'Channel', 'Timestamp', 'Risk Score'].join(','),
      ...filteredAndSortedTransactions.map(transaction => [
        transaction.transaction_id || 'N/A',
        transaction.customer_id || 'N/A',
        transaction.transaction_amount || 0,
        transaction.channel || 'Unknown',
        transaction.timestamp || 'N/A',
        transaction.risk_score ? (transaction.risk_score * 100).toFixed(2) + '%' : '0%'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fraud_transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${filteredAndSortedTransactions.length} fraud transactions to CSV.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Fraudulent Transactions ({transactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select value={sortField} onValueChange={(value) => setSortField(value as keyof Transaction)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="risk_score">Risk Score</SelectItem>
              <SelectItem value="transaction_amount">Amount</SelectItem>
              <SelectItem value="timestamp">Date</SelectItem>
              <SelectItem value="customer_id">Customer ID</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" className="sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('transaction_id')}
                >
                  Transaction ID
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('customer_id')}
                >
                  Customer ID
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('transaction_amount')}
                >
                  Amount
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('channel')}
                >
                  Channel
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('timestamp')}
                >
                  Timestamp
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('risk_score')}
                >
                  Risk Score
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.transaction_id} className="border-l-4 border-l-destructive bg-destructive/5">
                  <TableCell className="font-medium">{transaction.transaction_id || 'N/A'}</TableCell>
                  <TableCell>{transaction.customer_id || 'N/A'}</TableCell>
                  <TableCell className="font-medium">
                    ${transaction.transaction_amount ? transaction.transaction_amount.toLocaleString() : '0'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.channel || 'Unknown'}</Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {transaction.risk_score ? (transaction.risk_score * 100).toFixed(1) : '0'}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkFraudTable;