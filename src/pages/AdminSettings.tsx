import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCog, User, Lock, Shield, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const { username, updateUsername, updatePassword, loading } = useAuth();

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (username) setNewUsername(username);
  }, [username]);

  const handleUsername = async () => {
    setSavingUsername(true);
    const { error } = await updateUsername(newUsername);
    setSavingUsername(false);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "تم تحديث اسم المستخدم",
      description: "استخدم الاسم الجديد في تسجيل الدخول القادم.",
    });
  };

  const handlePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة",
        description: "الحد الأدنى 6 أحرف.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "كلمتا المرور غير متطابقتين", variant: "destructive" });
      return;
    }

    setSavingPassword(true);
    const { error } = await updatePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "تم تحديث كلمة المرور بنجاح" });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCog className="w-7 h-7" />
          إعدادات الحساب
        </h1>
        <p className="text-muted-foreground mt-1">
          إدارة اسم المستخدم وكلمة المرور.
        </p>
      </div>

      {/* Username */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            اسم المستخدم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اسم المستخدم الحالي</Label>
            <Input value={username ?? ""} readOnly dir="ltr" className="mt-1 bg-muted" />
          </div>
          <div>
            <Label htmlFor="new-username">اسم المستخدم الجديد</Label>
            <Input
              id="new-username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              dir="ltr"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              3–32 حرفًا، أحرف وأرقام و . _ - فقط
            </p>
          </div>
          <Button
            onClick={handleUsername}
            disabled={savingUsername || loading || !newUsername.trim() || newUsername.trim() === username}
          >
            {savingUsername && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
            تحديث اسم المستخدم
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            تغيير كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">كلمة المرور الحالية</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              dir="ltr"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              dir="ltr"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              dir="ltr"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handlePassword}
            disabled={savingPassword || !currentPassword || !newPassword}
          >
            {savingPassword && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
            تحديث كلمة المرور
          </Button>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>اسم المستخدم:</strong> {username ?? "—"}
          </p>
          <p>
            <strong>الصلاحية:</strong> مسؤول
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
