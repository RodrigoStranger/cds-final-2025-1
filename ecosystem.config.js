module.exports = {
  apps: [
    {
      name: "auth",
      script: "./auth/auth.js",
      cwd: "./auth",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "backend",
      script: "./backend/index.js",
      cwd: "./backend",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}