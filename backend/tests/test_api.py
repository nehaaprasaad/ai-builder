import numpy as np
from fastapi.testclient import TestClient

from app import main


class DummyModel:
    def encode(
        self,
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        **kwargs,
    ):
        vectors = []
        for text in texts:
            t = text.lower()
            vectors.append(
                [
                    1.0 if "rasayana" in t else 0.1,
                    1.0 if "triphala" in t else 0.1,
                    1.0 if "ashwagandha" in t else 0.1,
                    float(len(t) % 17) / 17.0,
                ]
            )
        arr = np.array(vectors, dtype=np.float32)
        if normalize_embeddings:
            norms = np.linalg.norm(arr, axis=1, keepdims=True)
            norms[norms == 0.0] = 1.0
            arr = arr / norms
        return arr


def setup_module():
    # Avoid downloading the transformer during tests.
    main.get_model.cache_clear()
    main.get_corpus_embeddings.cache_clear()
    main.get_model = lambda: DummyModel()
    main.get_corpus_embeddings = lambda: main.get_model().encode(
        [doc.text for doc in main.CORPUS],
        convert_to_numpy=True,
        normalize_embeddings=True,
    )


client = TestClient(main.app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_returns_structured_payload():
    payload = {
        "text": (
            "Triphala churna was administered before meals. "
            "Rasayana principles were discussed with Ojas and Agni references. "
            "Charaka Samhita context was included for interpretation."
        )
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data["score"], int)
    assert data["scoreBand"] in {"low", "medium", "high"}
    assert isinstance(data["segments"], list)
    assert len(data["segments"]) >= 1
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) >= 1
    assert "processingMs" in data


def test_analyze_validates_short_text():
    response = client.post("/analyze", json={"text": "too short"})
    assert response.status_code == 422
