module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'server.js',
      instances: 1,
      instance_var: 'INSTANCE_ID',
      ignore_watch: ['node_modules', 'logs'],
      env_development: {
        NODE_ENV: 'development',
        NODE_CONFIG_ENV: 'development',
        watch: false,
      },
      exp_backoff_restart_delay: 100,
    },
  ],
};
