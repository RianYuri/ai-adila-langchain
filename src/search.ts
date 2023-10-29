import { redis, redisVectorStore } from "./redis-store"

async function search() {
  await redis.connect()

  const response = await redisVectorStore.similaritySearchWithScore(
    'Fale sobre o racismo?',
    4
    )
    console.log(response)
  await redis.disconnect()
}

search()