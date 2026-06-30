import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  UserCog,
  Mail,
  Lock,
  Shield,
  Loader2,
} from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const updateEmail = async () => {
    setLoadingEmail(true);

    const { error } = await supabase.auth.updateUser({
      email,
    });

    setLoadingEmail(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email updated",
      description:
        "A confirmation email has been sent to your new address.",
    });
  };

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Minimum 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoadingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoadingPassword(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewPassword("");
    setConfirmPassword("");

    toast({
      title: "Password updated successfully",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCog className="w-7 h-7" />
          إعدادات الحساب
        </h1>

        <p className="text-muted-foreground mt-1">
          إدارة البريد الإلكتروني وكلمة المرور.
        </p>
      </div>

      {/* Email */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            البريد الإلكتروني
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div>
            <Label>البريد الإلكتروني</Label>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={updateEmail}
            disabled={loadingEmail}
          >
            {loadingEmail && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}

            تحديث البريد الإلكتروني
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

            <Label>كلمة المرور الجديدة</Label>

            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

          </div>

          <div>

            <Label>تأكيد كلمة المرور</Label>

            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>

          <Button
            onClick={updatePassword}
            disabled={loadingPassword}
          >
            {loadingPassword && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}

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
            <strong>البريد:</strong>{" "}
            {user?.email}
          </p>
        </CardContent>

      </Card>

    </div>
  );
}