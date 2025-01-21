/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
