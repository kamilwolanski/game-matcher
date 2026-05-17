export function getCloudinaryImage(imageUrl: string, width: number) {
  return `https://res.cloudinary.com/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }/image/fetch/f_auto,q_auto:good,w_${width}/${encodeURIComponent(imageUrl)}`;
}
