from __future__ import annotations
import json
import time

from app.config import settings


class AIConfigError(Exception):
    """Raised when no API key is configured. Callers should surface this as a clear
    'AI not configured' error rather than pretending generation worked."""


class AIGenerationError(Exception):
    pass


def _generate_groq_json(system_prompt: str, user_prompt: str) -> tuple[dict, str, int]:
    from groq import Groq
    if not settings.GROQ_API_KEY:
        raise AIConfigError("GROQ_API_KEY is not set.")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    start = time.monotonic()
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt + "\n\nRespond with ONLY valid JSON, no markdown fences, no commentary."},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        raise AIGenerationError(f"Groq LLM request failed: {exc}") from exc

    latency_ms = int((time.monotonic() - start) * 1000)
    raw = response.choices[0].message.content or ""
    return _parse_json(raw), settings.GROQ_MODEL, latency_ms


def _generate_openai_json(system_prompt: str, user_prompt: str) -> tuple[dict, str, int]:
    from openai import OpenAI
    if not settings.OPENAI_API_KEY:
        raise AIConfigError("OPENAI_API_KEY is not set.")
    
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    start = time.monotonic()
    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt + "\n\nRespond with ONLY valid JSON, no markdown fences, no commentary."},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        raise AIGenerationError(f"OpenAI LLM request failed: {exc}") from exc

    latency_ms = int((time.monotonic() - start) * 1000)
    raw = response.choices[0].message.content or ""
    return _parse_json(raw), settings.OPENAI_MODEL, latency_ms


def _generate_gemini_json(system_prompt: str, user_prompt: str) -> tuple[dict, str, int]:
    import google.generativeai as genai
    if not settings.GEMINI_API_KEY:
        raise AIConfigError("GEMINI_API_KEY is not set.")
    
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        generation_config={
            "temperature": 0.2,
            "response_mime_type": "application/json",
        },
        system_instruction=system_prompt + "\n\nRespond with ONLY valid JSON, no markdown fences, no commentary."
    )
    
    start = time.monotonic()
    try:
        response = model.generate_content(user_prompt)
    except Exception as exc:
        raise AIGenerationError(f"Gemini request failed: {exc}") from exc

    latency_ms = int((time.monotonic() - start) * 1000)
    raw = response.text or ""
    return _parse_json(raw), settings.GEMINI_MODEL, latency_ms


def _parse_json(raw: str) -> dict:
    try:
        # Strip markdown fences if the LLM leaked them despite prompts
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:])
            if raw.endswith("```"):
                raw = "\n".join(raw.split("\n")[:-1])
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise AIGenerationError(f"LLM did not return valid JSON: {exc}") from exc


def generate_json(system_prompt: str, user_prompt: str) -> tuple[dict, str, int]:
    """Calls the active LLM provider and asks for JSON-only output."""
    provider = settings.ACTIVE_AI_PROVIDER.lower()
    
    if provider == "groq":
        return _generate_groq_json(system_prompt, user_prompt)
    elif provider == "openai":
        return _generate_openai_json(system_prompt, user_prompt)
    elif provider == "gemini":
        return _generate_gemini_json(system_prompt, user_prompt)
    else:
        raise AIConfigError(f"Unsupported ACTIVE_AI_PROVIDER: {provider}")
