/* eslint-disable react/no-danger */
import React from 'react';

import styles from './styles';

export default ({
  issuerName,
  issuerEmail,
  providerName,
  application,
}: {
  issuerName: string,
  issuerEmail: string,
  providerName: string,
  application: {
    companyName: string,
    companyDesc: string,
    operatedIn: string,
    incorporatedIn: string,
    projectURL: ?string,
    profilesURL: ?string,
    structureURL: ?string,
    otherDetails: ?string,
  },
}) => {
  const dueTime = new Date();
  dueTime.setDate(dueTime.getDate() + 1);
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div className="wrapper">
          <div className="top-bar">
            <img
              alt="Polymath Logo"
              src="https://polymath-offchain.herokuapp.com/img/logo.png"
            />
          </div>
          <div className="content">
            <h1>Hi,</h1>
            <h2>
              <strong style={{ color: '#3D70B2' }}>
                {application.companyName}{' '}
              </strong>
              has applied to work with you.
              <br />
              Below are the details of their business:
            </h2>
            <div className="text">
              <div className="value" style={{ float: 'left', width: '275px' }}>
                <strong>Jurisdiction of Operation</strong>
                <p>{application.operatedIn}</p>
              </div>
              <div className="value" style={{ float: 'left' }}>
                <strong>Jurisdiction of Incorporation</strong>
                <p>{application.incorporatedIn}</p>
              </div>
              <div style={{ clear: 'both' }} />
              <div className="value" style={{ marginTop: '0' }}>
                <strong>Company Description</strong>
                <p>{application.companyDesc}</p>
              </div>
              <div className="value">
                <strong>Other Details</strong>
                <p>{application.otherDetails}</p>
              </div>
              {application.projectURL ? (
                <div className="value">
                  <strong>Corporate/Project Presentation</strong>
                  <p>
                    <a href={application.projectURL}>
                      {application.projectURL}
                    </a>
                  </p>
                </div>
              ) : (
                ''
              )}
              {application.profilesURL ? (
                <div className="value">
                  <strong>Management and Board Member Profiles</strong>
                  <p>
                    <a href={application.profilesURL}>
                      {application.profilesURL}
                    </a>
                  </p>
                </div>
              ) : (
                ''
              )}
              {application.structureURL ? (
                <div className="value">
                  <strong>Corporate or Project Structure/Organization</strong>
                  <p>
                    <a href={application.structureURL}>
                      {application.structureURL}
                    </a>
                  </p>
                </div>
              ) : (
                ''
              )}
              <h2 style={{ marginTop: '30px', marginBottom: '30px' }}>
                You can reach <strong>{application.companyName}</strong> through
                <strong> {issuerName} </strong>
                at <a href={'mailto:' + issuerEmail}>{issuerEmail}</a>
              </h2>
            </div>
            <div className="icon-text" style={{ height: '52px' }}>
              <div className="icon question">
                <img
                  alt="Icon"
                  src="https://polymath-offchain.herokuapp.com/img/question.png"
                />
              </div>
              <h2>
                If you have any questions, please reach out to
                <br />
                <a href="mailto:tokenstudio@polymath.zendesk.com">
                  tokenstudio@polymath.zendesk.com
                </a>
              </h2>
            </div>
            <h2 className="sincere">
              Best,
              <br />
              Polymath Support
            </h2>
          </div>
          <div className="footer">
            <div className="left">© 2018 Polymath</div>
            <div className="right">
              <a href="https://polymath.network/termsofservice.html">
                Terms of use
              </a>
              <a href="https://polymath.network/privacypolicy.html">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
