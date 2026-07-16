#!/bin/bash
# Ensure SSO is logged in
aws sso login --profile default >&2

# Export credentials and transform to Claude Code's expected format
aws configure export-credentials --profile default --format process | \
jq '{Credentials: {AccessKeyId: .AccessKeyId, SecretAccessKey: .SecretAccessKey, SessionToken: .SessionToken}}'
