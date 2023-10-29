
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