from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json, os, traceback
from dotenv import load_dotenv

load_dotenv(override=True)

app = FastAPI(title="GenUx - UX Layout AI Generator")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

def get_client():
    key = os.getenv("GROQ_API_KEY")
    print(f"[GenUx] Using Groq key: {key[:20]}..." if key else "[GenUx] NO GROQ KEY FOUND!")
    return OpenAI(
        api_key=key,
        base_url="https://api.groq.com/openai/v1",
        timeout=60.0,
    )

class PromptRequest(BaseModel):
    prompt: str
    layout_type: str = "web app"

class ColorPalette(BaseModel):
    primary: str; secondary: str; accent: str; background: str; surface: str
    text_primary: str; text_secondary: str; name: str; mood: str

class TextSuggestion(BaseModel):
    heading_font: str; body_font: str; heading_size: str; body_size: str
    line_height: str; font_weight_heading: str; letter_spacing: str; style_notes: str

class Section(BaseModel):
    name: str; type: str; content: str; layout_hint: str

class UXLayout(BaseModel):
    title: str; style: str; description: str
    color_palette: ColorPalette; typography: TextSuggestion
    sections: list[Section]; design_principles: list[str]
    target_audience: str; unique_feature: str; html_preview: str

class GenerationResponse(BaseModel):
    layout_1: UXLayout; layout_2: UXLayout; prompt_analysis: str


def call_ai(messages, max_tokens=4000):
    client = get_client()
    print(f"[GenUx] Calling Groq...")
    r = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=max_tokens,
    )
    result = r.choices[0].message.content
    print(f"[GenUx] Got {len(result)} chars")
    return result


def safe_palette(cp):
    d = {"primary": "#6366f1", "secondary": "#4f46e5", "accent": "#6366f1",
         "background": "#0f0f0f", "surface": "#141420", "text_primary": "#ffffff",
         "text_secondary": "#94a3b8", "name": "Default", "mood": "Professional"}
    if not isinstance(cp, dict): return d
    return {k: cp.get(k, d[k]) for k in d}

def safe_typo(t):
    d = {"heading_font": "Inter", "body_font": "Inter", "heading_size": "56px",
         "body_size": "16px", "line_height": "1.7", "font_weight_heading": "800",
         "letter_spacing": "-1.5px", "style_notes": "Modern clean"}
    if not isinstance(t, dict): return d
    return {k: t.get(k, d[k]) for k in d}

def safe_sections(s):
    defs = [
        {"name": "Navbar", "type": "nav", "content": "Logo + links + CTA", "layout_hint": "sticky 64px"},
        {"name": "Hero", "type": "hero", "content": "Headline + buttons", "layout_hint": "2-col 100vh"},
        {"name": "Features", "type": "features", "content": "3 feature cards", "layout_hint": "3-col grid"},
        {"name": "CTA", "type": "cta", "content": "Headline + email", "layout_hint": "full width"},
        {"name": "Footer", "type": "footer", "content": "4 columns", "layout_hint": "dark bg"},
    ]
    if not s or not isinstance(s, list): return defs
    out = []
    for x in s:
        if isinstance(x, dict):
            out.append({
                "name": x.get("name", "Section"),
                "type": x.get("type", "section"),
                "content": x.get("content", "Content"),
                "layout_hint": x.get("layout_hint", "standard")
            })
    return out if out else defs


def generate_full_layout(prompt, is_dark):
    theme = "dark" if is_dark else "light"
    bg = "#0f0f0f" if is_dark else "#ffffff"
    accent = "#6366f1" if is_dark else "#2563eb"
    surface = "#141420" if is_dark else "#f8fafc"
    text_p = "#ffffff" if is_dark else "#111111"
    text_s = "#94a3b8" if is_dark else "#6b7280"

    system = f"""You are a UX designer and frontend engineer. Generate a complete {theme} layout.
Return ONLY a valid JSON object. No markdown. No explanation. No code blocks. Just raw JSON.

{{
  "title": "layout name",
  "style": "{theme} professional",
  "description": "2 sentence description",
  "color_palette": {{
    "primary": "{accent}",
    "secondary": "#4f46e5",
    "accent": "{accent}",
    "background": "{bg}",
    "surface": "{surface}",
    "text_primary": "{text_p}",
    "text_secondary": "{text_s}",
    "name": "palette name",
    "mood": "mood word"
  }},
  "typography": {{
    "heading_font": "Inter",
    "body_font": "Inter",
    "heading_size": "56px",
    "body_size": "16px",
    "line_height": "1.7",
    "font_weight_heading": "800",
    "letter_spacing": "-1.5px",
    "style_notes": "brief note"
  }},
  "sections": [
    {{"name": "Navbar", "type": "nav", "content": "Logo + links + CTA", "layout_hint": "sticky"}},
    {{"name": "Hero", "type": "hero", "content": "headline + subtext + 2 buttons", "layout_hint": "2-col"}},
    {{"name": "Features", "type": "features", "content": "3 feature cards", "layout_hint": "3-col grid"}},
    {{"name": "CTA", "type": "cta", "content": "headline + email input", "layout_hint": "full width"}},
    {{"name": "Footer", "type": "footer", "content": "links + copyright", "layout_hint": "dark bg"}}
  ],
  "design_principles": ["principle 1", "principle 2", "principle 3"],
  "target_audience": "who this is for",
  "unique_feature": "what stands out",
  "html_preview": "COMPLETE HTML PAGE"
}}

For html_preview write a complete self-contained HTML page with <!DOCTYPE html> that:
- Uses inline CSS only
- Has navbar, hero, features, CTA, footer sections
- Uses colors: background={bg} accent={accent} surface={surface} text={text_p} muted={text_s}
- Has real content for the product
- Looks professional and beautiful
- No external image URLs"""

    raw = call_ai([
        {"role": "system", "content": system},
        {"role": "user", "content": f'Create a {theme} UX layout for: "{prompt}". Return ONLY the JSON object.'}
    ], max_tokens=4000)

    raw = raw.strip()
    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            part = part.strip().lstrip("json").strip()
            if part.startswith("{"):
                raw = part
                break

    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start >= 0 and end > start:
        raw = raw[start:end]

    data = json.loads(raw)

    html = data.get("html_preview", "")
    if not html or len(html) < 200 or "<!DOCTYPE" not in html:
        html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
* {{margin:0;padding:0;box-sizing:border-box}}
body {{font-family:Inter,sans-serif;background:{bg};color:{text_p};min-height:100vh}}
.hero {{display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:40px}}
h1 {{font-size:48px;font-weight:900;margin-bottom:16px}}
p {{color:{text_s};font-size:18px;margin-bottom:32px}}
.btn {{background:{accent};color:white;padding:14px 32px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer}}
</style></head>
<body><div class="hero"><div>
<h1>{prompt}</h1>
<p>A beautiful {theme} layout for your product.</p>
<button class="btn">Get Started</button>
</div></div></body></html>"""
        data["html_preview"] = html

    return data


@app.post("/generate", response_model=GenerationResponse)
async def generate_layouts(request: PromptRequest):
    try:
        print(f"\n[GenUx] ===== NEW REQUEST =====")
        print(f"[GenUx] Prompt: '{request.prompt}'")

        print("[GenUx] Generating dark layout...")
        dark_data = generate_full_layout(request.prompt, True)
        print("[GenUx] Dark layout done!")

        print("[GenUx] Generating light layout...")
        light_data = generate_full_layout(request.prompt, False)
        print("[GenUx] Light layout done!")

        layout_1 = UXLayout(
            title=dark_data.get("title", "Dark Layout"),
            style=dark_data.get("style", "Dark Professional"),
            description=dark_data.get("description", "A professional dark layout."),
            color_palette=ColorPalette(**safe_palette(dark_data.get("color_palette", {}))),
            typography=TextSuggestion(**safe_typo(dark_data.get("typography", {}))),
            sections=[Section(**s) for s in safe_sections(dark_data.get("sections", []))],
            design_principles=dark_data.get("design_principles", ["Clean", "Modern", "Functional"]),
            target_audience=dark_data.get("target_audience", "General users"),
            unique_feature=dark_data.get("unique_feature", "Dark professional design"),
            html_preview=dark_data.get("html_preview", "")
        )

        layout_2 = UXLayout(
            title=light_data.get("title", "Light Layout"),
            style=light_data.get("style", "Light Professional"),
            description=light_data.get("description", "A clean light layout."),
            color_palette=ColorPalette(**safe_palette(light_data.get("color_palette", {}))),
            typography=TextSuggestion(**safe_typo(light_data.get("typography", {}))),
            sections=[Section(**s) for s in safe_sections(light_data.get("sections", []))],
            design_principles=light_data.get("design_principles", ["Clean", "Minimal", "Professional"]),
            target_audience=light_data.get("target_audience", "General users"),
            unique_feature=light_data.get("unique_feature", "Clean light design"),
            html_preview=light_data.get("html_preview", "")
        )

        print("[GenUx] ===== DONE! =====\n")
        return GenerationResponse(
            layout_1=layout_1,
            layout_2=layout_2,
            prompt_analysis=f"Generated 2 professional layouts for: {request.prompt}"
        )

    except json.JSONDecodeError as e:
        print(f"[GenUx] JSON ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"JSON parse error: {str(e)}")
    except Exception as e:
        print(f"[GenUx] ERROR: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "message": "GenUx AI is running"}

@app.get("/")
async def root():
    return {"message": "GenUx - UX Layout AI Generator", "docs": "/docs"}