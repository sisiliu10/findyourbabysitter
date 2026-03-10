import { CustomerPortal } from "@polar-sh/nextjs";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://berlinbabysitter.com"}/subscription`,
  server: process.env.POLAR_ENVIRONMENT === "sandbox" ? "sandbox" : "production",
  getCustomerId: async () => {
    const session = await getSession();
    if (!session) return "";
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { polarCustomerId: true },
    });
    return user?.polarCustomerId || "";
  },
});
