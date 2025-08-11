/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  }
  // Supprimez complètement cette ligne obsolète :
  // experimental: { appDir: true }
}

export default nextConfig