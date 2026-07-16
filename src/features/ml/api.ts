import { apiClient } from '@/features/auth/api';
import type { SegmentPrediction, SegmentPredictionInput } from './types';

export async function predictSegment(input: SegmentPredictionInput): Promise<SegmentPrediction> {
  const { data } = await apiClient.post<{ prediction: SegmentPrediction }>('/ml/predict', input);
  return data.prediction;
}
