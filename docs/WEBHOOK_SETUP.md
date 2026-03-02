# n8n Webhook Setup for X-Ray Candidate Portal

The application form submits candidate data to an n8n webhook via a **server-side proxy** (`/api/submit`). This avoids CORS issues that occur when the browser calls n8n directly. You need a workflow with a **Webhook trigger** configured and **active** for submissions to work.

## Quick Setup (Import Workflow)

1. **Open your n8n instance** (e.g. `https://sarveshragav123.app.n8n.cloud`).

2. **Import the workflow**
   - Go to **Workflows** → **Add workflow** → **Import from File**
   - Select `docs/n8n-xobin-webhook-workflow.json` from this repo

3. **Activate the workflow**
   - Click the **Active** toggle in the top-right to turn it **ON**
   - The workflow must be **active** for the Production URL to work

4. **Copy the Production Webhook URL**
   - Open the **Application Webhook** node
   - Select **Production URL** (not Test URL)
   - Copy the full URL (e.g. `https://your-instance.app.n8n.cloud/webhook/xobin-application`)

5. **Configure the app**
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/xobin-application
     ```
   - For Vercel: add the same variable in **Project Settings → Environment Variables**

6. **Restart the dev server** if running locally:
   ```bash
   npm run dev
   ```

---

## Manual Setup (Create Workflow from Scratch)

If the import fails or you prefer to build it manually:

1. **Create a new workflow** in n8n.

2. **Add a Webhook node**

   - Drag **Webhook** from the node panel into the canvas
   - Configure:
     - **HTTP Method**: `POST`
     - **Path**: Leave empty (n8n will generate a unique path) or use `xobin-application`
     - **Respond**: `When Last Node Finishes`
     - **Response Data**: `First Entry JSON`
     - **Options** → **Raw Body**: Enable (for JSON)

3. **Add a Code node** (or Set node)

   - Connect it after the Webhook node
   - Use this code to format the response:

   ```javascript
   const input = $input.first().json;
   const body = input.body || input;
   return [{
     json: {
       received: true,
       email: body.email || '',
       message: 'Application received. AI analysis will be sent to your inbox.'
     }
   }];
   ```

4. **Activate the workflow** and copy the **Production URL**.

5. **Add to `.env.local`**:

   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=<your-production-webhook-url>
   ```

---

## Expected Payload (Frontend → n8n)

The frontend sends a `POST` request with `Content-Type: application/json` and this body:

```json
{
  "email": "candidate@example.com",
  "name": "Jane Doe",
  "college": "MIT",
  "gradYear": "2026",
  "resumeText": "Extracted PDF text...",
  "jobDescription": "Full job description object..."
}
```

Your n8n workflow receives this data. You can extend the workflow with additional nodes (e.g. Gemini AI analysis, Gmail, branching logic) using these fields.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Resource issue. Please try again later." | Webhook URL is missing or wrong. Check `.env.local` and that `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set. |
| 404 on webhook | Workflow is not **active**. Turn on the Active toggle. |
| CORS errors | Ensure your n8n instance allows requests from your app origin (Vercel URL or `localhost:3000`). |
| Empty response | Ensure the last node in the workflow outputs JSON. The frontend expects a JSON response body. |

---

## Extending the Workflow

After the webhook receives the data, you can add:

- **Gemini / OpenAI** — Analyze `resumeText` vs `jobDescription`
- **IF node** — Branch by score (Elite vs Bridge track)
- **Gmail** — Send personalized feedback to `email`
- **Google Sheets / Airtable** — Log applications

The webhook trigger is the entry point; the rest of the pipeline is up to you.
