// const { OpenAI } = require("openai");
// // const readlineSync = require("readline-sync");
// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_SECRET_KEY,
// });

// async function main() {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(chatCompletion.choices);
// }

// main();

const grpc = require("@grpc/grpc-js");
let protoLoader = require("@grpc/proto-loader");
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync("./protobuf/location.proto", options);
const location = grpc.loadPackageDefinition(packageDefinition).location;
const client = new location.LocationService('localhost:50065', grpc.credentials.createInsecure());
client.GetByParentId({ ParentIDs: [226, 6, 4] }, function (err, data) {
  if (err) {
    console.log(11111111, err);
  } else {
    const { Data } = data;
    const { LocationMap } = Data;

    for (const k in LocationMap) {
      const { ListLocation } = LocationMap[k];
      console.log(222222222, ListLocation);
    }
  }
});
