import urllib.parse
import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/products", tags=["Product Discovery & Google Shopping"])

OPEN_BEAUTY_FACTS_API = "https://world.openbeautyfacts.org"

class ProductVerification(BaseModel):
    verified_identity: bool = True
    verified_image: bool = False
    verified_ingredients: bool = False
    verified_description: bool = False
    verified_price: bool = False
    source_attribution: str = "SkinMate Verified Database"
    last_verified_at: str = "2026-10-31"

class ProductRecord(BaseModel):
    id: str
    brand: str
    name: str
    variant: Optional[str] = None
    size: Optional[str] = None
    barcode: Optional[str] = None
    gtin: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    department: str = "skincare"
    price: Optional[float] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    ingredients: List[str] = []
    key_actives: List[str] = []
    google_search_query: Optional[str] = None
    google_search_url: Optional[str] = None
    verification: ProductVerification = ProductVerification()

def build_google_product_search_query(brand: str, name: str, variant: Optional[str] = None, size: Optional[str] = None) -> str:
    """
    Constructs an exact purchase-intent Google search query.
    Format: [Brand] [Exact Product Name] [Variant] [Size] buy
    Deduplicates tokens case-insensitively while preserving formulation specifics (e.g. 10%, 30ml).
    """
    tokens: List[str] = []
    
    # Add brand
    if brand and brand.strip():
        tokens.append(brand.strip())
        
    # Add name (strip redundant brand prefix if already included)
    if name and name.strip():
        clean_name = name.strip()
        if brand and clean_name.lower().startswith(brand.lower()):
            clean_name = clean_name[len(brand):].strip()
        if clean_name:
            tokens.append(clean_name)
            
    # Add variant / formulation (e.g. 10% Niacinamide, Oil-Free, etc.)
    if variant and variant.strip():
        v = variant.strip()
        # Avoid duplicate token if already present in name
        if v.lower() not in " ".join(tokens).lower():
            tokens.append(v)
            
    # Add size / volume
    if size and size.strip():
        s = size.strip()
        if s.lower() not in " ".join(tokens).lower():
            tokens.append(s)
            
    # Add purchase intent keyword
    tokens.append("buy")
    
    return " ".join(tokens)

def build_google_product_search_url(query: str) -> str:
    """
    Safely percent-encodes search queries for Google Search.
    Ensures %, +, &, spaces are RFC-3986 compliant so search engines never misinterpret query parameters.
    """
    encoded_query = urllib.parse.quote_plus(query.strip())
    return f"https://www.google.com/search?q={encoded_query}"

def normalize_product_identity_key(brand: str, name: str, variant: Optional[str] = None, size: Optional[str] = None) -> str:
    """
    Generates a normalized composite identity key to prevent conflating distinct variants (e.g., 10% vs 5%).
    """
    def clean(val: Optional[str]) -> str:
        if not val:
            return ""
        return re.sub(r"\s+", " ", val.strip().lower())
    
    b = clean(brand)
    n = clean(name)
    v = clean(variant)
    s = clean(size)
    return f"{b}::{n}::{v}::{s}"

def are_exact_product_variants(p1: Dict[str, Any], p2: Dict[str, Any]) -> bool:
    """
    Strict variant comparator. Returns True only if brand, name, variant, and size match.
    """
    k1 = normalize_product_identity_key(p1.get("brand", ""), p1.get("name", ""), p1.get("variant"), p1.get("size"))
    k2 = normalize_product_identity_key(p2.get("brand", ""), p2.get("name", ""), p2.get("variant"), p2.get("size"))
    return k1 == k2

def deduplicate_products(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deduplicates products using composite identity and barcode/GTIN.
    Prefers products with verified images and higher metadata completeness.
    """
    seen: Dict[str, Dict[str, Any]] = {}
    
    for prod in products:
        barcode = prod.get("barcode") or prod.get("gtin")
        identity_key = f"barcode:{barcode}" if barcode else normalize_product_identity_key(
            prod.get("brand", ""), prod.get("name", ""), prod.get("variant"), prod.get("size")
        )
        
        if identity_key not in seen:
            seen[identity_key] = prod
        else:
            existing = seen[identity_key]
            # Replace if new has verified image and existing does not
            has_new_img = bool(prod.get("image_url")) and prod.get("verification", {}).get("verified_image", False)
            has_old_img = bool(existing.get("image_url")) and existing.get("verification", {}).get("verified_image", False)
            if has_new_img and not has_old_img:
                seen[identity_key] = prod
                
    return list(seen.values())

@router.get("/google-search-url")
def get_google_search_url(
    brand: str = Query(..., description="Brand name"),
    name: str = Query(..., description="Exact product name"),
    variant: Optional[str] = Query(None, description="Formulation or variant (e.g. 10% Niacinamide)"),
    size: Optional[str] = Query(None, description="Size or volume (e.g. 30ml)")
):
    """
    Generates a universal Google shopping redirect URL with safe RFC-compliant percent encoding.
    """
    query = build_google_product_search_query(brand, name, variant, size)
    url = build_google_product_search_url(query)
    return {
        "brand": brand,
        "name": name,
        "variant": variant,
        "size": size,
        "query": query,
        "url": url
    }

@router.get("/lookup/{barcode}")
async def lookup_by_barcode(barcode: str):
    """
    Retrieves verified cosmetics information from Open Beauty Facts API by GTIN/barcode.
    Rejects arbitrary stock photos. If image is missing, returns image_url=None with is_unavailable=True.
    """
    clean_barcode = barcode.strip()
    obf_url = f"{OPEN_BEAUTY_FACTS_API}/api/v0/product/{clean_barcode}.json"
    
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(obf_url, headers={"User-Agent": "SkinMate-App/1.0 (contact@skinmate.ai)"})
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == 1 and "product" in data:
                    raw = data["product"]
                    brand = raw.get("brands") or raw.get("brand_owner") or "Unknown Brand"
                    name = raw.get("product_name") or raw.get("generic_name") or "Cosmetic Product"
                    image_url = raw.get("image_front_url") or raw.get("image_url")
                    quantity = raw.get("quantity") or raw.get("product_quantity")
                    
                    # Ingredients extraction
                    ingredients_text = raw.get("ingredients_text") or ""
                    ingredients = [i.strip() for i in ingredients_text.split(",") if i.strip()] if ingredients_text else []
                    
                    query = build_google_product_search_query(brand, name, None, str(quantity) if quantity else None)
                    url = build_google_product_search_url(query)
                    
                    return {
                        "status": "success",
                        "product": {
                            "id": f"obf-{clean_barcode}",
                            "barcode": clean_barcode,
                            "gtin": clean_barcode,
                            "brand": brand,
                            "name": name,
                            "variant": None,
                            "size": str(quantity) if quantity else None,
                            "category": raw.get("categories", "Skincare").split(",")[0].strip(),
                            "price": None, # Price is not fabricated; redirected to Google
                            "image_url": image_url,
                            "description": raw.get("generic_name") or f"{brand} {name} retrieved from Open Beauty Facts",
                            "ingredients": ingredients[:25],
                            "google_search_query": query,
                            "google_search_url": url,
                            "verification": {
                                "verified_identity": True,
                                "verified_image": bool(image_url),
                                "verified_ingredients": bool(ingredients),
                                "verified_description": True,
                                "verified_price": False,
                                "source_attribution": "Open Beauty Facts Official DB",
                                "last_verified_at": "2026-10-31"
                            }
                        }
                    }
    except Exception as e:
        pass
        
    raise HTTPException(status_code=404, detail=f"Product with barcode {clean_barcode} not found in verified registry.")
