import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { createInternalUser } from './api';

const STORAGE_KEY = 'airbnb-internal-user-synced';

/**
 * Llama POST /users una sola vez por sesión y por usuario.
 * Se ignora silenciosamente si ya existe (409) o si falla por otra razón:
 * el usuario sigue navegando, sólo no se crea el registro interno.
 */
export function useEnsureInternalUser() {
  const user = useAuthStore((s) => s.user);
  const ranRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const userKey = user.id ?? user.email ?? 'anon';
    if (ranRef.current === userKey) return;

    const sessionKey = `${STORAGE_KEY}:${userKey}`;
    try {
      if (sessionStorage.getItem(sessionKey) === '1') {
        ranRef.current = userKey;
        return;
      }
    } catch {
      // sessionStorage no disponible — seguimos
    }

    ranRef.current = userKey;

    createInternalUser({ fullName: user.name ?? user.email ?? 'Usuario' })
      .then(() => {
        try {
          sessionStorage.setItem(sessionKey, '1');
        } catch {
          // ignorar
        }
      })
      .catch((err) => {
        console.warn('[useEnsureInternalUser] no se pudo sincronizar usuario interno', err);
      });
  }, [user]);
}
