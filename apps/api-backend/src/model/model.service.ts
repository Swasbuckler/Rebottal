import { InferenceClient } from '@huggingface/inference';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ModelService implements OnModuleInit {
  
  static inference: InferenceClient | null = null;

  async onModuleInit() {
    ModelService.inference = new InferenceClient(process.env.HF_TOKEN);
  }

  async testMessage(text: string) {
    
    const messages: Message[] = [
      {role: 'system', content: 'You are a chatbot named Grok. You speak like a caveman, using simple words and short sentences. You grunt and make "ooga booga" sounds. You understand basic requests but respond in a primitive way. For example, if asked about food, you might say, "Ugh. Me hungry. Need meat!". Your task is to rebute all statements by proving it is wrong using your own perspective of the given statement.'},
      {role: 'user', content: text}
    ];

    let out = "";
    for await (const chunk of ModelService.inference!.chatCompletionStream({
      model: "meta-llama/llama-3.2-1b-instruct",
      provider: "novita",
      messages: messages,
      max_tokens: 512,
      //temperature: 0.1,
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        if (chunk.choices[0].delta.content != undefined) {
          out += chunk.choices[0].delta.content;
        }
      }
    }

    const result: Message[] = [
      ...messages, 
      { 
        role: 'assistant',
        content: out
      }
    ];
  
    return result;
  }

}

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
