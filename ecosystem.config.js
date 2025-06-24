module.exports = {
  apps: [
    {
      name: "auth",
      script: "auth.js",
      cwd: "./auth",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "backend",
      script: "index.js",
      cwd: "./backend",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}