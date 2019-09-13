import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const StyledBlogListing = styled.ul`
  list-style: none;
`;

const StyledBlogItem = styled.li`
  font-size: 1.8rem;
  margin-bottom: 0.5em;
`;
const TalkListing = ({ talks }) => {
  const talkLinks = talks.map(talk => (
    <StyledBlogItem key={talk.node.fields.slug}>
      <Link to={talk.node.fields.slug}>
        {talk.node.frontmatter.title}
      </Link>
      {` @ ${talk.node.frontmatter.venue}`}
    </StyledBlogItem>
  ));
  return <StyledBlogListing>{talkLinks}</StyledBlogListing>;
};

export default TalkListing;
