/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Clock3 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  expiresIn: number;
  challenge: string;
  loading: boolean;
  error?: string;
  onVerify: (code: string) => Promise<void>;
}

export default function OTPDialog({
  open,
  onOpenChange,
  email,
  expiresIn,
  challenge,
  loading,
  error,
  onVerify,
}: OTPDialogProps) {
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [remaining, setRemaining] = useState(expiresIn);

  useEffect(() => {
    setCode("");
    const deadline = Date.now() + expiresIn * 1000;
    setExpiresAt(deadline);
    setRemaining(expiresIn);
  }, [challenge, expiresIn]);

  useEffect(() => {
    if (!open || !expiresAt) return;

    const update = () => {
      setRemaining(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [open, expiresAt]);

  const time = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d3a66]/10">
            <ShieldCheck className="h-7 w-7 text-[#1d3a66]" />
          </div>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription className="text-center">
            Enter the six-digit verification code sent to your registered email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <p className="text-center text-sm font-medium">{email}</p>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={loading || remaining === 0}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <Clock3 className="h-4 w-4" />
            {remaining > 0
              ? `Code expires in ${time}`
              : "Code expired. Request a new code."}
          </div>

          {error && (
            <p role="alert" className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="button"
            className="w-full bg-[#1d3a66] hover:bg-[#152e53]"
            disabled={loading || code.length !== 6 || remaining === 0}
            onClick={async () => {
              try {
                await onVerify(code);
              } catch {
                setCode("");
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <p className="text-center text-xs text-neutral-500">
            If your code expires, close this window and request another code.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
