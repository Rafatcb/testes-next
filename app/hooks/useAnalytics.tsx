'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';

function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = nanoid();
    localStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
}

export const useAnalytics = () => {
  const pathname = usePathname();
  const hasFiredExitEventRef = useRef(false);
  const lastLoggedPathname = useRef<string | undefined>();
  const isUnloading = useRef(false);

  useEffect(() => {
    // FIXME Não está disparando um `page-leave` ao fechar a aba no Safari em dispositivos iOS.

    if (lastLoggedPathname.current !== pathname) {
      // Em desenvolvimento com o StrictMode, o React dispara `useEffect` duas vezes inicialmente,
      // então evitamos disparar duas visualizações da página. Essa lógica também pode ser útil em produção.
      logAnalytics('page-view', pathname);
    }
    lastLoggedPathname.current = pathname;

    function handleVisibilityChange(e: Event) {
      if (document.visibilityState === 'visible') {
        if (isUnloading.current) return;

        logAnalytics('page-return', pathname);
        hasFiredExitEventRef.current = false;
        return;
      }

      if (hasFiredExitEventRef.current) return;

      if (document.visibilityState === 'hidden' || e.type === 'pagehide') {
        logAnalytics('page-leave', pathname);
        hasFiredExitEventRef.current = true;
      }
    }

    function handleBeforeUnload() {
      // Sem isso, ao navegar para outro site ou atualizar a página, é disparado um "page-leave" seguido de um "page-return".
      isUnloading.current = true;

      // Caso a página pergunte ao usuário se ele deseja realmente sair, e ele escolhe continuar na página,
      // o timeout será executado. Essa é uma forma de voltar a escutar o evento "page-leave".
      // https://stackoverflow.com/a/54740520/8839059
      setTimeout(() => {
        isUnloading.current = false;
      }, 50);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  async function logAnalytics(type: 'page-view' | 'page-return' | 'page-leave', path: string) {
    const data = {
      request_path: path,
      session_id: getSessionId(),
      referrer: document.referrer,
      type
    };
    const stringData = JSON.stringify(data);

    if ('sendBeacon' in navigator) {
      const isQueued = navigator.sendBeacon('/api/analytics', stringData);
      if (isQueued) return;
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stringData
    });
  }

  return null;
};
