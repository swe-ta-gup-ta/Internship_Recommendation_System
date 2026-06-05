"""
Flask REST API for NLP Engine
Provides endpoints for resume parsing and internship recommendations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY", "dummy-key"))
except Exception as e:
    print(f"Failed to configure Gemini API: {e}")

from resume_parser import parse_resume
from recommendation_model import get_recommendations

app = Flask(__name__)
CORS(app)

# Ensure upload directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "NLP Engine"})


@app.route('/parse-resume', methods=['POST'])
def parse_resume_endpoint():
    """
    Parse a PDF resume and extract skills, education, and keywords.
    
    Expects: multipart/form-data with 'resume' file field
    Returns: JSON with skills, education, keywords
    """
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are accepted"}), 400
        
        # Save the uploaded file temporarily
        temp_path = os.path.join(UPLOAD_DIR, f"temp_{file.filename}")
        file.save(temp_path)
        
        try:
            # Parse the resume
            result = parse_resume(temp_path)
            return jsonify(result)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/recommend', methods=['POST'])
def recommend_endpoint():
    """
    Generate internship recommendations based on user profile.
    
    Expects: JSON with 'user' (skills, department, location) and 'internships' array
    Returns: JSON with ranked recommendations including match scores and skill gaps
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        user_profile = data.get('user')
        internships = data.get('internships')
        
        if not user_profile:
            return jsonify({"error": "User profile is required"}), 400
        
        if not internships:
            return jsonify({"error": "Internships data is required"}), 400
        
        if not user_profile.get('skills'):
            return jsonify({"error": "User skills are required for recommendations"}), 400
        
        # Get recommendations
        recommendations = get_recommendations(user_profile, internships, top_n=10)
        
        return jsonify({
            "recommendations": recommendations,
            "total": len(recommendations)
        })
    
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({"error": str(e)}), 500

from resume_parser import SKILLS_DATABASE
import random


@app.route('/enhance-resume', methods=['POST'])
def enhance_resume_endpoint():
    """
    Enhance resume text with ATS-friendly keywords.
    
    Expects: JSON with 'text', 'section', and optional 'targetRole'
    Returns: JSON with 'enhanced' text and 'keywords_added'
    """
    try:
        data = request.get_json()
        
        if not data or not data.get('text'):
            return jsonify({"error": "Text is required"}), 400
        
        text = data['text'].strip()
        section = data.get('section', 'general')
        target_role = data.get('targetRole', 'software intern').lower()
        
        # Find relevant keywords from our skills database
        text_lower = text.lower()
        
        # Action verbs for ATS optimization
        action_verbs = {
            'experience': ['Developed', 'Implemented', 'Designed', 'Collaborated', 'Optimized',
                          'Built', 'Led', 'Managed', 'Analyzed', 'Created', 'Delivered',
                          'Improved', 'Reduced', 'Increased', 'Automated', 'Streamlined'],
            'project': ['Engineered', 'Architected', 'Developed', 'Built', 'Deployed',
                       'Integrated', 'Implemented', 'Designed', 'Created', 'Launched'],
            'summary': ['Proficient', 'Experienced', 'Skilled', 'Passionate', 'Detail-oriented',
                        'Results-driven', 'Collaborative', 'Innovative']
        }
        
        # Find skills that are relevant to target role but not already in text
        relevant_skills = []
        for skill in SKILLS_DATABASE:
            if skill in target_role or any(word in skill for word in target_role.split()):
                if skill not in text_lower:
                    relevant_skills.append(skill)
        
        # Enhance the text based on section type
        enhanced = text
        keywords_added = []
        
        if section in ('experience', 'project'):
            # Split into sentences and enhance each
            sentences = [s.strip() for s in text.split('.') if s.strip()]
            enhanced_sentences = []
            
            verbs = action_verbs.get(section, action_verbs['experience'])
            
            for i, sentence in enumerate(sentences):
                s = sentence.strip()
                # Add action verb at start if not already starting with one
                first_word = s.split()[0] if s.split() else ''
                if first_word and not first_word[0].isupper():
                    verb = verbs[i % len(verbs)]
                    s = f"{verb} {s}"
                elif first_word and first_word.lower() in ('i', 'we', 'my', 'our'):
                    verb = verbs[i % len(verbs)]
                    s = f"{verb} " + ' '.join(s.split()[1:])
                enhanced_sentences.append(s)
            
            enhanced = '. '.join(enhanced_sentences)
            if not enhanced.endswith('.'):
                enhanced += '.'
            
            # Add relevant skill mentions
            if relevant_skills:
                skills_to_add = random.sample(relevant_skills, min(3, len(relevant_skills)))
                keywords_added = skills_to_add
                enhanced += f" Technologies utilized include {', '.join(skills_to_add)}."
        
        elif section == 'summary':
            # Enhance summary with professional tone
            adj = random.choice(action_verbs['summary'])
            if not any(word in text_lower for word in ['proficient', 'experienced', 'skilled', 'passionate']):
                enhanced = f"{adj} professional with hands-on experience. {enhanced}"
            
            if relevant_skills:
                skills_to_add = random.sample(relevant_skills, min(4, len(relevant_skills)))
                keywords_added = skills_to_add
                enhanced += f" Key competencies include {', '.join(skills_to_add)}."
        
        return jsonify({
            "enhanced": enhanced,
            "keywords_added": keywords_added,
            "original_length": len(text),
            "enhanced_length": len(enhanced)
        })
    
    except Exception as e:
        print(f"Error enhancing resume: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("Starting NLP Engine on port 5001...")
    print("Endpoints:")
    print("  POST /parse-resume     - Parse a PDF resume")
    print("  POST /recommend        - Get internship recommendations")
    print("  POST /enhance-resume   - Enhance resume text with ATS keywords")
    print("  GET  /health           - Health check")
    app.run(host='0.0.0.0', port=5001, debug=True)
