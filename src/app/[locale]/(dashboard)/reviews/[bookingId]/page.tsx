import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ReviewForm } from "./ReviewForm";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const session = await requireAuth();
  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking) notFound();

  // Only the parent of this booking can leave a review
  if (booking.parentId !== session.userId) redirect(`/bookings`);

  // Booking must be completed (not yet reviewed)
  if (booking.status !== "COMPLETED") redirect(`/bookings/${bookingId}`);

  // Already reviewed — send them back
  if (booking.review) redirect(`/bookings/${bookingId}`);

  return <ReviewForm bookingId={bookingId} />;
}
