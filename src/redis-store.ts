
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { createClient } from 'redis'

export const redis = createClient({
  url: 'redis://localhost:6379'
})

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: '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' }),
  {
    indexName: 'adilaAi-embeddings',
    redisClient: redis,
    keyPrefix: 'adilaAi:',
  }  
)