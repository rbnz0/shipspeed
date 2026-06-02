"use client";

import { useState } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authClient.twoFactor.verifyTotp({ code });
      if (res.error) {
        toast.error("Invalid code. Please try again.");
      } else {
        toast.success("Verified successfully");
        window.location.href = "/";
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-xl">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Authentication Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || code.length < 6}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
