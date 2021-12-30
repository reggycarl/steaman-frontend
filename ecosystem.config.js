module.exports = {
  apps: [
    {
      name: "frontend",
      // script: "yarn start",
      script: "./node_modules/.bin/next",
      args: "start -p 3000",
      watch: true,
      // interpreter: "/usr/bin/yarn", //absolute path to yarn ; default is node
      interpreter_args: "",
      instances: 6,
      exec_mode: "cluster",
      cwd: "", //the directory from which your app will be launched
      combine_logs: true,
      env_development: {
        PORT: 3000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: "production",
      },
    },
  ],
};
