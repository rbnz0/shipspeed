import { headers } from "next/headers";
import { auth } from "~/server/better-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, AlertTriangle } from "lucide-react";

export default async function AdminSecurityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">
          Security configuration and system status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Auth Configuration</CardTitle>
            </div>
            <CardDescription>
              Better Auth plugin status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Organization Plugin</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Two-Factor Authentication</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Passkey / WebAuthn</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Plugin</span>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Middleware Protection</CardTitle>
            </div>
            <CardDescription>
              Route security status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Route Guard</span>
              <Badge variant="default">Active</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Auth Rate Limiting</span>
              <Badge variant="default">Active</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Security Headers</span>
              <Badge variant="default">Active</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">CSRF Protection</span>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Security Recommendations</CardTitle>
            </div>
            <CardDescription>
              Best practices for production deployments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Replace in-memory rate limiting with Redis</p>
              <p className="text-muted-foreground">
                The default middleware uses an in-memory Map for rate limiting.
                For production, replace this with Redis or Upstash to ensure
                rate limits work across serverless function invocations.
              </p>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Enable email verification</p>
              <p className="text-muted-foreground">
                Configure Resend in your Better Auth config to send verification
                emails. Set <code>requireEmailVerification: true</code> in the
                emailAndPassword config.
              </p>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Set up trusted origins</p>
              <p className="text-muted-foreground">
                Add your production domain to Better Auth&apos;s{" "}
                <code>trustedOrigins</code> array to prevent CSRF attacks on
                custom domains.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
