This is will inject the content_script into all pages declaratively. Currently we inject on demand in
background.ts to limit to potentional CSS conflicts.
```json
{
    "content_scripts" : [
        {
            "matches": [ "<all_urls>" ],
            "js": ["content.js"],
            "run_at": "document_idle"
        }
    ]
}
```