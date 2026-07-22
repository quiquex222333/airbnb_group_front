import { Loader2, PlaneTakeoff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { apiClient } from '../features/auth/api';
import { useAuthStore, type User } from '../features/auth/store';
import BookingDetailScreen from '../pages/BookingDetailScreen';
import CreateBookingScreen from '../pages/CreateBookingScreen';
import CreateListingScreen from '../pages/CreateListingScreen';
import DashboardScreen from '../pages/DashboardScreen';
import HomeScreen from '../pages/HomeScreen';
import HostListingsScreen from '../pages/HostListingsScreen';
import ListingReviewsScreen from '../pages/ListingReviewsScreen';
import LoginScreen from '../pages/LoginScreen';
import MarketSegmentationScreen from '../pages/MarketSegmentationScreen';
import MyTripsScreen from '../pages/MyTripsScreen';
import RegisterScreen from '../pages/RegisterScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AppRouter = () => {
  const [isChecking, setIsChecking] = useState(true);
  const setCredentials = useAuthStore(state => state.setCredentials);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    const initAuth = async () => {
      try {
          const res = await apiClient.post('/auth/refresh');
          const { user, accessToken, idToken } = res.data;
          const mappedUser: User = {
            id: user.userId,
            cognitoSub: user.cognitoSub,
            email: user.email,
            name: user.fullName,
            role: user.role,
          };
          setCredentials(mappedUser, accessToken, idToken);
      } catch {
        console.log("No active session found — clearing stale credentials");
        logout();
      } finally {
        setIsChecking(false);
      }
    };
    initAuth();
  }, [setCredentials, logout]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <PlaneTakeoff className="absolute inset-0 m-auto w-5 h-5 text-primary" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Iniciando sesión...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Privadas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          }
        />

        {/* Anfitrión */}
        <Route
          path="/host/listings"
          element={
            <ProtectedRoute>
              <HostListingsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/listings/new"
          element={
            <ProtectedRoute>
              <CreateListingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/market-segmentation"
          element={
            <ProtectedRoute>
              <MarketSegmentationScreen />
            </ProtectedRoute>
          }
        />

        {/* Viajes / reservas */}
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTripsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/new"
          element={
            <ProtectedRoute>
              <CreateBookingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetailScreen />
            </ProtectedRoute>
          }
        />

        {/* Reseñas por listing */}
        <Route
          path="/listings/:listingId/reviews"
          element={
            <ProtectedRoute>
              <ListingReviewsScreen />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
