"""
Resume Parser Module
Extracts skills, education, and keywords from PDF resumes using pdfplumber and NLP.
"""

import pdfplumber
import re
import os

# Comprehensive skills dictionary organized by category
SKILLS_DATABASE = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "ruby", "go",
    "rust", "swift", "kotlin", "php", "r", "scala", "perl", "matlab", "verilog",
    "vhdl", "shell scripting", "bash", "powershell", "dart", "lua", "assembly",
    "solidity", "haskell", "elixir", "objective-c",
    
    # Web Development
    "html", "css", "react", "react.js", "angular", "vue", "vue.js", "next.js",
    "node.js", "express", "express.js", "django", "flask", "spring boot",
    "asp.net", "laravel", "ruby on rails", "tailwind css", "bootstrap",
    "jquery", "sass", "webpack", "vite", "graphql", "rest api", "soap",
    "web3", "svelte",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    "cassandra", "dynamodb", "firebase", "sqlite", "oracle", "sql server",
    "neo4j", "couchdb", "snowflake", "redshift", "database management",
    
    # Data Science & ML
    "machine learning", "deep learning", "data science", "data analysis",
    "data visualization", "pandas", "numpy", "scikit-learn", "tensorflow",
    "pytorch", "keras", "opencv", "nlp", "natural language processing",
    "computer vision", "neural networks", "transformers", "bert",
    "reinforcement learning", "statistics", "data mining", "feature engineering",
    "model training", "regression", "classification", "clustering",
    "dimensionality reduction", "ensemble methods", "xgboost", "lightgbm",
    "spacy", "sentiment analysis", "image processing",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes",
    "jenkins", "terraform", "ansible", "ci/cd", "github actions",
    "gitlab ci", "circleci", "nginx", "apache", "linux", "unix",
    "windows server", "monitoring", "prometheus", "grafana", "cloudwatch",
    "heroku", "netlify", "vercel",
    
    # Big Data
    "big data", "apache spark", "hadoop", "apache kafka", "apache airflow",
    "data engineering", "etl", "data warehousing", "data pipeline", "hive",
    "pig", "presto", "dbt",
    
    # Mobile Development
    "react native", "flutter", "android", "ios", "swift", "mobile development",
    "xamarin", "ionic",
    
    # Tools & Platforms
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "slack", "figma", "adobe xd", "photoshop", "illustrator",
    "postman", "swagger", "vs code", "intellij", "eclipse",
    
    # Data Visualization
    "tableau", "power bi", "d3.js", "matplotlib", "seaborn", "plotly",
    "grafana", "excel", "google analytics",
    
    # Cybersecurity
    "cybersecurity", "penetration testing", "network security", "encryption",
    "firewall", "siem", "vulnerability assessment", "ethical hacking",
    
    # Engineering
    "solidworks", "autocad", "ansys", "catia", "ansys fluent", "matlab",
    "simulink", "pcb design", "circuit design", "3d modeling", "cad",
    "cnc", "3d printing", "prototyping", "mechanical design",
    "circuit analysis", "digital design", "analog design",
    "fpga", "embedded systems", "arduino", "raspberry pi",
    "iot", "mqtt", "sensor integration", "robotics", "ros",
    "signal processing", "dsp", "control systems", "plc", "scada",
    "communication systems", "wireless networks", "5g", "tcp/ip",
    "networking", "cisco", "power electronics", "power systems",
    "thermal engineering", "heat transfer", "cfd", "vehicle dynamics",
    "automotive engineering", "structural engineering", "staad pro",
    "etabs", "rcc design", "geotechnical engineering", "soil mechanics",
    "geostudio", "foundation design", "construction management",
    "primavera", "estimation", "lean manufacturing", "six sigma",
    "quality control", "manufacturing", "material science",
    "instrumentation", "process control", "sensors",
    
    # Biotech & Science
    "bioinformatics", "genomics", "molecular biology", "drug discovery",
    "biotechnology", "microbiology", "fermentation", "bioprocess engineering",
    "pharmaceutical research", "chemistry", "water treatment",
    "environmental science", "renewable energy", "solar energy",
    "pvsyst", "energy analysis",
    
    # Business & Management
    "project management", "agile", "scrum", "product management",
    "business analytics", "market research", "analytics",
    "digital marketing", "seo", "social media", "content writing",
    "communication", "financial modeling", "accounting", "valuation",
    "financial analysis", "human resources", "recruitment",
    "hr analytics", "supply chain", "operations management",
    "lean", "six sigma", "technical writing", "documentation",
    "markdown",
    
    # Testing
    "selenium", "testing", "automation", "test automation", "jest",
    "mocha", "cypress", "pytest", "junit", "unit testing",
    "integration testing", "performance testing",
    
    # Game Development
    "unity", "unreal engine", "game development", "ar/vr",
    "physics", "blender",
    
    # Blockchain
    "blockchain", "ethereum", "smart contracts", "web3",
    "cryptocurrency", "defi"
}

# Education keywords
EDUCATION_KEYWORDS = {
    "bachelor", "master", "phd", "b.tech", "m.tech", "b.e", "m.e",
    "bsc", "msc", "mba", "bba", "b.sc", "m.sc", "diploma",
    "computer science", "information technology", "electronics",
    "mechanical engineering", "electrical engineering", "civil engineering",
    "biotechnology", "chemical engineering", "data science",
    "artificial intelligence", "mathematics", "physics", "chemistry",
    "commerce", "business administration", "engineering",
    "university", "college", "institute", "iit", "nit", "iiit"
}


def extract_text_from_pdf(file_path):
    """Extract raw text from a PDF file using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
    return text


def clean_text(text):
    """Clean and normalize extracted text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep meaningful ones
    text = re.sub(r'[^\w\s\.\,\-\/\+\#]', '', text)
    # Convert to lowercase
    text = text.lower().strip()
    return text


def extract_skills(text):
    """Extract skills from text by matching against skills database."""
    text_lower = text.lower()
    found_skills = []
    
    # Sort skills by length (longest first) to handle multi-word skills
    sorted_skills = sorted(SKILLS_DATABASE, key=len, reverse=True)
    
    for skill in sorted_skills:
        # Use word boundary matching for single-word skills
        if len(skill.split()) == 1:
            pattern = r'\b' + re.escape(skill) + r'\b'
        else:
            # For multi-word skills, use flexible matching
            pattern = re.escape(skill)
        
        if re.search(pattern, text_lower):
            # Normalize the skill name
            normalized = skill.strip().lower()
            if normalized not in [s.lower() for s in found_skills]:
                found_skills.append(skill)
    
    return found_skills


def extract_education(text):
    """Extract education-related information from text."""
    text_lower = text.lower()
    found_education = []
    
    for keyword in EDUCATION_KEYWORDS:
        if keyword in text_lower:
            found_education.append(keyword)
    
    return list(set(found_education))


def extract_keywords(text):
    """Extract general keywords from the resume text."""
    # Common stop words to filter out
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its',
        'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our',
        'you', 'your', 'he', 'she', 'they', 'them', 'his', 'her', 'their',
        'not', 'no', 'nor', 'if', 'then', 'than', 'so', 'as', 'up', 'out',
        'about', 'into', 'through', 'during', 'before', 'after', 'above',
        'below', 'between', 'each', 'few', 'more', 'most', 'other', 'some',
        'such', 'only', 'own', 'same', 'also', 'just', 'over', 'very',
        'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
        'all', 'both', 'any', 'here', 'there', 'am', 'an'
    }
    
    # Tokenize
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    
    # Count word frequencies (exclude stop words)
    word_freq = {}
    for word in words:
        if word not in stop_words and len(word) > 2:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Return top keywords sorted by frequency
    sorted_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_keywords[:30]]


def parse_resume(file_path):
    """Main function to parse a resume PDF and extract all relevant information."""
    # Extract text from PDF
    raw_text = extract_text_from_pdf(file_path)
    
    if not raw_text:
        return {
            "skills": [],
            "education": [],
            "keywords": [],
            "error": "Could not extract text from PDF"
        }
    
    # Clean the text
    cleaned_text = clean_text(raw_text)
    
    # Extract information
    skills = extract_skills(cleaned_text)
    education = extract_education(cleaned_text)
    keywords = extract_keywords(cleaned_text)
    
    return {
        "skills": skills,
        "education": education,
        "keywords": keywords,
        "raw_text_length": len(raw_text)
    }
