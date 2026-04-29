import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({apiKey: 'AIzaSyAnmXYa_CUePhdZiITFhlCfnC996VJqol0'});
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'hi',
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
test();
