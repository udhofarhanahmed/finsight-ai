# Security Policy

## Reporting a vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Instead, report responsibly by contacting the maintainer directly with:

- Vulnerability description
- Reproduction steps
- Impact assessment
- Suggested mitigation (optional)

## Scope

This policy covers:

- Authentication/session handling
- Data access control
- Document ingestion/storage paths
- Third-party API key handling

## Best practices in this repository

- Keep secrets in environment variables only.
- Avoid logging sensitive user document content.
- Ensure APIs validate authorization and ownership boundaries.
