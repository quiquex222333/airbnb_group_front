import { useState, type FormEvent } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { predictSegment } from '../api';
import type { SegmentPrediction, SegmentPredictionInput } from '../types';

const fields = [
  { key: 'price', label: 'Precio por noche (USD)', min: 0, max: undefined, step: 1 },
  { key: 'reviews_per_month', label: 'Reseñas por mes', min: 0, max: undefined, step: 0.1 },
  { key: 'calculated_host_listings_count', label: 'Alojamientos del anfitrión', min: 1, max: undefined, step: 1 },
  { key: 'availability_365', label: 'Días disponibles al año', min: 0, max: 365, step: 1 },
] as const;

const initialValues: SegmentPredictionInput = {
  price: 120,
  reviews_per_month: 2,
  calculated_host_listings_count: 1,
  availability_365: 200,
};

export function SegmentPredictionForm() {
  const [values, setValues] = useState(initialValues);
  const [prediction, setPrediction] = useState<SegmentPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setPrediction(await predictSegment(values));
    } catch (cause) {
      const message = (cause as { response?: { data?: { error?: { message?: string } } } })
        .response?.data?.error?.message;
      setError(message ?? 'No se pudo ejecutar la predicción.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={submit} className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <h3 className="font-bold">Variables del alojamiento</h3>
            <p className="text-sm text-muted-foreground">Completa las métricas usadas durante el entrenamiento.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type="number"
                required
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.key]}
                onChange={(event) => setValues({ ...values, [field.key]: Number(event.target.value) })}
                className="h-12 rounded-xl"
              />
            </div>
          ))}
        </div>
        {error && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-6 h-12 rounded-full px-7">
          {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Analizando...</> : <><Sparkles className="mr-2 size-4" /> Predecir segmento</>}
        </Button>
      </form>

      <section className="flex min-h-72 flex-col justify-center rounded-3xl border bg-card p-6 shadow-sm md:p-8">
        {prediction ? (
          <>
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Cluster {prediction.cluster}</span>
            <h3 className="mt-4 text-2xl font-bold">{prediction.profile.name}</h3>
            <p className="mt-2 text-muted-foreground">{prediction.profile.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-muted p-4"><p className="text-muted-foreground">Distancia</p><p className="mt-1 font-bold">{prediction.distance}</p></div>
              <div className="rounded-2xl bg-muted p-4"><p className="text-muted-foreground">Modelo</p><p className="mt-1 font-bold">v{prediction.modelVersion}</p></div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground"><BrainCircuit className="mx-auto mb-4 size-12 opacity-40" /><p>El resultado de la segmentación aparecerá aquí.</p></div>
        )}
      </section>
    </div>
  );
}
