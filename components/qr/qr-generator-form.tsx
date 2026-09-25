"use client";

import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Loader2, Link2 } from "lucide-react";
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
    <Card className="studio-panel">
      <CardHeader className="pb-1">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Link2 className="text-primary size-5" aria-hidden />
          <h2>Generate QR Code</h2>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Start with a link. We&apos;ll take care of the code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-700 dark:text-slate-200">
              URL
            </Label>
            <Input
              id="url"
              className="bg-background h-12 rounded-xl"
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
          <Button
            type="submit"
            className="studio-action h-12 w-full rounded-xl"
            disabled={isEmpty || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Generating...
              </>
            ) : (
              <>
                Generate QR Code <ArrowUpRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
