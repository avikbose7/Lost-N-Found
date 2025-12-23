import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Users, Package, AlertTriangle, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const { toast } = useToast();
  
  // State for data
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingClaims: 0,
    unverifiedItems: 0,
    resolvedClaims: 0,
  });

  // State for user modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'x-auth-token': token } };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, claimsRes, itemsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', getAuthHeaders()),
          axios.get('http://localhost:5000/api/admin/claims', getAuthHeaders()),
          axios.get('http://localhost:5000/api/admin/items', getAuthHeaders()),
          axios.get('http://localhost:5000/api/admin/users', getAuthHeaders()),
        ]);
        
        setStats(statsRes.data);
        setClaims(claimsRes.data.map(c => ({...c, id: c._id})));
        setItems(itemsRes.data.map(i => ({...i, id: i._id})));
        setUsers(usersRes.data.map(u => ({...u, id: u._id})));
        
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        toast({
          title: "Error",
          description: "Could not load admin data. Are you logged in as an admin?",
          variant: "destructive"
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleClaimAction = async (claimId, action) => {
    const status = action === "approve" ? "approved" : "rejected";
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/claims/${claimId}`,
        { status },
        getAuthHeaders()
      );
      
      setClaims(prev =>
        prev.map(claim => (claim.id === claimId ? { ...res.data, id: res.data._id } : claim))
      );
      
      toast({
        title: `Claim ${status}`,
        description: `The claim has been ${status} successfully.`,
      });
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', getAuthHeaders());
      setStats(statsRes.data);

    } catch (err) {
      toast({ title: "Error", description: "Failed to update claim.", variant: "destructive" });
    }
  };

  const handleItemVerification = async (itemId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/items/${itemId}/verify`,
        {},
        getAuthHeaders()
      );
      
      setItems(prev =>
        prev.map(item => (item.id === itemId ? { ...res.data, id: res.data._id } : item))
      );
      
      toast({
        title: "Item Verification Updated",
        description: "The item verification status has been updated."
      });
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', getAuthHeaders());
      setStats(statsRes.data);

    } catch (err) {
      toast({ title: "Error", description: "Failed to update item.", variant: "destructive" });
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'student' });
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({ ...user, password: '' }); 
    setShowUserModal(true);
  };

  const openDeleteAlert = (user) => {
    setSelectedUser(user);
    setShowDeleteAlert(true);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }

        const res = await axios.put(
          `http://localhost:5000/api/admin/users/${selectedUser.id}`, 
          updateData, 
          getAuthHeaders()
        );
        
        setUsers(users.map(u => u.id === selectedUser.id ? { ...res.data, id: res.data._id } : u));
        setShowUserModal(false);
        toast({ title: "User Updated", description: "User details saved successfully." });

      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to update user.", variant: "destructive" });
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/admin/users`, 
          formData, 
          getAuthHeaders()
        );
        
        setUsers([...users, { ...res.data, id: res.data._id }]);
        setShowUserModal(false);
        toast({ title: "User Created", description: "New user added successfully." });

      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to create user.", variant: "destructive" });
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser.id}`, getAuthHeaders());
      
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowDeleteAlert(false);
      setSelectedUser(null);
      toast({ title: "User Deleted", description: "User has been deleted successfully." });

    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    }
  };

  const pendingClaims = claims.filter(claim => claim.status === "pending");
  const unverifiedItems = items.filter(item => !item.verified);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          {stats.pendingClaims > 0 && (
            <Badge variant="destructive" className="text-sm">
              {stats.pendingClaims} Pending Claims
            </Badge>
          )}
          {stats.unverifiedItems > 0 && (
            <Badge variant="secondary" className="text-sm">
              {stats.unverifiedItems} Unverified Items
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold">{stats.pendingClaims}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Unverified Items</p>
                <p className="text-2xl font-bold">{stats.unverifiedItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved Claims</p>
                <p className="text-2xl font-bold">{stats.resolvedClaims}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Manage Claims</TabsTrigger>
          <TabsTrigger value="items">Verify Items</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingClaims.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending claims at the moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingClaims.map(claim => (
                    <div
                      key={claim.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{claim.itemTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Claimed by: {claim.claimerName} ({claim.claimerEmail})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(claim.dateSubmitted).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleClaimAction(claim.id, "approve")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleClaimAction(claim.id, "reject")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Item Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.reportedBy}</TableCell>
                      <TableCell>{new Date(item.dateReported).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={item.verified ? "default" : "secondary"}>
                          {item.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleItemVerification(item.id)}
                        >
                          {item.verified ? "Unverify" : "Verify"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Create New User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead> 
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => openDeleteAlert(user)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Make changes to the user's profile." : "Fill in the details to create a new user."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={formData.name} onChange={handleFormChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleFormChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={formData.phone || ''} onChange={handleFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  {isEditMode ? 'New Password' : 'Password'}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={isEditMode ? "Leave blank to keep same" : ""}
                  value={formData.password} 
                  onChange={handleFormChange} 
                  className="col-span-3" 
                  required={!isEditMode}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Cancel</Button>
              <Button type="submit">{isEditMode ? 'Save Changes' : 'Create User'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account for <span className="font-medium">{selectedUser?.email}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}