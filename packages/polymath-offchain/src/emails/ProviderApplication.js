// @flow

// TODO @monitz87: check component and refactor if needed

import React from 'react';

import { EmailWrapper } from './EmailWrapper';

type Props = {|
  issuerName: string,
  issuerEmail: string,
  application: {|
    companyName: string,
    companyDesc: string,
    operatedIn: string,
    incorporatedIn: string,
    projectURL: ?string,
    profilesURL: ?string,
    structureURL: ?string,
    otherDetails: ?string,
  |},
|};

export const ProviderApplication = ({
  issuerName,
  issuerEmail,
  application,
}: Props) => {
  const dueTime = new Date();
  dueTime.setDate(dueTime.getDate() + 1);
  const {
    companyName,
    companyDesc,
    operatedIn,
    incorporatedIn,
    projectURL,
    profilesURL,
    structureURL,
    otherDetails,
  } = application;
  return (
    <EmailWrapper>
      <h1>Hi,</h1>
      <h2>
        <strong style={{ color: '#3D70B2' }}>{companyName} </strong>
        has applied to work with you.
        <br />
        Below are the details of their business:
      </h2>
      <div className="text">
        <div className="value" style={{ float: 'left', width: '275px' }}>
          <strong>Jurisdiction of Operation</strong>
          <p>{operatedIn}</p>
        </div>
        <div className="value" style={{ float: 'left' }}>
          <strong>Jurisdiction of Incorporation</strong>
          <p>{incorporatedIn}</p>
        </div>
        <div style={{ clear: 'both' }} />
        <div className="value" style={{ marginTop: '0' }}>
          <strong>Company Description</strong>
          <p>{companyDesc}</p>
        </div>
        <div className="value">
          <strong>Other Details</strong>
          <p>{otherDetails}</p>
        </div>
        {projectURL ? (
          <div className="value">
            <strong>Corporate/Project Presentation</strong>
            <p>
              <a href={projectURL}>{projectURL}</a>
            </p>
          </div>
        ) : (
          ''
        )}
        {profilesURL ? (
          <div className="value">
            <strong>Management and Board Member Profiles</strong>
            <p>
              <a href={profilesURL}>{profilesURL}</a>
            </p>
          </div>
        ) : (
          ''
        )}
        {structureURL ? (
          <div className="value">
            <strong>Corporate or Project Structure/Organization</strong>
            <p>
              <a href={structureURL}>{structureURL}</a>
            </p>
          </div>
        ) : (
          ''
        )}
        <h2 style={{ marginTop: '30px', marginBottom: '30px' }}>
          You can reach <strong>{companyName}</strong> through
          <strong> {issuerName} </strong>
          at <a href={`mailto:${issuerEmail}`}>{issuerEmail}</a>
        </h2>
      </div>
    </EmailWrapper>
  );
};
