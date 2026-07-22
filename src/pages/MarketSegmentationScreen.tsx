import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SegmentPredictionForm } from '@/features/ml/components/SegmentPredictionForm';

export default function MarketSegmentationScreen() {
  return (
    <DashboardLayout
      title="Segmentación de mercado"
      description="Clasifica alojamientos con el modelo K-Means entrenado sobre el mercado Airbnb de Singapur."
    >
      <SegmentPredictionForm />
    </DashboardLayout>
  );
}
