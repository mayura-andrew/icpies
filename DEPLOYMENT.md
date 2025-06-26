# GitHub Actions Deployment Setup

This repository includes two GitHub Actions workflows for automatically deploying your Astro application to your production server:

## Workflows Created

1. **deploy-server.yml** - Deploys using git pull on the server
2. **deploy-server-sync.yml** - Syncs files directly from GitHub to server (recommended)

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### For Password Authentication (deploy-server.yml)
Go to your GitHub repository → Settings → Secrets and variables → Actions → Repository secrets

Add these secrets:
- `SERVER_HOST`: ``
- `SERVER_USERNAME`: ``
- `SERVER_PASSWORD`: ``

### For SSH Key Authentication (deploy-server-sync.yml) - Recommended
This is more secure than password authentication.

1. Generate an SSH key pair on your local machine:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@icpies"
   ```

2. Copy the public key to your server:
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub username@ip
   ```

3. Add these secrets to GitHub:
   - `SERVER_HOST`: ``
   - `SERVER_USERNAME`: ``
   - `SERVER_SSH_KEY`: Copy the content of your private key file (`~/.ssh/id_ed25519`)

## Server Setup Requirements

Make sure your server has the following installed:
- Node.js (version 20+)
- pnpm package manager
- PM2 process manager
- Git (if using git-based deployment)

### Install requirements on server:
```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
```

### Directory Setup
Ensure the directory `/home/administrator/apps/icpies` exists and has proper permissions:
```bash
mkdir -p /home/administrator/apps/icpies
chown administrator:administrator /home/administrator/apps/icpies
```

## How It Works

### deploy-server.yml (Git-based)
1. Builds the project on GitHub Actions
2. Connects to your server via SSH
3. Pulls latest code from git
4. Installs dependencies with pnpm
5. Builds the project
6. Restarts PM2 with ecosystem.config.cjs

### deploy-server-sync.yml (File sync - Recommended)
1. Builds the project on GitHub Actions
2. Syncs all files to your server via rsync
3. Connects to your server via SSH
4. Installs dependencies with pnpm
5. Restarts PM2 with ecosystem.config.cjs

## Triggering Deployment

The workflows will automatically run when:
- Code is pushed to the `main` branch
- Manually triggered from the GitHub Actions tab

## Monitoring

You can monitor deployments in:
- GitHub repository → Actions tab
- Server logs: `pm2 logs icpies`
- Server status: `pm2 status`

## Troubleshooting

1. **Permission denied errors**: Ensure SSH keys are properly set up and the user has write permissions to the deployment directory
2. **PM2 errors**: Check if PM2 is installed globally: `npm list -g pm2`
3. **Build errors**: Check the GitHub Actions logs for detailed error messages
4. **Port conflicts**: Ensure port 4321 (specified in ecosystem.config.cjs) is available

## Security Notes

- Use SSH key authentication instead of password authentication when possible
- Keep your GitHub secrets secure and rotate them regularly
- Consider using environment-specific secrets for different deployment environments
