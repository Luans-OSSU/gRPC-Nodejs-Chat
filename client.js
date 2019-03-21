let grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const readline = require("readline");

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdOUT,
});

var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_SERVER = "0.0.0.0:5001";

let username;

let client = new proto.chat.Chat(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);

const startChat = () => {
    let channel = client.join({ user: username });

    channel.on("data", onData);

    rl.on("line", text => {
        client.send({ user: username, text }, res => {

        })
    });
}


const onData = (message) => {
    if ( message.user == username ) {
        return;
    }
    
    console.log(`${message.user}: ${message.text}`);
}

rl.question("What's your name?", (answer) => {
    username = answer;
    console.log("username", answer);
    startChat();
})