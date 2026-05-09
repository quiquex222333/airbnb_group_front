import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Home, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/features/listings/components/ListingCard';
import { useListingsStore } from '@/features/listings/store';

export default function HostListingsScreen() {
  const navigate = useNavigate();
  const myListings = useListingsStore((s) => s.myListings);
  const removeListing = useListingsStore((s) => s.removeListing);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success('listingId copiado');
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch {
      toast.error('No se pudo copiar el ID');
    }
  };

  return (
    <DashboardLayout
      title="Mis alojamientos"
      description="Gestiona los espacios que has publicado en esta sesión."
      actions={
        <Button className="rounded-full" onClick={() => navigate('/host/listings/new')}>
          <Plus className="mr-1.5 h-4 w-4" /> Nuevo alojamiento
        </Button>
      }
    >
      {myListings.length === 0 ? (
        <EmptyState
          icon={Home}
          title="Aún no has publicado nada"
          description="Crea tu primer alojamiento y aparecerá aquí. Lo guardamos en tu navegador para no perder los IDs."
          action={
            <Button className="rounded-full" onClick={() => navigate('/host/listings/new')}>
              <Plus className="mr-1.5 h-4 w-4" /> Publicar mi primer alojamiento
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {myListings.map((listing) => (
            <div key={listing.listingId} className="flex flex-col gap-2">
              <ListingCard listing={listing} variant="full" />
              <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-muted/30 px-3 py-2">
                <button
                  type="button"
                  onClick={() => copyId(listing.listingId)}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  title="Copiar listingId"
                >
                  {copiedId === listing.listingId ? (
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 shrink-0" />
                  )}
                  <span className="truncate">{listing.listingId}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeListing(listing.listingId);
                    toast('Removido de tu lista local', {
                      description: 'No se elimina del backend, solo de tu navegador.',
                    });
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Quitar de mi lista local"
                  title="Quitar de mi lista local"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
