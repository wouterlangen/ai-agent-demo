/**
 * Small mutable object that travels along with a single agent run.
 *
 * The save tool records the path it wrote here, so the API route can report the
 * saved file without parsing the tool's text output.
 */
export type CampaignRunContext = {
  savedBriefPath?: string;
  /** Kept so a run that is interrupted after saving can still show its result. */
  savedBriefContent?: string;
};
