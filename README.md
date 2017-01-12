# react-native-apollo-upload-network-interface

react-native-apollo-upload-interface for Apollo GraphQL Client. Adds support for `multipart/form-data` requests.

## Usage
To use this module, replace the standard apollo-client network interface with this one.

```
    import ApolloClient from 'apollo-client'
    import createNetworkInterface from 'apollo-upload-network-interface'

    const networkInterface = createNetworkInterface({
      uri: '/graphql',
    })

    const client = new ApolloClient({
      networkInterface
    })
```

then in the variables of your mutation, pass a fileName, a Base64 dataUrl, and a blobFieldName

```
   const ProfileViewWithCreateImage = graphql(createImageMutation, {
     props({ mutate }) {
       return {
         addImage(profileId, image) {
           mutate({
             variables: { myImage: dataUri, input: { profileId, blobFieldName: 'myImage' } },
           })
           .then((res) => console.log(res))
           .catch((error) => {
             console.log('error', error);
           });
         },
       };
     },
   })(ProfileViewWithData);
```

```blobFieldName``` is the field to which the blob will be saved

```dataUri``` is the dataURI we want to upload

## Notes
Currently this is designed to work with http://scaphold.io, though if you had your own graphql server it should
be reasonably straight forward to consume the data on the server using multer for express for example.

I may make a module for express-graphql-server with cloud storage options at Google Cloud Platform and AWS in the future if there is demand.

I think this should be compatible with https://github.com/HriBB/graphql-server-express-upload, but I have not tried it yet.



=======
A network interface that enables file upload to graphql inside apollo
>>>>>>> c4fb440ba54f0c32773c21755b0ddd26a436f0ea
