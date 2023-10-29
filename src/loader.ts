import path from 'node:path'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { RedisVectorStore } from 'langchain/vectorstores/redis'

import { createClient } from 'redis'

const loader = new DirectoryLoader(
  path.resolve(__dirname, '../tmp'),
  {
    '.json': path => new JSONLoader(path, '/textDataAdila'),
  }
)

async function load() {
  const docs = await loader.load()
  
  const splitter = new TokenTextSplitter({
    encodingName: 'cl100k_base',
    chunkSize: 600,
    chunkOverlap: 0
  })

  const splittedDocuments = await splitter.splitDocuments(docs)

  const redis = createClient({
    url: 'redis://localhost:6379'
  })

  await redis.connect()
  
  await RedisVectorStore.fromDocuments(
    splittedDocuments,
    new OpenAIEmbeddings({ openAIApiKey: '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' }),
    {
      indexName: 'adilaAi-embeddings',
      redisClient: redis,
      keyPrefix: 'adilaAi:',
    }  
  )

  await redis.disconnect()
}

load()