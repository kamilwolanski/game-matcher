export type SearchGameResult = {
  rawgId: number;
  name: string;
  image: string | null;
  releasedYear: number | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const externalApiUrl = new URL("https://api.rawg.io/api/games");

  externalApiUrl.searchParams.set("key", process.env.RAWG_API_KEY || "");
  externalApiUrl.searchParams.set("page_size", "5");

  if (q) {
    externalApiUrl.searchParams.set("search", q);
  }

  try {
    const response = await fetch(externalApiUrl.toString());

    if (!response.ok) {
      return Response.json(
        { error: `Błąd RAWG API: ${response.statusText}` },
        { status: response.status },
      );
    }

    const games = await response.json();

    const results: SearchGameResult[] = games.results.map((game: unknown) => ({
      rawgId: (game as { id: number }).id,
      name: (game as { name: string }).name,
      image: (game as { background_image: string | null }).background_image,
      releasedYear: game && typeof (game as { released: string | null }).released === "string"
        ? new Date((game as { released: string }).released).getFullYear()
        : null,
    }));
    return Response.json({ results });
    
  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
