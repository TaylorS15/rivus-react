# Rivus React

Rivus React is an easy-to-implement library for adding AI chat messaging to any React application.

## Features

- Seamless integration with your React frontend
- Support for OpenAI text completions and Claude messages
- Streaming and non-streaming response options
- Minimal styling for easy customization
- TypeScript support

## Installation

```bash
npm install rivus-react
```

## Quick Start

1. Import the necessary components and styles:

```jsx
import {
  RivusProvider,
  PastConversations,
  Conversation,
  UserInput,
  InputField,
  SubmitButton,
} from 'rivus-react';
import 'rivus-react/dist/styles.css';

function AiChat() {
  return (
    <RivusProvider
      options={{
        loadingComponent: <p className="text-white">Loading...</p>,
        errorComponent: <p className="text-white">Error...</p>,
        endpoints: {
          deleteConversation: 'delete-conversation',
          getConversationData: 'conversation-data',
          getPastConversations: 'past-conversations',
          postQuestion: 'question',
        },
        chatErrorMessage: 'There was an error! Please try again.',
        apiUrl: process.env.BACKEND_API_URL ?? '',
        streamResponses: true,
      }}>
      <div className="flex">
        <PastConversations
          className={{
            container:
              'w-56 h-96 gap-4 flex flex-col overflow-scroll border-gray-600 p-4 border-2 border-r-0 rounded-sm',
            pastConversationButton:
              'h-10 w-full rounded-sm bg-slate-600 hover:bg-slate-500',
          }}
          iconColor="white"
        />
        <Conversation
          className={{
            container:
              'flex flex-col gap-10 h-96 overflow-scroll border-gray-600 p-4 w-[36rem] border-2 rounded-sm',
            userMessage:
              'text-white border-2 border-blue-600 p-4 rounded-sm shadow-xl shadow-blue-600/20',
            assistantMessage:
              'text-white border-2 border-lime-600 p-4 rounded-sm shadow-xl shadow-lime-600/20',
            noSelectedConversationText: 'text-purple-500',
          }}
        />
      </div>

      <UserInput className="flex gap-4 justify-between mt-4">
        <InputField placeholder="Example" className="rounded-md h-10 grow p-1" />
        <SubmitButton
          text="Submit"
          className="bg-white hover:bg-slate-100 rounded-md w-24 h-10"
        />
      </UserInput>
    </RivusProvider>
  );
}
```

## Styling

Rivus is minimally styled to allow for easy customization. Import the base styles and override/add to them using the `className` prop on each component. Rivus components with built in children (eg. Conversation and PastConversations) can be wholey styled by passing an object to the className attribute and using the preset fields to style the children accordingly.

## API Responses

Rivus expects specific response types from the set endpoints:

- `deleteConversation`: Status codes 200-299 are considered successful
- `postQuestion`: Streamed responses must be chunks of data structured as `data: TEXT_DELTA` where TEXT_DELTA is whatever current token(s) are being sent as an SSE (ReadableStream). Rivus ends the stream when `data: [DONE]` is found. Non-streamed responses read the entire response as text using `response.text()`.
- `getConversationData`: JSON response of type `ConversationData`
- `getPastConversations`: JSON response of type `ConversationMetadata[]`

## Data Types

Rivus uses two main data types:

```typescript
interface ConversationData {
  conversationId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

interface ConversationMetadata<T> {
  conversationId: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  metadata?: T;
}
```

As long as you have a backend that can serve these two types of data, and send streamed/non-streamed responses from LLM services, Rivus will work seamlessly with your application.

## Backend Integration

Rivus is designed to work with a backend that has access to stores of conversation data. The `conversationId` is used as a unique identifier to link `ConversationData` and `ConversationMetadata`.

A typical setup involves:

1. Fetching all user conversations' metadata using a `userId`
2. Fetching individual conversation data using the `conversationId` from the metadata array

If you would like to authenticate requests on your backend you can specify `authenticationToken` in RivusProvider's options and it will be added to each request in the `Authorization` header like this:

```typescript
'Authorization': `Bearer ${token}`
```

## Contributing

[TODO]

## License

MIT License

## Support

[TODO]
