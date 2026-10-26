/** A snapshot of the inputs and results for one completed matching request. */
export type MatchFeedbackContext = {
  match_id: string;
  game_names: string[];
  game_count: number;
  tags: string[];
  result_count: number;
  strong_result_count: number;
};
