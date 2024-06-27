import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os


#Please provide your own api key, this is a fake
genai.configure(api_key="AIzaSyDRYN1dstSzmF4XFbl3XCcTXjsY3LlREzw")
model = genai.GenerativeModel('gemini-1.5-pro-latest')

class Chat():
    
    def __init__(self):
        self.chat = model.start_chat()
        self.i = 0
    def get_plots(self,current):
            GetPlotsRes = self.chat.send_message(
                f'''
                give me all possible plots that can follow up this story, i want u to only write the plots, i want no other things
                written, and i want the plots to be ordered numerically, and before each plots give a title 
                to the plot using this marker language style (1.**Title**: the plot)
            
                {current}
                ''',
                safety_settings={
                    #Taking off all restrictions on prompts
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT       : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH      : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            return GetPlotsRes.text.split('\n')
        
            


    def developPlot(self,plot,current):
            DevolopRes = self.chat.send_message(
                f'''
                For the following story {current}
                Give me a continuation of the story
                following this plot: {plot}

                i want you to conserve the style writing of the orginal text,
                try to use similar metaphors, try to understand the nuance of the
                original text and keep to it in devoloping the plot,
                plus i want you to keep as much as possible the same language difficulty
                ''',
                safety_settings={
                    #Taking off all restrictions on prompts
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT       : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH      : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            text = DevolopRes.text
            return text
        
    
    def getTitle(self,plot):
            TitleRes = self.chat.send_message(
                f'''
                give me a suitable title for the following story {plot}

                IMPORTANT NOTE: i want your output in the following format

                The title is: ** The title you provide **
                ''',
                safety_settings={
                    #Taking off all restrictions on prompts
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT       : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH      : HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            text = TitleRes.text
            return text