import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from './../components/Layout';
import TextPostBody from './../components/TextPostBody';
import ProjectLinks from './../components/ProjectLinks';

const ProjectTemplate = ({ data }) => {
  const { frontmatter, body } = data.mdx;

  return (
    <Layout>
      {frontmatter.title && (
        <Helmet>
          <title>Varun Dey | {frontmatter.title}</title>
        </Helmet>
      )}
      <h1>{frontmatter.title}</h1>
      <ProjectLinks
        link={frontmatter.link}
        repo={frontmatter.repo}
        date={frontmatter.date}
        lang={frontmatter.lang}
      />
      <TextPostBody>
        <MDXRenderer>{body}</MDXRenderer>
      </TextPostBody>
    </Layout>
  );
};

export default ProjectTemplate;

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
        link
        repo
        date
        lang
      }
    }
  }
`;
