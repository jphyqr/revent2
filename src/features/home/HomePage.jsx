import React from 'react';

const HomePage = ({history}) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            <img
              className="ui image massive"
              src="/assets/white on orange logo.png"
              alt="logo"
            />
            <div className="content">Yaybour</div>
          </h1>
          <h2>
            Save Time and Money on any project.
          </h2>
          <div onClick={() => history.push('/build')} className="ui huge white inverted button">
            Get Started
            <i className="right arrow icon" />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        Proudly built in Regina, Saskatchewan.
      </div>
    </div>
  );
};

export default HomePage;
