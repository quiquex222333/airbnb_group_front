import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { CreateListingForm } from '@/features/listings/components/CreateListingForm';

const TIPS = [
  {
    icon: Home,
    title: 'Empieza con lo esencial',
    description: 'Solo necesitas un título y un precio para empezar a recibir reservas.',
  },
  {
    icon: Wallet,
    title: 'Tú decides el precio',
    description: 'Puedes ajustar la tarifa por noche cuando quieras desde tu panel.',
  },
  {
    icon: ShieldCheck,
    title: 'Publicación segura',
    description: 'Tu publicación se asocia a tu cuenta autenticada con un tokenJWT.',
  },
];

export default function CreateListingScreen() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      title="Publica tu alojamiento"
      description="Comparte tu espacio con viajeros de todo el mundo. Empieza con los detalles básicos."
      actions={
        <Button variant="outline" className="rounded-full" onClick={() => navigate('/host/listings')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Mis alojamientos
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CreateListingForm
            onSuccess={(listing) => {
              toast.success('¡Alojamiento publicado!', {
                description: listing.title,
              });
              navigate('/host/listings');
            }}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Consejos rápidos</h3>
            </div>
            <ul className="mt-4 space-y-4">
              {TIPS.map((tip) => (
                <li key={tip.title} className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted">
                    <tip.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tip.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
