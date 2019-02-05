import React from 'react';

export class BuggyButton extends React.Component {
  state = {
    releaseBugs: false,
  };

  handleClick = () => {
    this.setState({
      releaseBugs: true,
    });
  };

  render() {
    if (this.state.releaseBugs) {
      throw new Error('I crashed!');
    }
    return (
      <button className="btn" onClick={this.handleClick}>
        {'Scary Button!'}
      </button>
    );
  }
}
