import re

file_path = r"d:\Personal_Coding\Personal_Portfolio_VuTriDung_V2\sakura-portfolio\app\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern1 = r'<div className="carousel-wrapper" style={{ marginBottom: "30px" }}><button className="nav-btn prev-btn" onClick=\{\(\) => scrollCarousel\("lang-certs", -1\)\}>&#10094;</button><div className="carousel-container" id="lang-certs">'
repl1 = '''                  <div
                    className="grid-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "30px",
                      marginBottom: "50px",
                    }}
                  >'''
content = re.sub(pattern1, repl1, content)

pattern2 = r'<div className="carousel-wrapper" style={{ marginBottom: "30px" }}><button className="nav-btn prev-btn" onClick=\{\(\) => scrollCarousel\("tech-certs", -1\)\}>&#10094;</button><div className="carousel-container" id="tech-certs">'
content = re.sub(pattern2, repl1, content)

pattern3 = r'<div className="carousel-wrapper" style={{ marginBottom: "30px" }}><button className="nav-btn prev-btn" onClick=\{\(\) => scrollCarousel\("other-certs", -1\)\}>&#10094;</button><div className="carousel-container" id="other-certs">'
content = re.sub(pattern3, repl1, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Restored opening tags")
