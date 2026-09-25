"use client";

import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlFormSchema, type UrlFormInput, type UrlFormOutput } from "@/lib/validators";

type Props = {
  onGenerate: (url: string) => Promise<void>;
};

export function QrGeneratorForm({ onGenerate }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UrlFormInput, unknown, UrlFormOutput>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: { url: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const value = useWatch({ control, name: "url" });
  const isEmpty = !value?.trim();

  const onValid = async ({ url }: UrlFormOutput) => {
    try {
      await onGenerate(url);
      reset({ url: "" });
    } catch (err) {
      console.error("Error generating QR code:", err);
      toast.error("Generation Failed", {
        description: "Failed to generate QR code. Please check the URL and try again.",
      });
    }
  };

  const onInvalid = (errs: FieldErrors<UrlFormInput>) => {
    toast.error(isEmpty ? "URL Required" : "Invalid URL", {
      description: errs.url?.message,
    });
  };

  const errorId = "url-error";

  return (
    <Card className="border-2 border-blue-100 shadow-lg dark:border-blue-900/50">
      <CardHeader className="bg-tint-blue py-4">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <QrCode className="size-5 text-blue-600 dark:text-blue-400" aria-hidden />
          <h2>Generate QR Code</h2>
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Enter a URL to generate a QR code that can be scanned by any QR code reader.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-700 dark:text-slate-200">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com"
              aria-invalid={errors.url ? true : undefined}
              aria-describedby={errors.url ? errorId : undefined}
              {...register("url")}
            />
            {errors.url && (
              <p id={errorId} role="alert" className="text-destructive text-sm">
                {errors.url.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isEmpty || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
