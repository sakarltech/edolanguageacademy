import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PhoneVerificationProps {
  countryCode: string;
  phoneNumber: string;
  isVerified: boolean;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  onVerificationComplete: (verified: boolean) => void;
}

// Common country codes with names
const COUNTRY_CODES = [
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", name: "United States/Canada", flag: "🇺🇸" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+237", name: "Cameroon", flag: "🇨🇲" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
];

export default function PhoneVerification({
  countryCode,
  phoneNumber,
  isVerified,
  onCountryCodeChange,
  onPhoneNumberChange,
  onVerificationComplete,
}: PhoneVerificationProps) {
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendOTP = trpc.otp.sendOTP.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      setOtpDialogOpen(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send verification code");
    },
  });

  const verifyOTP = trpc.otp.verifyOTP.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      onVerificationComplete(true);
      setOtpDialogOpen(false);
      setOtpCode("");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid verification code");
    },
  });

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    sendOTP.mutate({
      countryCode,
      phoneNumber: phoneNumber.replace(/[\s\-()]/g, ""), // Remove formatting
    });
  };

  const handleVerifyOTP = () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    verifyOTP.mutate({
      countryCode,
      phoneNumber: phoneNumber.replace(/[\s\-()]/g, ""),
      otpCode,
    });
  };

  const handleResendOTP = () => {
    setOtpCode("");
    handleSendOTP();
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="flex gap-2">
          {/* Country Code Selector */}
          <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={isVerified}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <Input
              id="phone"
              type="tel"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, ""); // Only digits
                onPhoneNumberChange(value);
              }}
              disabled={isVerified}
              className={isVerified ? "pr-10" : ""}
              required
            />
            {isVerified && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
            )}
          </div>
        </div>

        {!isVerified && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendOTP}
              disabled={sendOTP.isPending || !phoneNumber || phoneNumber.length < 8}
            >
              {sendOTP.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Verify Phone Number
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              We'll send you a 6-digit verification code
            </p>
          </div>
        )}

        {isVerified && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Phone number verified
          </p>
        )}
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit verification code to {countryCode} {phoneNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
                  setOtpCode(value);
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            {countdown > 0 ? (
              <p className="text-xs text-muted-foreground text-center">
                Resend code in {countdown} seconds
              </p>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={sendOTP.isPending}
                className="w-full"
              >
                {sendOTP.isPending ? "Sending..." : "Resend Code"}
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOtpDialogOpen(false);
                setOtpCode("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOTP}
              disabled={verifyOTP.isPending || otpCode.length !== 6}
            >
              {verifyOTP.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
