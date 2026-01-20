"use client";

import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconClipboardList,
  IconCrown,
  IconCurrencyDollar,
  IconLoader2,
  IconSearch,
  IconShield,
  IconUser,
  IconUserShield,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/Guards/PermissionGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ActionEnum, ResourceEnum, ROLE_CONFIG, RoleEnum } from "@/enums";

interface AdminUser {
  id: string;
  uid: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position: string[];
  profilePicture: string | null;
  verified: boolean;
  status: string;
  lastLoginAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function RoleManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = useCallback(async (search: string = "") => {
    try {
      setIsLoading(true);
      const url = search
        ? `/api/admin/users?search=${encodeURIComponent(search)}`
        : "/api/admin/users";

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch users",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch users when debounced search changes
  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch, fetchUsers]);

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole) {
      toast.error("Please select a user and role");
      return;
    }

    if (selectedUser.role === newRole) {
      toast.error("User already has this role");
      return;
    }

    try {
      setIsAssigning(true);

      const response = await fetch("/api/admin/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: newRole,
          reason: reason.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to assign role");
      }

      toast.success(
        `Successfully assigned ${ROLE_CONFIG[newRole as RoleEnum].label} role to ${selectedUser.firstName} ${selectedUser.lastName}`,
      );

      // Refresh users list with current search
      await fetchUsers(debouncedSearch);

      // Reset form
      setSelectedUser(null);
      setNewRole("");
      setReason("");
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign role",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case RoleEnum.SUPER_ADMIN:
        return <IconCrown className="w-4 h-4" />;
      case RoleEnum.ADMIN:
        return <IconUserShield className="w-4 h-4" />;
      case RoleEnum.PROGRAMME:
        return <IconCalendar className="w-4 h-4" />;
      case RoleEnum.TREASURY:
        return <IconCurrencyDollar className="w-4 h-4" />;
      case RoleEnum.SECRETARIAT:
        return <IconClipboardList className="w-4 h-4" />;
      default:
        return <IconUser className="w-4 h-4" />;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <PermissionGuard resource={ResourceEnum.ROLES} action={ActionEnum.VIEW}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <IconShield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Role Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Assign and manage user roles and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <IconAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200 mb-1">
                Role Assignment Warning
              </p>
              <p className="text-amber-800 dark:text-amber-300">
                Changing user roles will immediately affect their access
                permissions across the admin panel. All role changes are logged
                for security purposes.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {searchQuery ? "Search Results" : "Admin Users"}
                </h2>
                <Badge variant="outline">{users.length} users</Badge>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchQuery && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {isLoading
                      ? "Searching..."
                      : `Found ${users.length} user${users.length !== 1 ? "s" : ""}`}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <IconUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? `No users found matching "${searchQuery}"`
                      : "No admin users found"}
                  </p>
                  {searchQuery && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Try searching by full name or email address
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    // biome-ignore lint/a11y/useSemanticElements: Complex card layout with nested elements, div is more appropriate than button
                    <div
                      key={user.id}
                      role="button"
                      tabIndex={0}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedUser?.id === user.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedUser(user);
                          setNewRole(user.role);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profilePicture || undefined} />
                          <AvatarFallback>
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </h3>
                            {user.uid === currentUser?.uid && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {user.email}
                          </p>

                          <div className="flex items-center gap-2">
                            <Badge
                              style={{
                                backgroundColor:
                                  ROLE_CONFIG[user.role as RoleEnum]?.color +
                                  "15",
                                color:
                                  ROLE_CONFIG[user.role as RoleEnum]?.color,
                                borderColor:
                                  ROLE_CONFIG[user.role as RoleEnum]?.color,
                              }}
                              className="flex items-center gap-1"
                            >
                              {getRoleIcon(user.role)}
                              <span>
                                {ROLE_CONFIG[user.role as RoleEnum]?.label ||
                                  user.role}
                              </span>
                            </Badge>

                            {user.verified && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                <IconCheck className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>

                          {user.lastLoginAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              Last login: {formatDate(user.lastLoginAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Role Assignment Form */}
          <div>
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Assign Role
              </h2>

              {!selectedUser ? (
                <div className="text-center py-8">
                  <IconUserShield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Select a user to assign a role
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected User Info */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Selected User
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.email}
                    </p>
                  </div>

                  {/* Current Role */}
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Current Role
                    </Label>
                    <div className="mt-1">
                      <Badge
                        style={{
                          backgroundColor:
                            ROLE_CONFIG[selectedUser.role as RoleEnum]?.color +
                            "15",
                          color:
                            ROLE_CONFIG[selectedUser.role as RoleEnum]?.color,
                          borderColor:
                            ROLE_CONFIG[selectedUser.role as RoleEnum]?.color,
                        }}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getRoleIcon(selectedUser.role)}
                        <span>
                          {ROLE_CONFIG[selectedUser.role as RoleEnum]?.label ||
                            selectedUser.role}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* New Role Selection */}
                  <div>
                    <Label htmlFor="role">New Role</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RoleEnum).map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(role)}
                              <div>
                                <div className="font-medium">
                                  {ROLE_CONFIG[role].label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {ROLE_CONFIG[role].description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason */}
                  <div>
                    <Label htmlFor="reason">
                      Reason (Optional but recommended)
                    </Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why are you changing this user's role?"
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      This will be recorded in the audit log
                    </p>
                  </div>

                  {/* Cannot change own role warning */}
                  {selectedUser.uid === currentUser?.uid && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        You cannot change your own role
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleAssignRole}
                    disabled={
                      isAssigning ||
                      !newRole ||
                      selectedUser.role === newRole ||
                      selectedUser.uid === currentUser?.uid
                    }
                    className="w-full"
                  >
                    {isAssigning ? (
                      <>
                        <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        Assigning Role...
                      </>
                    ) : (
                      <>
                        <IconShield className="w-4 h-4 mr-2" />
                        Assign Role
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
