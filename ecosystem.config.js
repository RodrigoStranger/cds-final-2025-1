module.exports = {
  apps: [
    {
      name: 'auth',
      script: 'auth.js',
      cwd: '/home/ec2-user/cds-final-2025-1/auth',
    },
    {
      name: 'backend',
      script: 'index.js',
      cwd: '/home/ec2-user/cds-final-2025-1/backend',
    }
  ]
};