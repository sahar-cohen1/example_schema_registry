# Schema Registry

A web-based schema registry for managing and versioning schema definitions. Built with Netlify CMS for Git-based content management.

## Features

- Simple web interface for browsing schemas
- Admin dashboard for managing schemas
- Version control for all schemas
- Approval workflow for schema changes
- Responsive design

## Deployment Instructions

### Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Netlify account (sign up at [netlify.com](https://www.netlify.com/))

### Deploy to Netlify

1. Push this repository to your Git provider (GitHub, GitLab, or Bitbucket)

2. Log in to your Netlify account

3. Click "Add new site" > "Import an existing project"

4. Connect to your Git provider and select this repository

5. Configure the build settings:
   - Build command: Leave empty or use `echo 'No build command required'`
   - Publish directory: `.`

6. Click "Deploy site"

### Set Up Netlify Identity and Git Gateway

1. After deployment, go to "Site settings" > "Identity"

2. Click "Enable Identity"

3. Under Identity settings:
   - Set registration preferences (Open or Invite only)
   - Enable Git Gateway

4. Configure external providers if needed

5. Invite users by going to "Identity" > "Invite users"

### Access Your Schema Registry

- Your site will be available at a Netlify subdomain: `https://your-site-name.netlify.app`
- The admin dashboard is available at: `https://your-site-name.netlify.app/admin/`
- You can set up a custom domain in the Netlify settings

## Local Development

1. Clone the repository
2. Open the project in your preferred editor
3. Serve the site using any local web server
4. Access the site at `http://localhost:8888` (or your configured port)

## Adding New Schemas

1. Log in to the admin dashboard at `/admin/`
2. Click "New Schema" button
3. Fill in the schema details:
   - Schema Name
   - Version
   - Schema Type
   - Schema Definition (JSON)
   - Approval status
4. Save the schema to publish it

## Schema Structure

Each schema contains the following fields:

- Schema Name: Unique identifier for the schema
- Version: Version number (integer)
- Schema Type: Type of schema (e.g., JSON Schema, Avro, Protobuf)
- Schema Definition: The actual schema definition in JSON format
- Approved: Whether the schema is approved for use
- Created At: Timestamp of schema creation
- Updated At: Timestamp of last schema update
