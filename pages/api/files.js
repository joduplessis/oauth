import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect();

handler
  .use(middleware)
  .post(async (req, res1) => {
    try {
      const { authToken, channelToken, userId, authEmail, pageToken, pageSize, filter, parent } = req.body
      const authTokenJSON = JSON.parse(Buffer.from(authToken, 'base64').toString())
      const q = filter != '' ? `name contains '${filter}'` : `('${parent}' in parents)`
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

      // 'https://www.googleapis.com/auth/drive.readonly',
      // 'https://www.googleapis.com/auth/drive.file',
      // https://developers.google.com/drive/api/v3/reference/files#resource
      // https://developers.google.com/drive/api/v3/search-files
      // https://developers.google.com/drive/api/v3/reference/files/list
      drive.files.list({
        q,
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(id, kind, name, mimeType, webViewLink, webContentLink, iconLink, hasThumbnail, thumbnailLink, thumbnailVersion, modifiedTime, createdTime)',
      }, (err, res2) => {
        if (err) return console.log('The API returned an error: ' + err)

        // List of files / next page
        const { files, nextPageToken } = res2.data

        res1.json({ files, nextPageToken })
      })
    } catch (error) {
      res1.json({ error })
    }
  })

export default handler;
