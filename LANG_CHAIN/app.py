import os
import streamlit as st
from dotenv import load_dotenv

# --- NEW LOCAL EMBEDDINGS ---
from langchain_huggingface import HuggingFaceEmbeddings
# --- GEMINI FOR CHAT ---
from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

st.set_page_config(page_title="Hybrid PDF Chatbot", layout="centered")
st.header("Unlimited PDF Chatbot 🚀")
st.subheader("Local Embeddings + Gemini Chat")

# --- Sidebar ---
with st.sidebar:
    st.title("Settings")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        api_key = st.text_input("Enter Google API Key", type="password")
        if api_key:
            os.environ["GOOGLE_API_KEY"] = api_key
    
    uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")

# --- Logic ---
@st.cache_resource # This prevents re-loading the model every time the app refreshes
def load_local_embeddings():
    # This model runs on your computer. It is free and has NO limits.
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def process_pdf(uploaded_file):
    with open("temp.pdf", "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    loader = PyPDFLoader("temp.pdf")
    data = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(data)
    
    # Use the Local Embeddings instead of Google API
    embeddings = load_local_embeddings()
    vector_store = Chroma.from_documents(chunks, embeddings)
    return vector_store.as_retriever()

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

if uploaded_file and api_key:
    if "rag_chain" not in st.session_state:
        with st.spinner("Processing PDF locally (No API limits)..."):
            retriever = process_pdf(uploaded_file)
            
            # Use Gemini for Chat only (Generation has much higher limits)
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash-lite", 
                temperature=0, 
                google_api_key=api_key
            )
            
            system_prompt = (
                "Use the following context to answer the question. "
                "Context: {context}"
            )
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "{input}"),
            ])

            qa_chain = create_stuff_documents_chain(llm, prompt)
            st.session_state.rag_chain = create_retrieval_chain(retriever, qa_chain)
            st.success("Ready! You can now chat.")

# --- Chat Interface ---
if "rag_chain" in st.session_state:
    user_input = st.chat_input("Ask a question:")
    if user_input:
        response = st.session_state.rag_chain.invoke({"input": user_input})
        st.session_state.chat_history.append(("User", user_input))
        st.session_state.chat_history.append(("Bot", response["answer"]))

    for role, text in st.session_state.chat_history:
        with st.chat_message(role.lower()):
            st.write(text)