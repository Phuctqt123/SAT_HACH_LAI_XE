import json

TOTAL_REQUIRED = 600
JSON_FILE = "questions.json"


def load_questions(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def collect_question_ids(data):
    ids = []

    for chapter in data:
        for q in chapter.get("questions", []):
            if isinstance(q.get("id"), int):
                ids.append(q["id"])

    return sorted(ids)


def main():
    data = load_questions(JSON_FILE)
    ids = collect_question_ids(data)

    total = len(ids)
    unique_ids = set(ids)

    print("====== KIỂM TRA SỐ CÂU ======")
    print(f"Tổng số câu tìm được : {total}")
    print(f"Số câu không trùng ID: {len(unique_ids)}")

    if len(unique_ids) >= TOTAL_REQUIRED:
        print("✅ ĐÃ ĐỦ 600 CÂU")
    else:
        print("❌ CHƯA ĐỦ 600 CÂU")

    # tìm câu thiếu
    expected = set(range(1, TOTAL_REQUIRED + 1))
    missing = sorted(expected - unique_ids)

    print("\n====== DANH SÁCH CÂU THIẾU ======")
    if not missing:
        print("🎉 Không thiếu câu nào")
    else:
        print(f"Tổng số câu thiếu: {len(missing)}")
        print("Các câu bị thiếu:")
        print(", ".join(map(str, missing)))


if __name__ == "__main__":
    main()
