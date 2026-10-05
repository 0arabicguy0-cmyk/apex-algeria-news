# Project Architecture Rules

- Use `BrandLogo` for visible MAX NEWS branding and the CDN asset pointers for uploaded brand media, so identity stays consistent and binaries stay outside the repository.
- Keep the existing React Router application inside the TanStack Start route shell until each route is incrementally converted; server loaders own crawler-visible article metadata.