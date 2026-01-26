import pdfplumber
import re
import json


def has_real_underline(row_chars, lines):
    text_bottom = max(c["bottom"] for c in row_chars)

    for ln in lines:
        if ln.get("height", 0) < 1:
            if abs(ln["top"] - text_bottom) < 3 and ln["width"] > 30:
                return True
    return False


def pdf_to_json(pdf_path, output_json):
    chapters = []
    current_chapter = None
    current_question = None
    pending_chapter_title = []

    # ===== thêm cho xử lý câu hỏi nhiều dòng =====
    question_buffer = ""
    reading_question = False

    with pdfplumber.open(pdf_path) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            chars = page.chars
            lines = page.lines + page.rects

            rows = {}
            for c in chars:
                y = round(c["top"], 1)
                rows.setdefault(y, []).append(c)

            for y in sorted(rows):
                row_chars = rows[y]
                text = "".join(c["text"] for c in row_chars).strip()

                if not text:
                    continue

                # ===== CHƯƠNG =====
                chap_match = re.match(
                    r"CHƯƠNG\s+([IVXLCDM]+)\.\s*(.*)",
                    text,
                    re.IGNORECASE
                )
                if chap_match:
                    current_chapter = {
                        "id": chap_match.group(1),
                        "title": "",
                        "page": page_no,
                        "questions": []
                    }
                    chapters.append(current_chapter)
                    pending_chapter_title = [chap_match.group(2).strip()]
                    continue

                # ===== TIÊU ĐỀ CHƯƠNG NHIỀU DÒNG =====
                if (
                    current_chapter
                    and pending_chapter_title
                    and not text.startswith("Câu")
                ):
                    pending_chapter_title.append(text)
                    current_chapter["title"] = " ".join(
                        pending_chapter_title
                    ).strip()
                    continue

                # ===== CÂU HỎI (DÒNG ĐẦU) =====
                q_match = re.match(r"Câu\s+(\d+)[\.:]\s*(.*)", text)

                if q_match and current_chapter:
                    current_question = {
                        "id": int(q_match.group(1)),
                        "question": "",
                        "options": [],
                        "page": page_no
                    }
                    current_chapter["questions"].append(current_question)

                    question_buffer = q_match.group(2).strip()
                    reading_question = True
                    pending_chapter_title = []

                    # nếu dòng đầu đã có dấu ?
                    if question_buffer.endswith("?"):
                        current_question["question"] = question_buffer
                        reading_question = False

                    continue

                # ===== CÂU HỎI XUỐNG DÒNG =====
                if reading_question and current_question:
                    question_buffer += " " + text

                    if "?" in text:
                        current_question["question"] = question_buffer.strip()
                        reading_question = False

                    continue

                # ===== ĐÁP ÁN =====
                opt_match = re.match(r"(\d+)\.\s*(.*)", text)
                if opt_match and current_question and not reading_question:
                    is_correct = has_real_underline(row_chars, lines)

                    current_question["options"].append({
                        "key": opt_match.group(1),
                        "text": opt_match.group(2),
                        "is_correct": is_correct
                    })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(chapters, f, ensure_ascii=False, indent=2)

    print("✅ Xuất JSON thành công – đã xử lý câu hỏi xuống dòng")


if __name__ == "__main__":
    pdf_path = "sathachlaixe.pdf"
    output_json = "questions.json"
    pdf_to_json(pdf_path, output_json)
