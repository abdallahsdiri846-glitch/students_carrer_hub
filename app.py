import os
import json
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API Key
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("❌ Missing GROQ_API_KEY environment variable!")

client = Groq(api_key=api_key)
MODEL_ID = "llama-3.1-8b-instant"

# ---------------- TEXT AI ----------------
@app.route("/text-ai", methods=["POST"])
def text_ai():
    data = request.json
    user_input = data.get("prompt", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are a clear, helpful assistant for students and job seekers."},
            {"role": "user", "content": user_input}
        ]
    )
    return jsonify({"reply": response.choices[0].message.content})

# ---------------- SUMMARIZER ----------------
@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    notes = data.get("notes", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Summarize lessons clearly and make them easy to read."},
            {"role": "user", "content": notes}
        ]
    )
    return jsonify({"summary": response.choices[0].message.content})

# ---------------- QUIZ ----------------
@app.route("/quiz", methods=["POST"])
def quiz():
    data = request.json
    topic = data.get("topic", "")
    difficulty = data.get("difficulty", "easy")

    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {
                "role": "system",
                "content": (
                    f"Generate exactly 3 {difficulty} multiple-choice quiz questions about {topic}. "
                    "Return ONLY valid JSON array, no explanations, no markdown, no text. "
                    "Each item must have 'question', 'options' (list of 4), and 'answer' (index of correct option)."
                )
            }
        ]
    )

    raw_content = response.choices[0].message.content.strip()

    # إزالة أي Markdown مثل ```json أو ```
    if raw_content.startswith("```"):
        raw_content = raw_content.strip("`")
        raw_content = raw_content.replace("json", "").strip()

    try:
        questions = json.loads(raw_content)
    except Exception as e:
        print("❌ JSON parse error:", e)
        questions = [{"question": raw_content, "options": [], "answer": ""}]

    return jsonify({"questions": questions})

@app.route("/quiz-correct", methods=["POST"])
def quiz_correct():
    data = request.json
    answers = data.get("answers", [])
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are a quiz corrector. For each answer, say if it's correct or not, and explain why in clear writing."},
            {"role": "user", "content": json.dumps(answers)}
        ]
    )
    return jsonify({"explanation": response.choices[0].message.content})

# ---------------- FLASHCARDS ----------------
@app.route("/flashcards", methods=["POST"])
def flashcards():
    data = request.json
    terms = data.get("terms", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Generate flashcards for memorization. Format as a list of terms with definitions, easy to read."},
            {"role": "user", "content": f"Make flashcards for: {terms}"}
        ]
    )
    return jsonify({"flashcards": response.choices[0].message.content})

# ---------------- PLANNER ----------------
@app.route("/planner", methods=["POST"])
def planner():
    data = request.json
    subjects = data.get("subjects", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Create a simple study plan. Format clearly with steps and easy writing."},
            {"role": "user", "content": f"Make a revision plan for: {subjects}"}
        ]
    )
    return jsonify({"plan": response.choices[0].message.content})

# ---------------- CAREER ASSISTANT ----------------
@app.route("/cv", methods=["POST"])
def cv():
    data = request.json
    name = data.get("name", "")
    email = data.get("email", "")
    experience = data.get("experience", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Generate a professional CV. Format with sections: Name, Email, Experience. Make it clear and easy to read."},
            {"role": "user", "content": f"Name: {name}, Email: {email}, Experience: {experience}"}
        ]
    )
    return jsonify({"cv": response.choices[0].message.content})

@app.route("/cover", methods=["POST"])
def cover():
    data = request.json
    job = data.get("job", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Generate a professional cover letter. Write it in clear, simple language."},
            {"role": "user", "content": f"Write a cover letter for: {job}"}
        ]
    )
    return jsonify({"cover": response.choices[0].message.content})

@app.route("/interview", methods=["POST"])
def interview():
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Simulate a job interview with common questions and answers. Format clearly and easy to read."},
            {"role": "user", "content": "Start interview simulation"}
        ]
    )
    return jsonify({"interview": response.choices[0].message.content})

@app.route("/linkedin", methods=["POST"])
def linkedin():
    data = request.json
    profile = data.get("profile", "")
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "Give suggestions to improve LinkedIn profile. Format as bullet points, easy to read."},
            {"role": "user", "content": profile}
        ]
    )
    return jsonify({"linkedin": response.choices[0].message.content})
from flask import render_template

@app.route("/")
def home():
    # لو عندك ملف index3.html في مجلد templates
    return render_template("index3.html")

    # أو لو لسه ما جهزتش HTML، ممكن تبدأ برسالة بسيطة:
    # return "✅ Student Career Hub API is running!"

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)