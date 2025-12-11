export const getPosterUrl = (url: string) => {
  if (!url) {
    return "https://via.placeholder.com/300x450?text=No+Image";
  }

  const CDN_DOMAIN = 'https://phimimg.com';
  const fullUrl = url.startsWith('http') ? url : `${CDN_DOMAIN}/${url}`;
  return `https://phimapi.com/image.php?url=${encodeURIComponent(fullUrl)}`;
};