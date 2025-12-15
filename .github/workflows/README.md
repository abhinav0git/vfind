# Dependabot Security Alerts Workflow

This workflow automatically creates GitHub issues for high and critical severity Dependabot security alerts.

## Overview

The workflow monitors your repository's Dependabot security alerts and creates tracking issues for any high or critical severity vulnerabilities. This ensures that security issues are visible and can be tracked through your normal issue management process.

## Features

- **Automated Monitoring**: Runs daily at 9 AM UTC (can be adjusted)
- **Severity Filtering**: Only creates issues for HIGH and CRITICAL severity alerts
- **Duplicate Prevention**: Checks existing issues to avoid creating duplicates
- **Detailed Information**: Each issue includes:
  - Alert severity and package details
  - Vulnerable version ranges
  - Patched version recommendations
  - Links to GitHub Advisory and CVE
  - Mitigation recommendations

## Triggering the Workflow

### Automatic (Scheduled)
The workflow runs automatically every day at 9 AM UTC via the cron schedule.

### Manual Trigger
You can manually trigger the workflow from the Actions tab in your GitHub repository:
1. Go to the "Actions" tab
2. Select "Create Issues for Dependabot Security Alerts" workflow
3. Click "Run workflow"
4. Click the green "Run workflow" button

## Permissions Required

The workflow requires the following permissions:
- `contents: read` - To checkout the repository
- `issues: write` - To create issues
- `security-events: read` - To access Dependabot alerts

These permissions are automatically granted via the `GITHUB_TOKEN` when the workflow runs.

## Issue Labels

Created issues are automatically labeled with:
- `security` - Indicates this is a security-related issue
- `dependabot` - Indicates this was created from a Dependabot alert
- Severity label (`high` or `critical`) - Indicates the severity level

## Customization

### Change Schedule
Edit the cron expression in the workflow file:
```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9 AM UTC
```

### Add More Severity Levels
Modify the filter condition to include other severities:
```javascript
const criticalAlerts = alerts.filter(alert => 
  alert.security_advisory.severity === 'high' || 
  alert.security_advisory.severity === 'critical' ||
  alert.security_advisory.severity === 'medium'  // Add this line
);
```

### Customize Issue Template
Modify the `issueBody` template in the workflow file to change the format or content of created issues.

## Troubleshooting

### No Issues Are Being Created
1. Verify that Dependabot is enabled for your repository
2. Check that there are open high/critical severity alerts in the Security tab
3. Ensure the workflow has the necessary permissions
4. Check the workflow run logs in the Actions tab for error messages

### Workflow Fails with Permission Error
Make sure that GitHub Actions has the required permissions:
1. Go to Settings → Actions → General
2. Under "Workflow permissions", ensure "Read and write permissions" is selected
3. Or add explicit permissions in the workflow file (already included)

## Security Best Practices

- Review created issues promptly
- Prioritize critical severity alerts over high severity
- Update dependencies regularly to minimize security exposure
- Consider enabling Dependabot auto-updates for security patches

## Additional Resources

- [GitHub Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
