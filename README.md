# Schema Registry POC (GitHub + Decap CMS + REST API)

A minimal, fully GitOps-driven schema registry using GitHub, Decap CMS, and a REST API. All schemas are JSON files stored in GitHub. UI and API actions create PRs for schema changes.

## Repository Structure

```
schema-registry-poc/
├── schemas/                           # JSON schema files
│   └── example-schema.json
├── admin/                             # Decap CMS (Netlify CMS fork)
│   ├── index.html                     # CMS entry page
│   └── config.yml                     # CMS configuration
├── api/                               # REST API service
│   ├── package.json
│   └── server.js                      # Minimal REST API (Node.js)
├── docker-compose.yml                 # Docker Compose setup
└── README.md
```

## Features
- Schemas as JSON files in GitHub
- Decap CMS for visual editing (creates PRs)
- REST API for programmatic schema changes (creates PRs)
- Static frontend for schema browsing
- Dockerized for easy local deployment

## Local Setup

1. **Clone your forked repo:**
   ```sh
git clone https://github.com/yourusername/schema-registry-poc.git
cd schema-registry-poc
```

2. **Configure GitHub authentication:**
   - Create a [GitHub personal access token](https://github.com/settings/tokens?type=beta) with `repo` scope.
   - For Decap CMS, set up an OAuth app or use a token (see `admin/config.yml`).
   - For the REST API, set the token as an environment variable:
     ```sh
     export GITHUB_TOKEN=your_token_here
     ```

3. **Run with Docker Compose:**
   ```sh
docker-compose up --build
```
   - UI: [http://localhost:8080/admin/](http://localhost:8080/admin/)
   - API: [http://localhost:8081/schema](http://localhost:8081/schema)

## Decap CMS Setup
- Edit `admin/config.yml` to set your GitHub repo and branch.
- The CMS will open PRs for schema changes.

## REST API Usage
- POST `/schema` to add or update a schema (see `api/server.js`).
- The API creates a branch, commits the schema, and opens a PR.

## Example Schema JSON
```json
{
  "schema_name": "example-schema",
  "version": 1,
  "schema_type": "json-schema",
  "approved": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "schema": "{ \"type\": \"object\" }"
}
```

## GitHub Settings
- Enable PRs and branch protection on `main` for review workflows.
- For Decap CMS, configure OAuth or use a token for authentication.

## Security
- Never commit your GitHub token.
- Use environment variables for secrets.

---

For questions, see the code comments or open an issue. 