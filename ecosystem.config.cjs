module.exports = {
	apps: [{
	  name: "icpies",
	  script: "npx wrangler pages dev dist --port 4321",
	  env: {
		NODE_ENV: "production",
	  },
	  max_memory_restart: "300M",
	  log_date_format: "YYYY-MM-DD HH:mm Z",
	  watch: false,
	  max_restarts: 10,
	  restart_delay: 3000
	}]
  };
