import { graphql } from 'gatsby';
import React from 'react';
import Layout from './../components/Layout';
import TalkListing from '../components/TalkListing';

const TalksPageInner = props => {
  try {
    const talks = props.data.allMdx ? props.data.allMdx.edges : [];
    return <TalkListing talks={talks}/>
  } catch (e) {
    return <h2>Unable to find any talks!</h2>
  }
};

const TalksPage = props => (
  <Layout>
    <TalksPageInner {...props}/>
  </Layout>
);

export default TalksPage;

export const query = graphql`
query {
  allMdx(filter: {
    frontmatter: {
      publish: {
        eq: true
      }
    },
    fields: {
      type: {
        eq: "talks"
      }
    }
  },
    sort: {
      fields:
        [frontmatter___date],
        order: DESC
    }
  ) {
    edges {
      node {
        frontmatter {
          title
          _PARENT
          layout
          author
          publish
          date
          excerpt
          lede
          link
          repo
          venue
        }
        fields {
          slug
          type
        }
      }
    }
  }
}
`;
