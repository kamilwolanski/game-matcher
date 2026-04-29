import { RawgApiError, searchRawgGames } from "@/lib/clients/rawg.client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  try {
    const results = await searchRawgGames(query);

    return Response.json({ results });
  } catch (error) {
    console.error("Fetch error:", error);

    if (error instanceof RawgApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
