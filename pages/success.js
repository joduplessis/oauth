import Head from 'next/head'
import { withRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function Success(props) {
  const { router: { query }} = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const { scope, code } = props.query

  useEffect(() => {
    // If it is opened in a popup
    // This can call the parent window to tell the 
    // caller that it was successfully connected
    window.top.postMessage({ scope, code }, "*")
    window.opener.postMessage({ scope, code }, "*")
  }, [])

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
        }
      `}</style>

      <p>Redirecting...</p>
    </React.Fragment>
  )
}

Success.getInitialProps = async ({ query }) => {
  try {
    return { query }
  } catch (e) {
    return { error: e }
  }
}

export default withRouter(Success)
