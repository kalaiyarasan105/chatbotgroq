import os
from dotenv import load_dotenv
import groq

# Load environment variables from .env file
load_dotenv()

class GroqServiceError(Exception):
    """Base exception class for Groq service issues."""
    pass

class MissingAPIKeyError(GroqServiceError):
    """Raised when the Groq API key is missing or not set."""
    pass

class GroqService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key or api_key.strip() == "" or api_key == "your_groq_api_key_here":
            raise MissingAPIKeyError("Groq API key is missing. Please configure GROQ_API_KEY in the .env file.")
        
        # Initialize Groq client
        self.client = groq.Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"

    def generate_response(self, user_message: str, temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """
        Sends the user message to Groq's Llama 3 model and returns the generated response.
        Handles API errors and maps them to custom exceptions.
        """
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful, friendly, and intelligent AI assistant. Keep your responses concise, engaging, and directly address the user's input.",
                    },
                    {
                        "role": "user",
                        "content": user_message,
                    }
                ],
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return chat_completion.choices[0].message.content
        except groq.APIConnectionError as e:
            # Catch network/connection failure
            raise GroqServiceError(f"Failed to connect to Groq API. Please check your network connection: {e}")
        except groq.APIStatusError as e:
            # Catch HTTP status errors (e.g. 401 unauthorized, 429 rate limits)
            if e.status_code == 401:
                raise GroqServiceError("Invalid Groq API key provided. Please verify the key in your .env file.")
            raise GroqServiceError(f"Groq API returned an error (status code {e.status_code}): {e.message}")
        except Exception as e:
            # Generic fallback
            raise GroqServiceError(f"An unexpected error occurred during message generation: {str(e)}")
