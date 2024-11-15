module.exports = {
  apps: [
    {
      name: "makers-chat",
      script: "npm",
      args: "run prod",
      instances: "1",
      exec_mode: "fork", // if there is only one instance, use cluster otherwise
    },
  ],
};
