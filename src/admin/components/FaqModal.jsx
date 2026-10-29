import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import axiosClient from "../../utils/axiosClient";

const NEW = "__new__";

// add / edit dialog; `faq` is {} for a new one, { newCategory: true } to start a new category.
export default function FaqModal({ faq, categories, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState({
    category: faq.newCategory ? "" : (faq.category ?? categories[0] ?? ""),
    question: faq.question ?? "",
    answer: faq.answer ?? "",
    featured: faq.featured ?? false,
  });
  const [isNew, setIsNew] = useState(Boolean(faq.newCategory) || categories.length === 0);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickCategory = (e) => {
    const isNewPick = e.target.value === NEW;
    setIsNew(isNewPick);
    setForm((f) => ({ ...f, category: isNewPick ? "" : e.target.value }));
  };

  const save = async () => {
    const data = {
      category: form.category.trim(),
      question: form.question.trim(),
      answer: form.answer.trim(),
      featured: form.featured,
    };
    if (faq.id) await axiosClient.put(`/faqs/${faq.id}`, data);
    else await axiosClient.post('/faqs', { ...data, order: nextOrder });
    onSaved();
  };

  return (
    <Modal title={faq.id ? "Edit FAQ" : "Add FAQ"} onClose={onClose} onSave={save}>
      <Field label="Category">
        <select value={isNew ? NEW : form.category} onChange={pickCategory}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value={NEW}>+ New category…</option>
        </select>
      </Field>
      {isNew && (
        <Field label="New category name">
          <input value={form.category} onChange={set("category")} required autoFocus />
        </Field>
      )}
      <Field label="Question">
        <input value={form.question} onChange={set("question")} required />
      </Field>
      <Field label="Answer">
        <textarea rows="5" value={form.answer} onChange={set("answer")} required />
      </Field>
      <label className="ad-check">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
        />
        Show on the home page
      </label>
    </Modal>
  );
}
