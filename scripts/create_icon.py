from PIL import Image, ImageDraw

size = 1024
img = Image.new("RGB", (size, size), "#0B1020")
d = ImageDraw.Draw(img)
cyan = "#52D6FF"
lime = "#B8F36B"
white = "#F7F8FC"
w = 42
margin = 190
length = 190
# camera-style corner brackets
d.line([(margin, margin + length), (margin, margin), (margin + length, margin)], fill=cyan, width=w)
d.line([(size-margin-length, margin), (size-margin, margin), (size-margin, margin+length)], fill=cyan, width=w)
d.line([(margin, size-margin-length), (margin, size-margin), (margin+length, size-margin)], fill=cyan, width=w)
d.line([(size-margin-length, size-margin), (size-margin, size-margin), (size-margin, size-margin-length)], fill=cyan, width=w)
# dimension line and arrow heads
y = size // 2
left, right = 270, size - 270
d.line([(left, y), (right, y)], fill=lime, width=28)
d.polygon([(left, y), (left+62, y-38), (left+62, y+38)], fill=lime)
d.polygon([(right, y), (right-62, y-38), (right-62, y+38)], fill=lime)
# reference points
d.ellipse((size//2-18, size//2-18, size//2+18, size//2+18), fill=white)
img.save("assets/images/icon.png")
img.save("assets/images/splash-icon.png")
img.save("assets/images/favicon.png")
img.save("assets/images/android-icon-foreground.png")
