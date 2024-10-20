import express from 'express';
import bodyParser from 'body-parser';
import { Livepeer } from 'livepeer';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
process.env.ENV === 'dev' && dotenv.config({ path: '.env.local' });

const onboardedUsers = [];
const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEERAI_AUTH_KEY,
});

const liveStreamResponse = (stream) => ({
    streamingUrl: `https://lvpr.tv/broadcast/${stream.streamKey}`,
    watchUrl: `https://lvpr.tv?v=${stream.playbackId}`,
    streamId: stream.id || stream.streamId,
});

app.get('/streams', async (req, res) => {
    const streams = await livepeer.stream.getAll();

    res.json(streams).status(200);
});

app.post('/start-onboarding', (req, res) => {
    onboardedUsers.push(req.body);

    if (!!onboardedUsers.find(user => user.creatorWallet)) {
        res.end('This user already exists').status(401);
    }

    res.end().status(200);
});

app.get('/end-stream', async (req, res) => {
    const { streamId } = req.body;

    await livepeer.stream.delete(streamId);

    res.end().status(200);
});

app.post('/start-stream', async (req, res) => {
    // TODO: Get creatorWallet from private key.
    const { creatorWallet } = req.body;

    const { stream } = await livepeer.stream.create({
        name: `${creatorWallet} ${uuidv4()}`,
    });

    res.send(liveStreamResponse(stream)).status(200);
});

app.listen(3000, () => {
  console.log(`BoostMe.FaceEra backend at: ${new Date().toUTCString()}`);
});
