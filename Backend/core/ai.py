import os, re, json
from datetime import datetime, timedelta
from .models import ContextEntry, Category
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

def gemini_json(prompt: str, schema_hint: dict) -> dict:
    """Ask Gemini to return strict JSON."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        msg = f"{prompt}\n\nReturn ONLY JSON matching this schema:\n{json.dumps(schema_hint)}"
        resp = model.generate_content(msg)
        text = resp.text or "{}"
        m = re.search(r"\{.*\}", text, flags=re.S)
        return json.loads(m.group(0)) if m else {}
    except Exception as e:
        return {}

def analyze_context():
    latest = ContextEntry.objects.order_by("-created_at")[:50]
    bag = {}
    for c in latest:
        for w in re.findall(r"[a-zA-Z]{4,}", c.content.lower()):
            bag[w] = bag.get(w, 0) + 1
    return {"keywords": sorted(bag, key=bag.get, reverse=True)[:15]}

def score_priority(title, desc, ctx_summary):
    kw = ", ".join(ctx_summary.get("keywords", []))
    schema = {"priority": 0}
    prompt = f"Task title: {title}\nDescription: {desc}\nKeywords: {kw}\nRate priority 0-100."
    data = gemini_json(prompt, schema)
    return float(data.get("priority", 50))

def suggest_deadline(complexity=None):
    schema = {"days_from_now": 0}
    prompt = f"Suggest realistic days_from_now to complete a {complexity or 'medium'} complexity task."
    data = gemini_json(prompt, schema)
    days = int(data.get("days_from_now", 3))
    return datetime.utcnow() + timedelta(days=days)

def suggest_category(title, desc):
    existing = list(Category.objects.values_list("name", flat=True))
    schema = {"category": ""}
    prompt = f"Task: {title}\nDesc: {desc}\nChoose best category from: {existing}."
    data = gemini_json(prompt, schema)
    name = (data.get("category") or "").strip()
    if name in existing:
        return Category.objects.get(name=name)
    return None

def enhance_description(title, desc, ctx_summary):
    kw = ", ".join(ctx_summary.get("keywords", []))
    schema = {"description": ""}
    prompt = f"Improve task description: {desc}\nKeywords: {kw}"
    data = gemini_json(prompt, schema)
    return data.get("description", desc)
