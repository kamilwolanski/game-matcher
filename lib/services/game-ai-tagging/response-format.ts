import { TAG_SLUGS } from "@/consts/tags";

export const gameTaggingResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "game_tagging",
    strict: true,
    schema: {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: {
            type: "object",
            properties: {
              slug: {
                type: "string",
                enum: TAG_SLUGS,
              },
              strength: {
                type: "integer",
                enum: [1, 2, 3],
              },
            },
            required: ["slug", "strength"],
            additionalProperties: false,
          },
        },
      },
      required: ["tags"],
      additionalProperties: false,
    },
  },
} as const;
