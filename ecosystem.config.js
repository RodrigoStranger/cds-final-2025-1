module.exports = {
  apps: [
    {
      name: 'auth',
      script: 'auth.js',
      cwd: '/home/ec2-user/cds-final-2025-1/auth',
      env: {
        NODE_ENV: "production"
     }
    },
    {
      name: 'backend',
      script: 'index.js',
      cwd: '/home/ec2-user/cds-final-2025-1/backend',
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};