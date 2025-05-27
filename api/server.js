import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. "yourusername/schema-registry-poc"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  throw new Error('GITHUB_TOKEN and GITHUB_REPO must be set as environment variables.');
}

const [owner, repo] = GITHUB_REPO.split('/');
const octokit = new Octokit({ auth: GITHUB_TOKEN });

function getSchemaFilename(schema_name) {
  return `schemas/${schema_name}.json`;
}

app.post('/schema', async (req, res) => {
  const schema = req.body;
  if (!schema.schema_name) {
    return res.status(400).json({ error: 'schema_name is required' });
  }
  const filename = getSchemaFilename(schema.schema_name);
  const branchName = `schema-edit/${schema.schema_name}-${Date.now()}`;

  try {
    // 1. Get latest commit SHA of main
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${GITHUB_BRANCH}`
    });
    const baseSha = refData.object.sha;

    // 2. Create new branch
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    });

    // 3. Prepare file content (stringify with 2-space indent)
    const content = Buffer.from(JSON.stringify(schema, null, 2)).toString('base64');

    // 4. Check if file exists in main
    let fileSha = undefined;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: filename,
        ref: GITHUB_BRANCH
      });
      fileSha = fileData.sha;
    } catch (e) {
      // File does not exist, will create new
    }

    // 5. Create or update file in new branch
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filename,
      message: `Add/update schema: ${schema.schema_name}`,
      content,
      branch: branchName,
      sha: fileSha
    });

    // 6. Create PR
    const pr = await octokit.pulls.create({
      owner,
      repo,
      title: `Add/update schema: ${schema.schema_name}`,
      head: branchName,
      base: GITHUB_BRANCH,
      body: 'Automated PR from REST API.'
    });

    res.json({ pr_url: pr.data.html_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Schema Registry API listening on port 3000');
}); 