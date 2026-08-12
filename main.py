from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from services.groq_service import GroqService, GroqServiceError

app = FastAPI(
    title="Groq AI Chatbot API",
    description="An AI-powered chatbot API using Groq Llama 3 and FastAPI.",
    version="1.0.0"
)

# Mount the static directory to serve CSS and JS files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Request and Response schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Attempt to initialize the GroqService. If configuration fails (e.g., missing API key),
# we catch it and will report the issue upon chat requests rather than crashing the server.
groq_service = None
init_error = None

try:
    groq_service = GroqService()
except Exception as e:
    init_error = e

@app.get("/")
async def get_index():
    return FileResponse("templates/index.html")

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    global groq_service, init_error
    
    # Check for empty message
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # If the service failed to initialize on startup, retry initialization
    # (in case the user updated the .env file in the meantime)
    if not groq_service:
        try:
            groq_service = GroqService()
            init_error = None
        except Exception as e:
            init_error = e
            
    if init_error:
        # Raise HTTP 500 with configuration failure details
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot service configuration error: {str(init_error)}"
        )
        
    try:
        bot_response = groq_service.generate_response(request.message)
        return ChatResponse(response=bot_response)
    except GroqServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
