/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"www.flaticon.com"
            }
        ]
    },
    eslint:{
        ignoreDuringBuilds:true, 
    }
    
};

export default nextConfig;
