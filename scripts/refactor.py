import re

file_path = r"d:\Personal_Coding\Personal_Portfolio_VuTriDung_V2\sakura-portfolio\app\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    {
        "id": "lang-certs",
        "var": "dbLangCerts"
    },
    {
        "id": "tech-certs",
        "var": "dbTechCerts"
    },
    {
        "id": "other-certs",
        "var": "dbOtherCerts"
    },
    {
        "id": "achievements",
        "var": "dbAchievements"
    },
    {
        "id": "it-events",
        "var": "dbItEvents"
    },
    {
        "id": "other-events",
        "var": "dbOtherEvents"
    },
    {
        "id": "blog-posts",
        "var": "latestPosts"
    }
]

for item in replacements:
    var_name = item["var"]
    cid = item["id"]
    
    # 1. Replace the opening div
    # Find the <div ...> before {var_name.length > 0 ? (
    # We use regex to find <div ...> \s* {var_name.length > 0 ? (
    pattern_open = r'(<div[^>]*?display:\s*"grid"[^>]*?>)\s*(\{' + var_name + r'\.length > 0 \? \()'
    def repl_open(match):
        return f'<div className="carousel-wrapper" style={{{{ marginBottom: "30px" }}}}><button className="nav-btn prev-btn" onClick={{() => scrollCarousel("{cid}", -1)}}>&#10094;</button><div className="carousel-container" id="{cid}">\n{match.group(2)}'
    
    content = re.sub(pattern_open, repl_open, content, flags=re.DOTALL)
    
    # 2. Replace the closing div
    # To find the closing div, we look for the EmptyState or the closing bracket of the ternary
    # For many, it's `)} \n </div>`
    # Let's search for the `)}` followed by `</div>` which closes this grid.
    # Actually, a simple regex is risky if there are nested divs. 
    # But let's look at the structure: `)} \s* </div>` after the EmptyState.
    # We will do it by finding the exact blocks and replacing them.
    # We can write a bracket matching algorithm for safety!

def process_brackets(text, var_name, cid):
    # Find the opening `{var_name.length > 0 ? (`
    start_idx = text.find(f"{{{var_name}.length > 0 ? (")
    if start_idx == -1:
        return text
    
    # Find the matching closing `}` for this `{`
    # The `{` is at start_idx
    count = 0
    end_idx = -1
    for i in range(start_idx, len(text)):
        if text[i] == '{':
            count += 1
        elif text[i] == '}':
            count -= 1
            if count == 0:
                end_idx = i
                break
                
    if end_idx != -1:
        # The next </div> after end_idx should be the one to replace
        div_idx = text.find("</div>", end_idx)
        if div_idx != -1:
            replacement = f'</div>\n<button className="nav-btn next-btn" onClick={{() => scrollCarousel("{cid}", 1)}}>&#10095;</button>\n</div>'
            text = text[:div_idx] + replacement + text[div_idx+6:]
            return text
    return text

for item in replacements:
    content = process_brackets(content, item["var"], item["id"])


# Special case for filteredData (Projects)
pattern_proj_open = r'(<div[^>]*?display:\s*"grid"[^>]*?>)\s*(\{filteredData\.length > 0 \? \()'
def repl_proj_open(match):
    return f'<div className="carousel-wrapper" style={{{{ marginBottom: "30px" }}}}><button className="nav-btn prev-btn" onClick={{() => scrollCarousel(cat.id, -1)}}>&#10094;</button><div className="carousel-container" id={{cat.id}}>\n{match.group(2)}'
content = re.sub(pattern_proj_open, repl_proj_open, content, flags=re.DOTALL)

content = process_brackets(content, "filteredData", "cat.id")
# Need to replace the literal "cat.id" with {cat.id} in the button onClick!
# Because process_brackets hardcodes "{cid}" which becomes `"cat.id"`. We want `cat.id`.
content = content.replace('scrollCarousel("cat.id", 1)', 'scrollCarousel(cat.id, 1)')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
