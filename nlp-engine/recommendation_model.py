"""
Recommendation Engine using TF-IDF + Cosine Similarity
Uses scikit-learn's TfidfVectorizer for semantic skill matching
with weighted scoring for department and location.

This is a lightweight alternative to loading a full BERT model,
suitable for systems with limited RAM.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

print("Initializing TF-IDF Recommendation Engine...")

# Global TF-IDF vectorizer
vectorizer = TfidfVectorizer(
    analyzer='word',
    ngram_range=(1, 2),
    stop_words='english',
    max_features=5000
)

print("Recommendation engine ready.")


def compute_skill_similarity(user_skills, internship_skills):
    """
    Compute similarity between user skills and internship required skills
    using TF-IDF vectorization and cosine similarity.
    """
    if not user_skills or not internship_skills:
        return 0.0

    # Create text representations
    user_text = " ".join(user_skills)
    internship_text = " ".join(internship_skills)

    try:
        # Fit and transform using TF-IDF
        tfidf_matrix = vectorizer.fit_transform([user_text, internship_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return max(0.0, min(1.0, float(similarity)))
    except Exception:
        # Fallback to Jaccard similarity
        user_set = set(s.lower().strip() for s in user_skills)
        intern_set = set(s.lower().strip() for s in internship_skills)
        intersection = user_set & intern_set
        union = user_set | intern_set
        if not union:
            return 0.0
        return len(intersection) / len(union)


def compute_department_match(user_department, internship_department):
    """
    Compute department match score.
    Returns 1.0 for exact match, 0.5 for related departments, 0.0 otherwise.
    """
    if not user_department or not internship_department:
        return 0.0

    user_dept = user_department.lower().strip()
    intern_dept = internship_department.lower().strip()

    if user_dept == intern_dept:
        return 1.0

    # Related department mappings
    related_departments = {
        "cse": ["it", "information technology", "computer science", "software engineering"],
        "ece": ["eee", "electronics", "electrical", "ee"],
        "ee": ["eee", "ece", "electronics", "electrical"],
        "me": ["automobile", "automotive", "manufacturing", "production"],
        "ce": ["structural", "construction", "civil"],
        "biotech": ["bioinformatics", "biochemistry", "life sciences"],
        "mba": ["business", "management", "commerce", "bba"]
    }

    for dept, related in related_departments.items():
        if user_dept == dept and intern_dept in related:
            return 0.5
        if intern_dept == dept and user_dept in related:
            return 0.5

    return 0.0


def compute_location_match(user_location, internship_location):
    """
    Compute location match score.
    Returns 1.0 for exact match, 0.3 for same region, 0.0 otherwise.
    """
    if not user_location or not internship_location:
        return 0.0

    user_loc = user_location.lower().strip()
    intern_loc = internship_location.lower().strip()

    if user_loc == intern_loc:
        return 1.0

    # Regional groupings (Indian cities)
    regions = {
        "south": ["bangalore", "bengaluru", "chennai", "hyderabad", "kochi", "coimbatore", "mysore"],
        "west": ["mumbai", "pune", "ahmedabad", "goa", "surat", "nagpur"],
        "north": ["delhi", "noida", "gurgaon", "gurugram", "jaipur", "lucknow", "chandigarh"],
        "east": ["kolkata", "bhubaneswar", "patna", "guwahati"]
    }

    user_region = None
    intern_region = None

    for region, cities in regions.items():
        if user_loc in cities:
            user_region = region
        if intern_loc in cities:
            intern_region = region

    if user_region and intern_region and user_region == intern_region:
        return 0.3

    return 0.0


def find_skill_gaps(user_skills, internship_skills):
    """
    Identify skills that the internship requires but the user does not have.
    """
    user_skills_lower = set(s.lower().strip() for s in user_skills)
    missing_skills = []

    for skill in internship_skills:
        if skill.lower().strip() not in user_skills_lower:
            missing_skills.append(skill)

    return missing_skills


def get_recommendations(user_profile, internships, top_n=10):
    """
    Generate internship recommendations based on user profile.

    Scoring formula:
        final_score = 0.6 * skill_similarity + 0.2 * department_match + 0.2 * location_match

    Returns top N internships sorted by score with skill gap analysis.
    """
    user_skills = user_profile.get("skills", [])
    user_department = user_profile.get("department", "")
    user_location = user_profile.get("location", "")

    recommendations = []

    for internship in internships:
        internship_skills = internship.get("requiredSkills", [])
        internship_department = internship.get("department", "")
        internship_location = internship.get("location", "")

        # Compute individual scores
        skill_score = compute_skill_similarity(user_skills, internship_skills)
        dept_score = compute_department_match(user_department, internship_department)
        loc_score = compute_location_match(user_location, internship_location)

        # Weighted final score
        final_score = (0.6 * skill_score) + (0.2 * dept_score) + (0.2 * loc_score)

        # Find missing skills
        missing_skills = find_skill_gaps(user_skills, internship_skills)

        recommendations.append({
            "_id": internship.get("_id", ""),
            "title": internship.get("title", ""),
            "company": internship.get("company", ""),
            "description": internship.get("description", ""),
            "requiredSkills": internship_skills,
            "department": internship_department,
            "location": internship_location,
            "duration": internship.get("duration", ""),
            "stipend": internship.get("stipend", ""),
            "matchScore": round(final_score * 100, 1),
            "skillScore": round(skill_score * 100, 1),
            "departmentMatch": dept_score == 1.0,
            "locationMatch": loc_score == 1.0,
            "missingSkills": missing_skills,
            "skillGapFeedback": _generate_skill_gap_feedback(
                internship.get("title", ""), missing_skills
            ) if missing_skills else None
        })

    # Sort by match score (descending)
    recommendations.sort(key=lambda x: x["matchScore"], reverse=True)

    return recommendations[:top_n]


def _generate_skill_gap_feedback(internship_title, missing_skills):
    """Generate human-readable skill gap feedback message."""
    if not missing_skills:
        return None

    skills_list = ", ".join(missing_skills[:5])
    remaining = len(missing_skills) - 5

    feedback = f"You were not recommended higher for {internship_title} because you are missing the following skills: {skills_list}"

    if remaining > 0:
        feedback += f" and {remaining} more"

    return feedback
