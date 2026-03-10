import streamlit as st
from agent.doc_agent import generate_documentation_for_repo

st.set_page_config(page_title="GitHub Code Documentation AI", page_icon="🤖")

st.title("Boeing#2 Codebase Documentation")
st.write(
    "Paste **public GitHub repository URL** "
    "and generate a professional documentation report."
)

repo_url = st.text_input("GitHub repository URL", placeholder="https://github.com/user/repo")

if st.button("Generate Documentation"):
    if not repo_url.strip():
        st.error("Please enter a valid GitHub URL.")
    else:
        with st.spinner("Fetching repository and analyzing code..."):
            try:
                report = generate_documentation_for_repo(repo_url.strip())
                st.success("✅ Documentation generated successfully!")
                st.markdown(report)
            except Exception as e:
                st.error(f"⚠️ Error: {e}")
