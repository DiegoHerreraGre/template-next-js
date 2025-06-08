module.exports = {
  apps: [
    {
      name: "template-next-js",
      cwd: "path/to/your/project",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "64M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
