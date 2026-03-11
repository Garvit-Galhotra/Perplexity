# Perplexity

Making the clone of Perplexity

# Features

1. Authentication system
2. Chat with AI
3. Maintaining the chat history
4. Message Storage
5. AI with internet research feature

# Data modelling

1. user
   - \_id
   - username
   - email
   - password
   - verified (default false)
   - createdAt
   - updatedAt

2. Chat
   - \_id
   - user.\_id
   - title
   - createdAt
   - updatedAt

3. Message
   - \_id
   - chat.\_id
   - content
   - role: [user, ai]

# Authentication system

1. user will register
2. an email is send to the user's gmail account for verification
3. user will login on our website
