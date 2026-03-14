import { NextResponse } from "next/server";
import { getKitas } from "@/lib/kita";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const district = searchParams.get("district") || undefined;
    const minRating = searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined;
    const hasSpots = searchParams.get("hasSpots") === "true" || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "18", 10), 50));

    const result = await getKitas({ q, district, minRating, hasSpots, page, limit });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search kitas",
      },
      { status: 500 }
    );
  }
}
