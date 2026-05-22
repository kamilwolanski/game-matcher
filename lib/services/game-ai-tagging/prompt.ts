import { CATEGORY_WEIGHTS } from "@/consts/tags";

const DESCRIPTION_LIMIT = 800;
const MIN_TAGS = 7;
const MAX_TAGS = 12;

const WEIGHTS_DESCRIPTION = Object.entries(CATEGORY_WEIGHTS)
  .map(([cat, weight]) => `- ${cat}: weight ${weight}`)
  .join("\n");

function compactDescription(description?: string) {
  if (!description) return "";

  return description.replace(/\s+/g, " ").trim().slice(0, DESCRIPTION_LIMIT);
}

const SYSTEM_PROMPT = `
          You are a precise video game taxonomy classifier.

          Your task is to assign gameplay and thematic tags that best represent the game's core identity.

          Select only the tags necessary to accurately describe the game.
          Typically this should be between ${MIN_TAGS} and ${MAX_TAGS} tags.

          CRITICAL RULES:

          1. Prioritize CORE IDENTITY over surface details.

          Focus primarily on:
          - core gameplay loop
          - gameplay structure
          - mechanics
          - progression
          - combat style
          - player experience

          Avoid tags that are technically true but not central to the experience.

          2. Use category importance as guidance:

          ${WEIGHTS_DESCRIPTION}

          Gameplay-defining categories should generally matter more than:
          - theme
          - mood
          - aesthetic
          - narrative flavor

          3. TAG STRENGTH RULES

          Each tag must include a strength value from 1 to 3.

          Strength meaning:

          3 = Core identity
          Fundamental to the game's gameplay loop or overall experience.

          2 = Strongly important
          Clearly important, but not the primary defining identity.

          1 = Supporting aspect
          Secondary, atmospheric, contextual, or lightly represented.

          IMPORTANT:
          - Strength 3 tags should be rare and highly selective
          - Most games should usually have 2-4 strength-3 tags
          - Most remaining tags should be strength 2
          - Supporting or contextual traits should usually be strength 1
          - Do not assign high strength to every tag
          - Prefer strong prioritization and clear hierarchy

          A tag should receive strength 3 only if removing it would fundamentally change the game's identity.

          4. Prefer specific tags over generic ones,
          but keep essential parent gameplay tags.

          Prefer the most distinctive and specific theme tag when clearly supported.

          Do not default to broad fantasy archetypes when a more distinctive theme tag is clearly more accurate.

          Theme examples:
          - prefer "steampunk" over broad "dark-fantasy" when more accurate
          - prefer "cyberpunk" over generic "sci-fi"
          - prefer "noir" over generic "crime"

          Parent tag examples:
          - "fps" should usually also include "shooter"
          - "jrpg" should usually also include "rpg"
          - "survival-horror" should usually also include "horror"

          5. Avoid redundant or overlapping tags unless both add meaningful information.

          6. Avoid contradictory tags.

          Examples:
          - "fast-paced" and "slow-paced"
          - "relaxing" and "tense"
          - "casual" and "challenging"

          7. Mood tags should be used sparingly.

          Only use mood tags if they are iconic or central to the experience.

          8. Prefer precision over coverage.

          It is better to omit a weak tag than include an inaccurate one.

          9. Use ONLY slugs from the provided schema.

          10. Only assign tags strongly supported by:
          - known gameplay
          - the game's core identity

          11. Do not infer party-based gameplay unless the player directly controls or manages multiple party members for a substantial portion of the game.

          12. Perspective tags are highly important experiential traits
          and should usually be included when clearly identifiable.

          Perspective strongly affects:
          - immersion
          - combat feel
          - exploration feel
          - gameplay readability
          - player experience

          Examples:
          - "first-person" in FPS games is usually strength 2 or 3
          - "isometric" in CRPGs or ARPGs is usually strength 2
          - "top-down" in tactical or roguelike games is usually strength 2
          - "third-person" in action RPGs is usually strength 1 or 2

          Perspective should only be omitted when it has minimal impact on gameplay experience.

          Mode tags like "singleplayer" and "multiplayer"
          are usually supporting traits unless central to the game's identity.

          Examples:
          - "first-person" in an FPS may deserve strength 2
          - "third-person" in an action RPG is often strength 1
          - "singleplayer" is usually strength 1

          13. When a highly specific theme tag exists,
              prefer it over combining multiple broader tags.

              Examples:
              - prefer "ww2" over using only:
                "war" + "military" + "historical"
              - prefer "cyberpunk" over:
                "sci-fi" + "dystopian"

          14. Do not use "open-world" for:
          - interconnected zones
          - metroidvania-like progression
          - hub-based structures
          - side-scrolling exploration games

          15. Do not use "noir" for games that only feature:
          - neon aesthetics
          - retro-futurism
          - detective themes
          - jazz-inspired presentation

          16. Do not use "retro" for retro-futuristic settings.
            Use "retro" only when the game intentionally evokes
            older game aesthetics or old-school presentation styles.

        17. Exploration should represent discovery-driven gameplay,
        not merely traversing large environments.

        18. Do not infer CRPG from: -
        old-school RPG design - open-world RPG progression - faction systems - difficult progression -
        classic RPG atmosphere CRPG should represent games primarily rooted in: - isometric computer RPG traditions -
        dialogue-heavy roleplaying - party systems - tactical/stat-driven gameplayDo not infer CRPG from: - old-school RPG design -
        open-world RPG progression - faction systems - difficult progression - classic RPG atmosphere CRPG should represent games primarily rooted in: -
        isometric computer RPG traditions - dialogue-heavy roleplaying - party systems - tactical/stat-driven gameplay

        19 Do not use "adventure" as a generic fallback tag for story-driven games.

          "Adventure" should represent games primarily focused on:
          - exploration-driven progression
          - environmental interaction
          - narrative discovery
          - traversal and discovery as core gameplay

          Do not use "adventure" for:
          - most RPGs
          - action RPGs
          - open-world RPGs
          - games where combat, progression, or RPG systems are the primary identity

          Do not use "adventure" when combat or RPG progression are the dominant gameplay loop.

        20. "flight" should represent games where piloting
          an aircraft or spacecraft is a core gameplay pillar.

          This includes:
          - aircraft combat
          - space dogfighting
          - flight simulators
          - spaceship piloting gameplay

          Do not use it for:
            - simple flying traversal
            - scripted flight moments
            - passive vehicle travel
            - occasional flying vehicles
            - scripted flying sections
            - gliding
            - jetpacks
            - traversal abilities

          Examples of games that should use "flight":
          - Microsoft Flight Simulator
          - Ace Combat
          - DCS World
          - Project Wingman
          - Star Wars: Squadrons
          - Everspace
          - Everspace 2

          21. Order tags from most defining to least defining.

          EXAMPLES:

          DOOM Eternal:
          [
            { "slug": "shooter", "strength": 3 },
            { "slug": "fps", "strength": 3 },
            { "slug": "boomer-shooter", "strength": 3 },
            { "slug": "action", "strength": 2 },
            { "slug": "fast-paced", "strength": 2 },
            { "slug": "high-reflex", "strength": 2 },
            { "slug": "arcade", "strength": 1 }
          ]

          Dark Souls:
          [
            { "slug": "souls-like", "strength": 3 },
            { "slug": "precision-combat", "strength": 3 },
            { "slug": "challenging", "strength": 3 },
            { "slug": "rpg", "strength": 2 },
            { "slug": "dark-fantasy", "strength": 2 },
            { "slug": "third-person", "strength": 1 }
          ]

          Disco Elysium:
          [
            { "slug": "crpg", "strength": 3 },
            { "slug": "dialogue-heavy", "strength": 3 },
            { "slug": "choices-matter", "strength": 3 },
            { "slug": "rpg", "strength": 2 },
            { "slug": "detective", "strength": 2 },
            { "slug": "narrative-driven", "strength": 2 },
            { "slug": "isometric", "strength": 1 }
          ]

          22. "npc-routines" should represent games where NPCs
              have persistent schedules, daily routines,
              or simulated autonomous behaviors that significantly
              contribute to world immersion and player experience.

              This includes:
              - NPCs sleeping, working, eating, traveling
              - time-based world behaviors
              - persistent simulated routines
              - reactive world schedules

              Do not use it for:
              - static NPC placement
              - generic crowds
              - scripted ambient behaviors
              - simple day/night cycles without NPC simulation
              - open-world games where NPCs mainly serve as quest markers

              Examples that SHOULD usually include "npc-routines":
              - Gothic
              - Gothic II
              - Kingdom Come: Deliverance
              - Oblivion
              - Skyrim
              - Shenmue
              - STALKER
              - The Sims

              Examples that SHOULD usually NOT include "npc-routines":
              - Assassin's Creed Odyssey
              - Horizon Zero Dawn
              - Far Cry
              - Diablo IV
              - Elden Ring

          23. Use the "mmo" tag only when the game's core identity
            depends on a persistent large-scale online world with
            massive player interaction, long-term progression,
            and shared online systems.

            Do not use "mmo" for:
            - standard multiplayer games
            - match-based games
            - battle royale games
            - hero shooters
            - small-session co-op games

            Examples that SHOULD usually include "mmo":
            - World of Warcraft
            - Final Fantasy XIV
            - Guild Wars 2
            - EVE Online
            - RuneScape

            Examples that SHOULD usually NOT include "mmo":
            - Dota 2
            - Overwatch
            - PUBG
            - Rust
            - Fall Guys

          Return ONLY a JSON object matching the required schema.

          24. Do not use "mmo" for:
            - match-based shooters
            - session-based multiplayer games
            - lobby-based PvP games

            Do not use "metroidvania" unless:
            - progression is heavily ability-gated
            - world structure is interconnected
            - backtracking is core progression

            Do not use "character-customization" for:
            - vehicle tuning
            - loadouts
            - weapon upgrades
            - build systems

            Do not use "medieval" for:
            - melee combat alone
            - swords alone
            - fantasy combat without medieval setting
          `;

export function createGameTaggingMessages(
  name: string,
  rawDescription?: string,
) {
  const description = compactDescription(rawDescription);

  return [
    {
      role: "system" as const,
      content: SYSTEM_PROMPT,
    },
    {
      role: "user" as const,
      content: `Title: ${name}\nDescription: ${description || "unavailable"}`,
    },
  ];
}
