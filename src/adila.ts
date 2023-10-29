import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { redis, redisVectorStore } from './redis-store'

const openAiChat = new ChatOpenAI({
  openAIApiKey: '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',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3
})

const prompt = new PromptTemplate({
  template: `
    Você deve indentificar alguns termo no texto, que deve ter conotação racista.
    O usuário ira enviar o arquivo com a parte que tem a conotação racista.
    Utilize o acervo de termos racistas que foram fornecidas.
    Se a resposta não for encontrada nos textos, responda que você não encontrou nenhuma irregularidade, não tente inventar uma resposta.

    Se possível, inclua exemplo de sugestão de palavras de termo perjurativo por palavras polidas livre de preconceito.


    textDataAdila:
    {context}

    Pergunta:
    {question}
  `.trim(),
  inputVariables: ['context', 'question']
})

const chain = RetrievalQAChain.fromLLM(openAiChat, redisVectorStore.asRetriever(), {
  prompt,
  returnSourceDocuments: true,
  verbose: true
})

async function main() {
  await redis.connect()
  
  const response = await chain.call({
   
    query: 'Texto sobre o racismo?'
  })
  
  console.log(response)

  await redis.disconnect()
}

main()