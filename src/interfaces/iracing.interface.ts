/**
 * Payload from iRacing API calls which include a signed url for downloading
 * the data
 */
export interface iRacingSignedResourceResponse {
  link: string;
  expires: number;
}
