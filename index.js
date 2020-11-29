/**
 * Function to check if the user has passed in the proper arguments when using a command
 * @param {} message - The message to check the arguments for
 * @param {String} prefix - The prefix to use
 * @param {Object[]} expectedArgs - The expected arguments for the command
 * @return {array|undefined} Returns the arguments array if all the arguments were as expected, else, returns `undefined`
 */
function processArguments(message, prefix, expectedArgs) {
    if (typeof message !== "object" || message === null || typeof message.id !== "string") return console.log("argcord: The provided message is not a message")
    if (typeof prefix !== 'string') return console.log("argcord: prefix has to be a string")
    if (prefix.length === 0) return console.log("argcord: prefix can not be an empty string")
    if (!Array.isArray(expectedArgs)) return console.log("argcord: expectedArgs has to be an array")
    let msgArgs = message.content.slice(prefix.length).trim().split(/ +/);
    msgArgs.shift();
    let counter = 0;
    let amount, num, role, member, channel;
    for (const argument of expectedArgs) {
        if (typeof argument !== "object" || argument === null) return console.log("argcord: Argument is not an object")
        if (!argument.type) return console.log("argcord: You didn't provide an argument type");
        if (typeof argument.type !== "string") return console.log("argcord: Argument type is not a string")
        amount = isNaN(argument.amount) ? 1 : parseInt(argument.amount)
        for (var i = 0; i < amount; i++) {
            switch (argument.type) {
                case "NUMBER":
                    num = Number(msgArgs[counter]);
                    if (!msgArgs[counter] || isNaN(num)) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    else msgArgs[counter] = num;
                    break;

                case "INTEGER":
                    if (isNaN(msgArgs[counter]) || isNaN(parseFloat(msgArgs[counter]))) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = parseInt(msgArgs[counter]);
                    break;

                case "CHANNEL":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<#") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(2, -1)
                    channel = message.guild.channels.cache.get(msgArgs[counter]);
                    if (!channel) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    };
                    msgArgs[counter] = channel;
                    break;

                case "ROLE":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<@&") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(3, -1)
                    role = message.guild.roles.cache.get(msgArgs[counter])
                    if (!role) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = role;
                    break;

                case "AUTHOR_OR_MEMBER":
                    if (msgArgs[counter] && (msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                    member = message.guild.member(msgArgs[counter])
                    if (!member) msgArgs[counter] = message.member
                    else msgArgs[counter] = member
                    if (argument.returnUsers) msgArgs[counter] = msgArgs[counter].user
                    break;

                case "ROLE_OR_MEMBER":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<@&") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(3, -1)
                    role = message.guild.roles.cache.get(msgArgs[counter])
                    if (!role) {
                        if ((msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                        member = message.guild.member(msgArgs[counter])
                        if (!member) return msgArgs = { invalid: true, prompt: argument.prompt }
                        else msgArgs[counter] = member
                    } else msgArgs[counter] = role
                    break;

                case "SOMETHING":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    break;

                case "MEMBER":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if ((msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                    member = message.guild.member(msgArgs[counter])
                    if (!member) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    else msgArgs[counter] = member
                    break;

                case "IMAGE":
                    if (message.attachments.array().length === 0) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = message.attachments.array()[0]
                    break;

                default:
                    return console.log(`argcord: The argument type '${argument.type}' doesn't exist`);
            }
            counter++
        }
    }
    return msgArgs;
}

module.exports = processArguments