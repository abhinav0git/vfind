import { NextRequest, NextResponse } from "next/server";
import { vtonProcessor } from "@/lib/vtonProcessor";

export async function POST(req: NextRequest) {
  try {
    const { personImage, clothImage } = await req.json();

    if (!personImage || !clothImage) {
      return NextResponse.json({ error: "Missing images" }, { status: 400 });
    }

    const result = await vtonProcessor(personImage, clothImage);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("🔥 VTON route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", detail: error?.message },
      { status: 500 }
    );
  }
}
