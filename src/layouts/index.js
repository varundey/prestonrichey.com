import React from 'react';
import styled from 'styled-components';
import Link from 'gatsby-link';

import 'prismjs/themes/prism-solarizedlight.css';

import { Helmet } from 'react-helmet';

import Nav from './../components/Nav';

import baseStyles from './../utils/base-styles';

const Main = styled.main`
  max-width: 80rem;
  padding: 2rem;
  margin: 0 auto;
`;

const TitleLink = styled(Link)`
  text-transform: lowercase;
  color: #000;
  text-decoration: none;
  border: none;

  &:hover {
    color: #0000ff;
  }
`;

export default class Template extends React.Component {
  render() {
    baseStyles();

    return (
      <Main>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Rubik:700"
            rel="stylesheet"
          />
          <title>prichey.net</title>
        </Helmet>

        <h1>
          <TitleLink to="/">Preston Richey</TitleLink>
        </h1>
        <Nav />

        {this.props.children()}

        <p>
          Lorem ipsum dolor sit amet, <em>consectetur</em> adipiscing elit, sed
          do eiusmod <a href="https://google.com">tempor</a> incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis{' '}
          <strong>nostrud</strong> exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
      </Main>
    );
  }
}
