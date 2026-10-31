import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.routers.products import (
    build_google_product_search_query,
    build_google_product_search_url,
    normalize_product_identity_key,
    are_exact_product_variants,
    deduplicate_products,
    ProductRecord,
    ProductVerification
)

client = TestClient(app)

def test_google_search_query_generation():
    """Test standard query format: [Brand] [Name] [Variant] [Size] buy"""
    query = build_google_product_search_query(
        brand="Minimalist",
        name="Niacinamide 10% Serum",
        variant="10% Niacinamide + Zinc",
        size="30ml"
    )
    assert "Minimalist" in query
    assert "Niacinamide" in query
    assert "30ml" in query
    assert query.endswith("buy")
    # Verify no triple repetition of Minimalist
    assert query.lower().count("minimalist") == 1

def test_google_search_url_safe_percent_encoding():
    """
    Test that %, +, &, spaces are safely encoded according to RFC-3986 so search engines
    do not misinterpret special characters or fail.
    """
    query = "Minimalist Niacinamide 10% + Zinc 1% Serum 30ml buy"
    url = build_google_product_search_url(query)
    
    assert url.startswith("https://www.google.com/search?q=")
    # % must be encoded as %25
    assert "%25" in url
    # Ensure raw '%' doesn't appear alone as an unescaped escape sequence
    assert " 10% " not in url
    # Ensure purchase intent keyword is preserved in the URL
    assert "buy" in url

def test_exact_variant_distinction():
    """
    Different formulations (10% vs 5%) and sizes (30ml vs 50ml) MUST NOT be merged or conflated.
    """
    p_10_30 = {
        "brand": "Minimalist",
        "name": "Niacinamide Serum",
        "variant": "10% Niacinamide + Zinc PCA",
        "size": "30ml"
    }
    p_5_30 = {
        "brand": "Minimalist",
        "name": "Niacinamide Serum",
        "variant": "5% Niacinamide + Hyaluronic Acid",
        "size": "30ml"
    }
    p_10_50 = {
        "brand": "Minimalist",
        "name": "Niacinamide Serum",
        "variant": "10% Niacinamide + Zinc PCA",
        "size": "50ml"
    }
    
    # Same product identity
    assert are_exact_product_variants(p_10_30, p_10_30.copy()) is True
    # Different formulation variants MUST NOT match
    assert are_exact_product_variants(p_10_30, p_5_30) is False
    # Different sizes MUST NOT match
    assert are_exact_product_variants(p_10_30, p_10_50) is False

def test_product_deduplication():
    """
    Test deduplication by identity key and preferring verified image records.
    """
    products = [
        {
            "brand": "CeraVe",
            "name": "Moisturizing Cream",
            "variant": "Standard",
            "size": "454g",
            "image_url": None,
            "verification": {"verified_image": False}
        },
        {
            "brand": "CeraVe",
            "name": "Moisturizing Cream",
            "variant": "Standard",
            "size": "454g",
            "image_url": "https://images.openbeautyfacts.org/images/cerave.jpg",
            "verification": {"verified_image": True}
        },
        {
            "brand": "CeraVe",
            "name": "Hydrating Cleanser",
            "variant": "Standard",
            "size": "236ml",
            "image_url": "https://images.openbeautyfacts.org/images/cleanser.jpg",
            "verification": {"verified_image": True}
        }
    ]
    
    deduped = deduplicate_products(products)
    assert len(deduped) == 2
    # Verify the one with verified image was kept for Moisturizing Cream
    cream = next(p for p in deduped if p["name"] == "Moisturizing Cream")
    assert cream["image_url"] == "https://images.openbeautyfacts.org/images/cerave.jpg"
    assert cream["verification"]["verified_image"] is True

def test_missing_price_handling():
    """
    Missing price must be represented as None, not fabricated or converted to 0.
    """
    p = ProductRecord(
        id="prod-test-unpriced",
        brand="Sebamed",
        name="Clear Face Care Gel",
        category="Moisturizer",
        price=None, # Verified: price is None when unlisted
        verification=ProductVerification(
            verified_identity=True,
            verified_price=False
        )
    )
    assert p.price is None
    assert p.verification.verified_price is False

def test_google_search_url_endpoint():
    """Test API endpoint GET /api/products/google-search-url"""
    response = client.get("/api/products/google-search-url", params={
        "brand": "Minimalist",
        "name": "Niacinamide 10% Serum",
        "variant": "10% Formulation",
        "size": "30ml"
    })
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "url" in data
    assert "https://www.google.com/search?q=" in data["url"]
    assert "Minimalist" in data["query"]
    assert "buy" in data["query"]
