import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") or ""

llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=SecretStr(DEEPSEEK_API_KEY),
    base_url="https://api.deepseek.com"
)