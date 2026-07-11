import sys
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw


def main() -> None:
    pdf_path = Path(sys.argv[1])
    start = int(sys.argv[2])
    count = int(sys.argv[3])
    out_path = Path(sys.argv[4])

    pdf = pdfium.PdfDocument(str(pdf_path))
    end = min(len(pdf), start + count)
    thumbs = []

    for i in range(start, end):
        page = pdf[i]
        bitmap = page.render(scale=0.25).to_pil().convert("RGB")
        bitmap.thumbnail((360, 240))
        thumbs.append((i + 1, bitmap.copy()))
        page.close()

    cols = 3
    rows = (len(thumbs) + cols - 1) // cols
    out = Image.new("RGB", (cols * 400, rows * 290), (20, 20, 20))
    draw = ImageDraw.Draw(out)

    for idx, (num, image) in enumerate(thumbs):
        x = (idx % cols) * 400 + 20
        y = (idx // cols) * 290 + 34
        draw.text((x, y - 26), f"PAGE {num}", fill=(220, 220, 220))
        out.paste(image, (x, y))

    out.save(out_path, quality=92)


if __name__ == "__main__":
    main()
