import nextConnect from "next-connect";
import middleware from "../../middleware/database";
import { ObjectID } from "mongodb";

const handler = nextConnect();

handler
  .use(middleware)
  .post(async (req, res1) => {
    try {
      const { accountId, fileId } = req.body
      const account = await global.knex('accounts').where('id', accountId).first()
      const { authToken, authEmail, channelToken, userId } = account
      const authTokenJSON = JSON.parse(Buffer.from(authToken, 'base64').toString())
      const SCOPES = [
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
      ]
      const { google } = require('googleapis')
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
      )

      // Set up our credentials
      oAuth2Client.setCredentials(authTokenJSON)

      // Init the drive API using our client
      const drive = google.drive({ version: 'v3', auth: oAuth2Client })

      // https://developers.google.com/drive/api/v3/reference/files/get
      drive.files.get({
        fileId,
        fields: 'id, kind, name, mimeType, webViewLink, webContentLink, iconLink, hasThumbnail, thumbnailLink, thumbnailVersion, modifiedTime, createdTime, sharingUser',
      }, (err, res2) => {
        if (err) return console.log('The API returned an error: ' + err)

        res1.json({ file: res2.data, authEmail })
      })
    } catch (error) {
      res1.json({ error })
    }
  })

export default handler;
