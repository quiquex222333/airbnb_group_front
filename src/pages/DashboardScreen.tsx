import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import { useBookingsStore } from "@/features/bookings/store";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { useListingsStore } from "@/features/listings/store";
import { useEnsureInternalUser } from "@/features/users/useEnsureInternalUser";
import {
  ArrowUpRight,
  CalendarPlus,
  HomeIcon,
  PlaneIcon,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const myListings = useListingsStore((s) => s.myListings);
  const myBookings = useBookingsStore((s) => s.myBookings);

  useEnsureInternalUser();

  if (!user) return null;

  const recentListings = myListings.slice(0, 3);
  const recentBookings = myBookings.slice(0, 3);

  return (
    <DashboardLayout
      title={`Hola, ${user.name?.split(" ")[0] ?? "viajero"}`}
      description="Resumen rápido de tu actividad como anfitrión y como huésped."
      actions={
        <>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => navigate("/trips/new")}
          >
            <CalendarPlus className="mr-1.5 h-4 w-4" /> Nueva reserva
          </Button>
          <Button className="rounded-full" onClick={() => navigate("/host/listings/new")}>
            <PlusCircle className="mr-1.5 h-4 w-4" /> Publicar alojamiento
          </Button>
        </>
      }
    >
      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Bienvenido</p>
          </div>
          <h2 className="mt-3 text-2xl font-bold break-words">{user.name}</h2>
          <p className="text-sm text-muted-foreground break-all">{user.email}</p>
          {user.role && (
            <span className="mt-3 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold capitalize">
              {user.role}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/host/listings")}
          className="group flex flex-col items-start rounded-3xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex w-full items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <HomeIcon className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mis alojamientos
          </p>
          <p className="text-3xl font-bold">{myListings.length}</p>
          <p className="text-xs text-muted-foreground">publicados en esta sesión</p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/trips")}
          className="group flex flex-col items-start rounded-3xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex w-full items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <PlaneIcon className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mis viajes
          </p>
          <p className="text-3xl font-bold">{myBookings.length}</p>
          <p className="text-xs text-muted-foreground">reservas locales</p>
        </button>
      </section>

      {/* Recent listings */}
      <section className="space-y-4">
        <header className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Tus últimos alojamientos</h3>
            <p className="text-sm text-muted-foreground">
              Espacios que has publicado recientemente.
            </p>
          </div>
          {myListings.length > 3 && (
            <Button
              variant="link"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/host/listings")}
            >
              Ver todos
            </Button>
          )}
        </header>
        {recentListings.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-dashed border-border bg-muted/20 p-6">
            <p className="text-sm text-muted-foreground">
              Todavía no has publicado ningún alojamiento en esta sesión.
            </p>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => navigate("/host/listings/new")}
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> Publicar uno
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentListings.map((listing) => (
              <ListingCard key={listing.listingId} listing={listing} variant="full" />
            ))}
          </div>
        )}
      </section>

      {/* Recent trips */}
      <section className="space-y-4">
        <header className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Tus últimos viajes</h3>
            <p className="text-sm text-muted-foreground">
              Reservas creadas o consultadas recientemente.
            </p>
          </div>
          {myBookings.length > 3 && (
            <Button
              variant="link"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/trips")}
            >
              Ver todos
            </Button>
          )}
        </header>
        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-dashed border-border bg-muted/20 p-6">
            <p className="text-sm text-muted-foreground">
              Aún no tienes reservas. Crea una desde un alojamiento existente.
            </p>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => navigate("/trips/new")}
            >
              <CalendarPlus className="mr-1.5 h-4 w-4" /> Crear reserva
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentBookings.map((b) => (
              <BookingCard key={b.bookingId} booking={b} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
