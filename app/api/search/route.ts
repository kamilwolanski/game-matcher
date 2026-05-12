import { shouldHideGame } from "@/lib/clients/rawg-filters";
import { RawgApiError, searchRawgGames } from "@/lib/clients/rawg.client";


const FINAL_RESULTS_LIMIT = 15;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  try {
    const results = await searchRawgGames(query);
    const filteredResults = results
      .filter((r) => !shouldHideGame(r))
      .slice(0, FINAL_RESULTS_LIMIT);
    return Response.json({ results: filteredResults });
  } catch (error) {
    console.error("Fetch error:", error);

    if (error instanceof RawgApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
