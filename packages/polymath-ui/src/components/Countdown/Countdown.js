// @flow

import React, { Component } from 'react';
import { Button, Icon } from 'carbon-components-react';

import './style.scss';

export type CountdownProps = {|
  title: string,
  deadline: Date,
  buttonTitle?: string,
  handleButtonClick?: () => any,
  small?: boolean,
  isPaused?: boolean,
  pausable?: boolean,
|};

type State = {|
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
|};

const leading0 = (num: number) => (num < 10 ? '0' + num : num);

export default class Countdown extends Component<CountdownProps, State> {
  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  componentWillMount() {
    this.updateTimeUntil(this.props.deadline);
  }

  componentDidMount() {
    setInterval(() => {
      if (!this.props.isPaused) {
        this.updateTimeUntil(this.props.deadline);
      }
    }, 1000);
  }

  getButton() {
    return this.props.buttonTitle ? (
      <Button kind="secondary" onClick={this.props.handleButtonClick}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {this.props.buttonTitle}
          &nbsp;
          {this.props.pausable ? (
            this.props.isPaused ? (
              <Icon
                name="icon--play--outline"
                fill="#252D6B"
                width="16"
                height="16"
              />
            ) : (
              <Icon
                name="icon--pause--outline"
                fill="#252D6B"
                width="16"
                height="16"
              />
            )
          ) : (
            ''
          )}
        </div>
      </Button>
    ) : (
      ''
    );
  }

  updateTimeUntil = (deadline: Date) => {
    const time = deadline - new Date();

    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes, seconds });
    }
  };

  render() {
    return (
      <div
        className={
          'pui-countdown' + (this.props.small ? ' pui-countdown-small' : '')
        }
      >
        <div
          className={
            'pui-countdown-top-bar' + (this.props.isPaused ? ' pui-paused' : '')
          }
        >
          {this.props.title}
        </div>
        <div
          className={
            'pui-countdown-content' + (this.props.isPaused ? ' pui-paused' : '')
          }
        >
          {!this.props.small ? (
            <div className="pui-countdown-days">
              <div className="pui-countdown-number-column pui-countdown-number">
                <div>
                  <div>{leading0(this.state.days)}</div>
                </div>
              </div>
              <div className="pui-countdown-number-column pui-countdown-number-text">
                <div>
                  <div>DAYS</div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="pui-countdown-time">
            <div className="pui-countdown-number-column pui-countdown-number">
              {!this.props.small ? (
                <div>
                  <div className="pui-countdown-hours">
                    {leading0(this.state.hours)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pui-countdown-hours">
                    {leading0(this.state.days)}
                  </div>
                </div>
              )}
              {!this.props.small ? (
                <div>
                  <div className="pui-countdown-minutes">
                    {leading0(this.state.minutes)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pui-countdown-minutes">
                    {leading0(this.state.hours)}
                  </div>
                </div>
              )}
              {!this.props.small ? (
                <div>
                  <div className="pui-countdown-seconds">
                    {leading0(this.state.seconds)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pui-countdown-seconds">
                    {leading0(this.state.minutes)}
                  </div>
                </div>
              )}
            </div>
            <div className="pui-countdown-number-column pui-countdown-number-text">
              {this.props.small ? (
                <div>
                  <div>DAYS</div>
                </div>
              ) : (
                ''
              )}
              <div>
                <div>HOURS</div>
              </div>
              <div>
                <div>MINUTES</div>
              </div>
              {!this.props.small ? (
                <div>
                  <div>SECONDS</div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {this.getButton()}
      </div>
    );
  }
}
