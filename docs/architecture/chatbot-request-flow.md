# Chatbot Request Flow

1. API receives message and pet context references.
2. RAG layer retrieves FAQ/records/profile/listings context.
3. Prompt composer builds model input.
4. Safety post-processing validates response shape and disclaimers.
