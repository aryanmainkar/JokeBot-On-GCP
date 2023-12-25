const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require('cors');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'Application')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Application', 'index.html'));
});

app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
// Firestore collection reference for chat history
const chatHistoryCollection = firestore.collection('chatHistory');


const projectId = 'iron-flash-397317';
const sessionClient = new SessionsClient({
    projectId: projectId,
    credentials: {
        client_email: 'dialogflow@iron-flash-397317.iam.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHMgwi+7BOPDWt\nhwIJe0HBLfwhS2hAX4abe2u099mhgbfW1FETwZe/sK1CrU+aBZgQ3w9MAQPJ3BeV\nINMsTZaEW9FPmP/DJipvbrh0j6FSl5pZs4jfCyPAuUa0/lySHbX0ACnMb95xJD2n\ntGZ98+hKg549Th72m2Nt+mov7onxMqPVGnOMk0y+t6arYGEpf2D2qFytxJEZLugb\nNLnujKqB2AW8begfDsklMoNcrxx4Ub8BqQ2EUVaS2ySufNMAGrhCBcssG4u7cv8V\n8Tm8Vv9+yFHp22UCWOPUG8jfYrPeRmPryQHNvewoPBBDI1jP6NsNpQvRoowuZ8qa\n9j5w1R3lAgMBAAECggEAA1TplEki8j1GpXzVXZTFase/z/znWy2Cxcfm15dEb4TN\n6ja4vatkCP2F0jLpH5/Ce4SG+b2xX5sdGnqEsCegX3r7g98AofrQDkYBMzCqlQQk\nbsNY5o+tSn0AEUuJEv4ciDcqVGzilKe4hdDLZq0kAaYg/0Zs62K1CpLyIFj04uwC\nyo4UhH3tCuqmgzcME9BNunebmqfwE09pUVVo4YcCy3dLz7lx3SI2TYPbkAvFAoFd\nsJdhwWisUe6FBx5YHVQJqi3uAIwAmEQG9oIGBrZNSjf6WpCzlxdBIyP4kCF+gN60\nhx0ArKTWeKfecDmg6f6zyxmqUaaTcF32d49ZxdMrmQKBgQD1yC0oRDPpE2zItHyP\n4NaXnmLYni8yMw1qs6xx+M5b1EneBYTYuDKa4EzPCcwvZJhm6iO8HB0F2Kfw97KY\naya9yRa79rlSnPJ04CEV6wxq0GudMCWbV3X2mUXup7NsKbGx8ubByLHxbdnlLNXR\nmvN2j06xd+Zx89OStpRO8r47AwKBgQDPeg7RT6J4oo+yvH+9EeKYxG5+wOV3lCap\nLC+gxnL1iE+N8rER47wC7ftDGHDalLI4aWf0RZyTPGSrOrD4OV5HRowQ9zAoYpZr\n8KtUsKBYRO90EZBG0tvUxvRRexNgTdzW17jxxnaTAlfja8zZUpUdOAqRoGpSveYD\n8Pby2M669wKBgBFQpeXFUEbmSG6nUHMuas/Jp7sNAdQuho5y0/4/ggI0JXQPvXkr\nGN2SWbboQMtB8f6mFhhlfqHvzn0KZjmYquUJ6qEZU5r/VZFoTMxnf7tyrXIody3H\nbpcN20Bh7iD7mvonW5xhUC/rBkO/8dxPZ0F9/RRBlymF/OzEEhSxwzcTAoGAIhYM\nfyjVKXqTnyrG1botfymueZaZXHbzjxGaVZCk7F/Tqh94JddDWTvd7t0CFXcefJQc\npw4Utj/SzirbTjyml5Eoi9UAjXH9AojMrSJDhZz1thz4lhooUaHKG+TbfxPrt0RD\ntz0C2A4ngE6CniWqJ93AJsKzFRrrwjQBbk5eUGsCgYEAlAtC6Og7PvSPs+q+Rjfv\n/1UwNIYjChNatc9Rduwz3w8Riz1Pxi2ZhVcjg6XM0sErUaM1l6Z7JvP7LzS6UMWS\nAPqVI7vdMPmfgLwno9PG1Bvfg98EDV9G20aqZnv48OocVnrO4nJLvz1SZsD05Tpc\nagr3wD4QDmYjl+uYemZ+d5U=\n-----END PRIVATE KEY-----\n",
    },
});

app.post('/api/dialogflow', async (req, res) => {
    const { userMessage } = req.body;

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, uuid.v4());

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userMessage,
                languageCode: 'en-US',
            },
        },
    };

    try {
        const response = await sessionClient.detectIntent(request);
        const botMessage = response[0].queryResult.fulfillmentText;

        // Save the chat history to Firestore
        await chatHistoryCollection.add({
            user: 'User', // Replace this with the actual user information
            message: userMessage,
            timestamp: new Date(),
        });
        await chatHistoryCollection.add({
            user: 'Bot',
            message: botMessage,
            timestamp: new Date(),
        });


        res.json({ botMessage });
    } catch (error) {
        console.error('Error sending message to Dialogflow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/chatHistory', async (req, res) => {
    try {
        const querySnapshot = await chatHistoryCollection.orderBy('timestamp').get();
        const chatHistory = [];
        querySnapshot.forEach((doc) => {
            chatHistory.push(doc.data());
        });
        res.json({ chatHistory });
    } catch (error) {
        console.error('Error retrieving chat history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

