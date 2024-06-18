/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**/png',
            },
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
                port: '',
                pathname: '/b/ISBN/**',
            },
        ],
    },
};

export default nextConfig;
