import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // image uploads go through a server action (ImgBB key stays on the server)
    serverActions: { bodySizeLimit: "5mb" },
  },
}

export default nextConfig