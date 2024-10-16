/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    publicRuntimeConfig: {
        NODE_ENV:process.env.NODE_ENV,
    },
    images: {
		remotePatterns: [
			{
				hostname:"utfs.io"
			}
		]
	
	}
};

export default nextConfig;
