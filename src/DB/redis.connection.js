import { createClient } from "redis";


export  const client = createClient({
    url: process.env.UPSTASH_REDIS_REST_URL,
  });

export const redisConnect = () => {

  client
    .connect()
    .then(() => {
      console.log("connected to redis successfully");
    })
    .catch((err) => {
      console.log("error connecting to redis");
    });
};
