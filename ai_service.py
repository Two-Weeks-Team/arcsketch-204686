def _coerce_unstructured_payload(raw_text: str) -> Dict[str, Any]:
    compact = raw_text.strip()
    tags = [part.strip(" -•\t") for part in re.split(r",|\\n", compact) if part.strip(" -•\t")]
    return {
        "note": "Model returned plain text instead of JSON",
        "raw": compact,
        "text": compact,
        "summary": compact,
        "tags": tags[:6],
    }


import httpx
import re
import os
import json

DO_INFERENCE_KEY = os.getenv("DIGITALOCEAN_INFERENCE_KEY", "")
DO_INFERENCE_MODEL = os.getenv("DO_INFERENCE_MODEL", "openai-gpt-oss-120b")

async def call_inference(data: dict) -> dict:
    url = "https://inference.do-ai.run/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {DO_INFERENCE_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": DO_INFERENCE_MODEL,
        "messages": [
            {"role": "user", "content": json.dumps(data)}
        ],
        "temperature": 0.2,
        "max_completion_tokens": 512
    }

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()

            # Extract JSON from the response (handling markdown code blocks)
            content = result["choices"][0]["message"]["content"]
            extracted = _extract_json(content)

            return json.loads(extracted)
    except Exception as e:
        # Fallback response when AI is unavailable
        return {
            "error": {
                "code": "AI_UNAVAILABLE",
                "message": "AI service is temporarily unavailable. Please try again later.",
                "note": "The AI service is currently experiencing high demand. Your request could not be processed at this time."
            }
        }

# Helper function to extract JSON from markdown code blocks or plain text
def _extract_json(text: str) -> str:
    m = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    m = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    return text.strip()