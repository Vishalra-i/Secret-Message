import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


// Access your API key as an environment variable.
const API_KEY : string  = process.env.GEMINI_API_KEY as string
const genAI = new GoogleGenerativeAI(API_KEY);


export async function POST(req : Request) {
   try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
          const prompt = "Create a list of three open-ended and engaging questions formatted as a single string.Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
          const result = await model.generateContent(prompt);
          const response = result.response;
          const text = response.text();
          
          return NextResponse.json({
             content : text ,
          },{
            status : 200
          })

   } catch (error) {
             console.error("An unexpected error in suggest messages ::" , error)
             throw error
      }       
}


