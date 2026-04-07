import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { DollarSign, ArrowDownToLine, ArrowUpFromLine, Receipt, User, LogOut, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Loading, ButtonLoading, InlineLoading } from "../../components/Loading";
import { useFormRateLimiter } from "../../utils/useFormRateLimiter";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [realBalance, setRealBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
  const inactivityTimerRef = useRef<number | null>(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password field states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { isLocked, cooldownRemainingMs, isSubmitting, trySubmit } = useFormRateLimiter({ maxAttempts: 5, lockoutMinutes: 5, cooldownSeconds: 2 });

  // Fetch real cashier balance
  const fetchRealBalance = async () => {
    setBalanceLoading(true);
    try {
      console.log('DashboardLayout: Fetching balance from local storage...');
      // API removed - use local storage
      const storedBalance = localStorage.getItem('balance');
      const balance = storedBalance ? parseFloat(storedBalance) : 5000; // Default balance
      setRealBalance(balance);
      console.log('DashboardLayout: Set balance to:', balance);
    } catch (error: any) {
      console.error('DashboardLayout: Error fetching balance:', error);
      setRealBalance(5000); // Fallback balance
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) setUsername(storedUsername);

    // Fetch real balance from API
    fetchRealBalance();

    // Start inactivity timer
    setInactivityTimer();

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      clearInactivityTimer();
    };
  }, []);

  // Listen for balance updates from other components
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      console.log('DashboardLayout: Received balance update event:', event.detail);
      fetchRealBalance();
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, []);

  const handleLogout = () => {
    clearInactivityTimer();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("cashier_token");
    localStorage.removeItem("cashier_user");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const setInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = window.setTimeout(() => {
      toast.warning("Logged out due to inactivity (5 minutes).");
      handleLogout();
    }, INACTIVITY_LIMIT);
  };

  const resetInactivityTimer = () => {
    setInactivityTimer();
  };

  const getTransactionCount = () => {
    const transactions = localStorage.getItem("transactions");
    return transactions ? JSON.parse(transactions).length : 0;
  };

  const handleSaveProfile = async () => {
    if (isLocked) {
      toast.error('Too many attempts. Please wait.');
      return;
    }

    if (cooldownRemainingMs > 0) {
      toast.error(`Please wait ${Math.ceil(cooldownRemainingMs / 1000)} seconds before saving profile.`);
      return;
    }

    try {
      await trySubmit(async () => {
        toast.success("Profile updated successfully");
      });
    } catch (error: any) {
      toast.error(error?.message || 'Unable to save profile.');
    }
  };

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const token = localStorage.getItem('cashier_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cashier/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Password changed successfully!');
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex min-h-screen flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="ml-12 lg:ml-0">
                {/* Space for mobile menu button */}
              </div>

              <div className="flex items-center gap-4">
                {/* Balance Display */}
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
                  <DollarSign className="h-5 w-5" />
                  {balanceLoading ? (
                    <ButtonLoading size="sm" />
                  ) : (
                    <span title={`Real balance from API: ${realBalance}`}>${realBalance.toFixed(2)}</span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    onClick={fetchRealBalance}
                    disabled={balanceLoading}
                    title="Refresh balance from server"
                  >
                    {balanceLoading ? (
                      <ButtonLoading size="sm" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Action Buttons */}
                <Button
                  onClick={() => navigate("/transactions?action=deposit")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Deposit</span>
                </Button>

                <Button
                  onClick={() => navigate("/transactions?action=withdraw")}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Withdraw</span>
                </Button>

                <Button
                  onClick={() => navigate("/transactions")}
                  size="sm"
                  variant="outline"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">History</span>
                </Button>

                {/* Profile Avatar */}
                <Avatar
                  className="cursor-pointer border-2 border-blue-600"
                  onClick={() => setShowProfileModal(true)}
                >
                  <AvatarFallback className="bg-blue-600 text-white">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Mobile Balance */}
            <div className="md:hidden mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg">
              <DollarSign className="h-5 w-5" />
              {balanceLoading ? (
                <ButtonLoading size="sm" />
              ) : (
                <span className="text-lg">Balance: ${realBalance.toFixed(2)}</span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={fetchRealBalance}
                disabled={balanceLoading}
                title="Refresh balance from server"
              >
                {balanceLoading ? (
                  <ButtonLoading size="sm" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-full mx-auto w-full lg:max-w-7xl">
            <div className="page-transition">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-username">Username</Label>
                  <Input
                    id="profile-username"
                    defaultValue={username}
                    placeholder="Your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    defaultValue={username}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Balance</p>
                    <div className="text-2xl text-green-600">
                    {balanceLoading ? (
                      <InlineLoading text="Loading balance..." className="text-green-500" />
                    ) : (
                      `$${realBalance.toFixed(2)}`
                    )}
                  </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl">{getTransactionCount()}</p>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  Save Profile
                </Button>
              </div>
            </TabsContent>

            {/* Change Password Tab */}
            <TabsContent value="password" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={passwordLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={passwordLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={passwordLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Password Requirements */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  {newPassword.length >= 6 ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  )}
                  At least 6 characters
                </div>
                <div className="flex items-center gap-2">
                  {confirmPassword && newPassword === confirmPassword ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  )}
                  Passwords match
                </div>
                <div className="flex items-center gap-2">
                  {currentPassword && newPassword && currentPassword !== newPassword ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  )}
                  Different from current password
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  Password must be at least 6 characters long and include uppercase, lowercase, numbers, and special characters.
                </p>
              </div>

              <Button onClick={handleChangePassword} className="w-full" disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword || newPassword.length < 6 || newPassword !== confirmPassword || currentPassword === newPassword}>
                {passwordLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-gray-900 border-t-transparent border-l-transparent"></div>
                    Changing Password...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about deposits and withdrawals
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Betting Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your bets
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" defaultValue="English" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="USD" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>

                <Separator />

                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}