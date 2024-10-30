/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"www.flaticon.com"
            },
            {
                protocol:"https",
                hostname:"cdn.pixabay.com"
            },
            {
                protocol:"https",
                hostname:"artful-zebra-573.convex.cloud"
            }

        ]
    },
    eslint:{
        ignoreDuringBuilds:true, 
    }
    
};

export default nextConfig;
