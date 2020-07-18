const {createFilePath}=require(`gatsby-source-filesystem`)                      //extract createFilePath from gatsby-source-filesystem
const path = require(`path`)


exports.onCreateNode=({node,getNode,actions})=>{                                //Node API to create a new node field
  const {createNodeField}=actions                                               //destruct the createNodeField from actions

  if(node.internal.type===`MarkdownRemark`){                                    //if the node type is MarkdownRemark
    const slug=createFilePath({node,getNode})                            //create the file path witch takes the node and its object

    createNodeField({                                                           //the object of the field property contains the node with a name of slug and its value is file path
      node,
      name:`slug`,
      value:slug
    })
  }
}

exports.createPages=({graphql,actions})=>{                                      //Node API to add pages.
  const {createPage}=actions

  return graphql(`                                                              
    {
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
  `)                                                                            //template literals in node js has to be between ()
    .then(result =>{                                                            //graphql is returning a promise
    result.data.allMarkdownRemark.edges.forEach(({node})=>{                     //loop over edges array to destructure each node
      createPage({                                                              //use createPage function action to create a page
        path:node.fields.slug,                                                  //takes the path as the slug which created through createNodeField action
        component:path.resolve(`./src/templates/blog-post.js`),  //blog-post is in templates. we have used path node package for relative path
        context:{                                                               //identify the slug through the context object
          slug:node.fields.slug                                                 //slug is passed as a params for doing a query
        }
      })
    })
  })
}