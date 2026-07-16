export interface SegmentPredictionInput {
  price: number;
  reviews_per_month: number;
  calculated_host_listings_count: number;
  availability_365: number;
}

export interface SegmentPrediction {
  cluster: number;
  profile: { name: string; description: string };
  distance: number;
  modelVersion: string;
  trainedAt: string;
}
