Rivus is built upon two main types of data:

```
ConversationData: {
  conversationId: string
  messages: {
    role: 'user' | 'assistant',
    content: string,
  }[]
}
```

```
ConversationMetadata<OptionalMetadataObjectType>: {
  conversationId: string
  userId: string
  title: string
  createdAt: number
  updatedAt: number
  optionalData?: OptionalMetadataObjectType
}
```

The `conversationId` is meant to be a unique, but relational, identifier used to store pairs of data made up of `ConversationData` and `ConversationMetadata`. The way this was originally done was using MongoDB with two collections, one for each type of data. The frontend fetches the metadata using a userId, and then fetches individual conversation data using a conversationId from the array of fetched metadata.

ENV VARIABLES:

-   `RIVUS_API_URL`: The URL that Rivus will use in fetch calls to your backend. Add `NEXT_PUBLIC_` to the beginning of this if you are using Next.
