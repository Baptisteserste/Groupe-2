// Configuration de l'API URL selon l'environnement
const getApiUrl = () => {
  // En production, l'API est sur le même serveur
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  }
  // En développement, utiliser localhost
  return 'http://localhost:3001';
};

export default getApiUrl;
