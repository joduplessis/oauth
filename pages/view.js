import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import { withRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function File(props) {
  const { router: { query }} = props
  const { userId, token, resourceId, resizeId } = query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState({ name: 'default' })
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    if (!query.resourceId) return

    const { userId, token, resourceId, resizeId } = query
    const resourceIdDecoded = JSON.parse(window.atob(decodeURI(resourceId)))
    const { accountId, fileId } = resourceIdDecoded

    setError(null)
    setLoading(true)

    fetch('/api/file', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, fileId }),
    })
    .then(res => res.json())
    .then(res => {
        const { file, authEmail } = res

        setLoading(false)
        setFile(file)
        setAccountName(authEmail)
    })
    .catch(error => {
      setError('There has been an error')
      setLoading(false)
    })
  }, [query])

  return (
    <React.Fragment>
      <Head>
        <title>Google Drive</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="/static/css/styles.css" rel="stylesheet" />
      </Head>

      <style global jsx>{`
        * {
          margin: 0px;
          padding: 0px;
        }

        body {
          background: white;
          overflow: scroll;
        }

        .container {
          background: white;
          padding: 20px;
        }

        .error {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
        }
      `}</style>

      <div className="container column">
        {loading && <div>Loading...</div>}
        
        {error && (
          <div className="error">
            There has been an error
          </div>
        )}

        <div className="row">
          {file.iconLink &&
            <img src={file.iconLink.replace('16', '128')} height="50" className="mr-10"/>
          }
          <div className="column w-100">
            <div className="h4 color-d2 bold">{file.name}</div>
            <div className="h6 color-d2 bold mb-5">{accountName}</div>
            <div className="row">
              <div className="small regular color-d0 mr-10">Modified {file.modifiedTime}</div>
              <a href={file.webViewLink} target="_blank" className="small x-bold color-blue mr-10 button">Open</a>
            </div>
          </div>
        </div>

      </div>
    </React.Fragment>
  )
}

export default withRouter(File)
