import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Shield, Database, Download, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

const Settings = () => {
  // Notification settings
  const [fraudAlerts, setFraudAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('high');

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Data settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState('12');

  // App settings
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [compactLayout, setCompactLayout] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Simulate password update
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly.",
    });
    
    // Simulate data export
    setTimeout(() => {
      const data = JSON.stringify({
        transactions: localStorage.getItem('fraudshield_transactions') || '[]',
        settings: {
          notifications: { fraudAlerts, emailNotifications, highRiskAlerts, alertThreshold },
          security: { sessionTimeout, loginNotifications },
          data: { autoBackup, dataRetention },
          app: { language, timezone, compactLayout, theme }
        },
        exportDate: new Date().toISOString()
      }, null, 2);
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fraudshield-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your data has been downloaded successfully.",
      });
    }, 1000);
  };

  const handleDeleteAllData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      localStorage.removeItem('fraudshield_transactions');
      toast({
        title: "Data Deleted",
        description: "All transaction data has been permanently deleted.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      notifications: { fraudAlerts, emailNotifications, highRiskAlerts, alertThreshold },
      security: { sessionTimeout, loginNotifications },
      data: { autoBackup, dataRetention },
      app: { language, timezone, compactLayout, theme }
    };
    
    localStorage.setItem('fraudshield_settings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "All your preferences have been saved successfully.",
    });
  };

  const handleCancel = () => {
    // Reload settings from localStorage or reset to defaults
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and security settings.
          </p>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fraud Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when fraud is detected
                </p>
              </div>
              <Switch checked={fraudAlerts} onCheckedChange={setFraudAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about transactions
                </p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Risk Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert for high-risk transactions above threshold
                </p>
              </div>
              <Switch checked={highRiskAlerts} onCheckedChange={setHighRiskAlerts} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Alert Threshold</Label>
              <Select value={alertThreshold} onValueChange={setAlertThreshold}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (30%)</SelectItem>
                  <SelectItem value="medium">Medium (60%)</SelectItem>
                  <SelectItem value="high">High (80%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new login attempts
                </p>
              </div>
              <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                placeholder="Enter current password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Enter new password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup transaction data
                </p>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Retention</Label>
                <p className="text-sm text-muted-foreground">
                  How long to keep transaction records
                </p>
              </div>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="destructive" className="flex items-center gap-2" onClick={handleDeleteAllData}>
                <Trash2 className="h-4 w-4" />
                Delete All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Layout</Label>
                <p className="text-sm text-muted-foreground">
                  Use a more condensed interface
                </p>
              </div>
              <Switch checked={compactLayout} onCheckedChange={setCompactLayout} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveSettings}>Save All Settings</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;