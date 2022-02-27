import React from 'react'

export default function Error(props) {
  return (
    <React.Fragment>
      <style jsx>{`
        .error {
          padding-top: 50px;
          padding-bottom: 30px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-content: center;
          align-items: center;
          margin-left: auto;
          margin-right: auto;
          width: 80%;
        }

        .error .logo {
          position: relative;
          z-index: 1000;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-content: center;
          align-items: center;
        }

        .error .info a {
          color: #007af5;
          text-decoration: none;
        }

        .error .info {
          padding-left: 10px;
          position: relative;
          bottom: 2px;
          color: black;
          font-size: 22px;
          font-weight: 400;
          font-family: 'hk_groteskmedium', helvetica;
        }

      `}</style>

      <div className="error">
        <div className="info">
          Whoops, there doesn't seem to be anything here. Go back <a href="/">home</a>?
        </div>
      </div>
    </React.Fragment>
  )
}
