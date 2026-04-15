// Service worker désactivé pour éviter les problèmes de compatibilité
// Ce fichier vide remplace le service worker par défaut
export default function register() {
  // Service worker intentionnellement désactivé
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
