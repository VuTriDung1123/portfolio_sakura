import re

file_path = r"d:\Personal_Coding\Personal_Portfolio_VuTriDung_V2\sakura-portfolio\app\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Undo the messed up closing tags
pattern_close = r'</div>\n<button className="nav-btn next-btn" onClick=\{\(\) => scrollCarousel\(".*?", 1\)\}>&#10095;</button>\n</div>'
content = re.sub(pattern_close, "</div>", content)

# Undo the messed up cat.id closing tag
pattern_close_cat = r'</div>\n<button className="nav-btn next-btn" onClick=\{\(\) => scrollCarousel\(cat\.id, 1\)\}>&#10095;</button>\n</div>'
content = re.sub(pattern_close_cat, "</div>", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned broken closing tags")
