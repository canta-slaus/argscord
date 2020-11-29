# Argscord
argscord is a small package to help you handle command arguments.
## Installation
```
npm i argscord
```
## Usage
Simply require the package inside your message event and pass in the right parameters.
```js
const argcord = require('argscord');

//
// Somewhere inside your message event
//

const arguments = argcord(message, prefix, expectedArgs);
if (arguments.invalid) { // argcord() will return { invalid: true, prompt: argument.prompt } if the user didn't input the correct arguments
    if (arguments.prompt) message.channel.send(arguments.prompt);
    return;
};
```
Add a new property to your commands that will represent the expected arguments for that command.\
argcord will _expect_ the following layout for `expectedArgs`:
```js
[
    {
        type: String,       // This value is needed, more on that later.
        prompt: String,     // Optional - if the user input isn't correct, it will send a message
        amount: Number      // Optional - the amount of this input you are expecting
    },
    ...
]
```
## Argument types
|         Type         | User input                                  | Returned value                                                                               |
|:--------------------:|---------------------------------------------|----------------------------------------------------------------------------------------------|
|     `'SOMETHING'`    | can be anything                             | will not change                                                                              |
|      `'NUMBER'`      | has to be a number                          | will parse it into a number                                                                  |
|      `'INTEGER'`     | has to be a number                          | will parse it into an integer                                                                |
|      `'CHANNEL'`     | has to be a channel                         | will return the corresponding channel object                                                 |
|       `'ROLE'`       | has to be a role                            | will return the corresponding role object                                                    |
| `'AUTHOR_OR_MEMBER'` | can be another user                         | will return either the author or another user if provided (both will be of type GuildMember) |
|  `'ROLE_OR_MEMBER'`  | can be a role or user                       | will return either a Role object or a GuildMember                                            |
|      `'MEMBER'`      | has to be a user (can be the author itself) | will return the GuildMember of that user                                                     |
|       `'IMAGE'`      | message has to have an image appended       | will return the MessageAttachment                                                            |
## Examples
Let's say, you want the user to mention at least 2 users.\
You could add this to your command
```js
[
    {
        type: 'MEMBER',
        prompt: 'Please mention at least 2 users.'
        amount: 2
    }
]
```
And then pass in all the parameters in to the argcord function. It will then return an array containing the GuildMember object of both mentioned users (it also works with ID's, same for `CHANNEL`, `ROLE`, `AUTHOR_OR_MEMBER`, `ROLE_OR_MEMBER`). If they didn't mention at least 2 users, it will return the object `{ invalid: true, prompt: 'Please mention at least 2 users.' }`, which then can be used to cancel the command execution and send the prompt message.\
A simpler example, if you want to do an add command (a command that will take two numbers and add them together), you could add
```js
[
    {
        type: 'NUMBER',
        prompt: 'Please enter two numbers that you want to add.'
        amount: 2
    }
]
```
argcord will then convert the user input into the corresponding value, in this case it would return `[ 2, 2 ]`, so you don't have to worry anymore and can simply add those numbers together.\
The order of the argument types does matter, same for the user input.\
If the expected arguments are as followed
```js
[
    {
        type: 'NUMBER',
        prompt: 'Please enter a number.'
        // If amount isn't specified, it will use the default value of 1
    },
    {
        type: 'SOMETHING'
        prompt: 'Please enter anything.'
    }
]
```
The user input `a 1` would be invalid, however `1 a` would be valid.