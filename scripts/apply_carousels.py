import re

def process_section(text, var_name, cid, is_inside_ternary):
    if is_inside_ternary:
        # Pattern:
        # {var_name.length > 0 ? (
        #   <div ... display: "grid" ... >
        #     {var_name.map(...
        
        # We want to replace `<div ... display: "grid" ... >`
        # with `<div className="carousel-wrapper"><button .../><div className="carousel-container" id="{cid}">`
        pattern_open = r'(<div[^>]*?display:\s*"grid"[^>]*?>)'
        
        # We need to find the specific block for `var_name`.
        # Locate `{var_name.length > 0 ? (`
        start_idx = text.find(f"{{{var_name}.length > 0 ? (")
        if start_idx == -1: return text
        
        # Find the next `<div` after start_idx
        div_start = text.find("<div", start_idx)
        # Find the closing `>` of this div
        div_end = text.find(">", div_start) + 1
        
        original_div = text[div_start:div_end]
        if 'display: "grid"' in original_div or 'display:"grid"' in original_div.replace(" ", ""):
            # Replace it!
            replacement = f'<div className="carousel-wrapper" style={{{{ marginBottom: "30px" }}}}><button className="nav-btn prev-btn" onClick={{() => scrollCarousel("{cid}", -1)}}>&#10094;</button><div className="carousel-container" id="{cid}">'
            text = text[:div_start] + replacement + text[div_end:]
            
            # Now we need to find the closing </div> of this grid.
            # It's right before the `) : (`
            # Find the next `) : (` after div_start
            colon_idx = text.find(") : (", div_start)
            if colon_idx != -1:
                # Go backwards from colon_idx to find the closing </div>
                close_div_idx = text.rfind("</div>", div_start, colon_idx)
                if close_div_idx != -1:
                    repl_close = f'</div><button className="nav-btn next-btn" onClick={{() => scrollCarousel("{cid}", 1)}}>&#10095;</button></div>'
                    text = text[:close_div_idx] + repl_close + text[close_div_idx+6:]
        return text
    else:
        # Pattern:
        # <div ... display: "grid" ... >
        #   {var_name.length > 0 ? (
        
        start_idx = text.find(f"{{{var_name}.length > 0 ? (")
        if start_idx == -1: return text
        
        # Go backwards to find the `<div` that opens this section
        div_start = text.rfind("<div", 0, start_idx)
        div_end = text.find(">", div_start) + 1
        
        original_div = text[div_start:div_end]
        if 'display: "grid"' in original_div or 'display:"grid"' in original_div.replace(" ", ""):
            # Replace it!
            replacement = f'<div className="carousel-wrapper" style={{{{ marginBottom: "30px" }}}}><button className="nav-btn prev-btn" onClick={{() => scrollCarousel("{cid}", -1)}}>&#10094;</button><div className="carousel-container" id="{cid}">'
            text = text[:div_start] + replacement + text[div_end:]
            
            # Now we need to find the closing </div> of this grid.
            # It's AFTER the EmptyState. The EmptyState ends with `/>\n   )}` or similar.
            # Let's find `)}` after start_idx
            # Note: start_idx has shifted! So we must find it again.
            start_idx = text.find(f"{{{var_name}.length > 0 ? (")
            # Find `)}` which closes the ternary
            
            # To be safe, let's count brackets from `{var_name.length`
            count = 0
            end_idx = -1
            for i in range(start_idx, len(text)):
                if text[i] == '{': count += 1
                elif text[i] == '}':
                    count -= 1
                    if count == 0:
                        end_idx = i
                        break
            
            if end_idx != -1:
                # The next </div> after end_idx is our target
                close_div_idx = text.find("</div>", end_idx)
                if close_div_idx != -1:
                    repl_close = f'</div><button className="nav-btn next-btn" onClick={{() => scrollCarousel("{cid}", 1)}}>&#10095;</button></div>'
                    text = text[:close_div_idx] + repl_close + text[close_div_idx+6:]
        return text

file_path = r"d:\Personal_Coding\Personal_Portfolio_VuTriDung_V2\sakura-portfolio\app\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# is_inside_ternary = True means {var.length > 0 ? ( <div display="grid"> ...
# is_inside_ternary = False means <div display="grid"> {var.length > 0 ? ( ...

# From our previous analysis:
# dbAchievements: INSIDE
# latestPosts: INSIDE
# dbItEvents: INSIDE
# dbOtherEvents: INSIDE
# filteredData: INSIDE

# dbLangCerts: OUTSIDE
# dbTechCerts: OUTSIDE
# dbOtherCerts: OUTSIDE

content = process_section(content, "dbLangCerts", "lang-certs", False)
content = process_section(content, "dbTechCerts", "tech-certs", False)
content = process_section(content, "dbOtherCerts", "other-certs", False)

content = process_section(content, "dbAchievements", "achievements", True)
content = process_section(content, "latestPosts", "blog-posts", True)
content = process_section(content, "dbItEvents", "it-events", True)
content = process_section(content, "dbOtherEvents", "other-events", True)
content = process_section(content, "filteredData", "cat.id", True)

# Fix cat.id quotes
content = content.replace('scrollCarousel("cat.id", -1)', 'scrollCarousel(cat.id, -1)')
content = content.replace('scrollCarousel("cat.id", 1)', 'scrollCarousel(cat.id, 1)')
content = content.replace('id="cat.id"', 'id={cat.id}')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Applied Carousels")
