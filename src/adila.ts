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

    Se possível, inclua exemplo de código em Javascript e Typecript.


    textDataAdila:
    {context}

    Pergunta:
    {question}
  `.trim(),
  inputVariables: ['context', 'question']
})

const chain = RetrievalQAChain.fromLLM(openAiChat, redisVectorStore.asRetriever(3), {
  prompt,
  returnSourceDocuments: true,
  verbose: true
})

async function main() {
  await redis.connect()
  
  const response = await chain.call({
   
    query: 'Qual a vantagem de utilizar Java?'
  })
  
  console.log(response)

  await redis.disconnect()
}

main()