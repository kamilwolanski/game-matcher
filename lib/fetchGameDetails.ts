export async function fetchGameDetails(rawgId: number) {
  const externalApiUrl = new URL(`https://api.rawg.io/api/games/${rawgId}`);
  externalApiUrl.searchParams.set("key", process.env.RAWG_API_KEY || "");

  try {
    const response = await fetch(externalApiUrl.toString());
    if (!response.ok) {
      throw new Error(`Błąd RAWG API: ${response.statusText}`);
    }

    const game = await response.json();

    return game;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Internal Server Error");
  }
}
