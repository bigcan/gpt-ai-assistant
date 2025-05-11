import express from 'express';
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';
import { verifyEnv, printEnvVerificationResults } from '../utils/verify-env.js';

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

app.get('/', async (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ status: 'OK', currentVersion, latestVersion });
});

app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await storage.initialize();
    await handleEvents(req.body.events);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
  if (config.APP_DEBUG) printPrompts();
});

// Verify environment variables before starting the server
const envVerificationResults = verifyEnv();
printEnvVerificationResults(envVerificationResults);

// Only start the server if all required environment variables are present and valid
if (envVerificationResults.allRequiredPresent) {
  if (config.APP_PORT) {
    app.listen(config.APP_PORT, () => {
      console.log(`Server running on port ${config.APP_PORT}`);
    });
  } else {
    console.log('No APP_PORT specified, server will be available via serverless functions');
  }
} else {
  console.error('Server not started due to missing or invalid required environment variables.');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export default app;
