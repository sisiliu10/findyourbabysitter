import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://berlinbabysitter.com"}/subscription?success=true`,
  server: process.env.POLAR_ENVIRONMENT === "sandbox" ? "sandbox" : "production",
});
