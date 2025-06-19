/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cryptologos.cc'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aunmaxuqepeikkapclqh.supabase.co",
        port: "",
        pathname: "//storage/v1/object/public/companyLogo/**",
      },
      {
        protocol: "https",
        hostname: "aunmaxuqepeikkapclqh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/companyLogo/**",
      },
    ],
  },
};

export default nextConfig;
