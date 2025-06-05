module.exports = {
  apps: [
    {
      name: "example-next-app",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "64M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
