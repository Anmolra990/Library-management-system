import { useEffect, useState, type FormEvent } from "react";
import type { BookInput } from "../types/books";

const emptyBook: BookInput = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  description: "",
  imageUrl: "",
  totalCopies: 1,
  availableCopies: 1,
};

type BookFormProps = {
  initial?: BookInput;
  submitLabel: string;
  onSubmit: (values: BookInput) => Promise<void>;
  onCancel?: () => void;
};

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as {
      response?: { data?: { message?: string } };
    }).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return error instanceof Error ? error.message : "Unable to save book.";
}

export default function BookForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [values, setValues] = useState<BookInput>(
    initial ?? emptyBook
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setValues(initial);
    }
  }, [initial]);

  const updateField = <K extends keyof BookInput>(
    field: K,
    value: BookInput[K]
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !values.title.trim() ||
      !values.author.trim() ||
      !values.isbn.trim() ||
      !values.category.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (values.totalCopies < 1) {
      setError("Total copies must be at least 1.");
      return;
    }

    if (values.availableCopies < 0) {
      setError("Available copies cannot be negative.");
      return;
    }

    if (values.availableCopies > values.totalCopies) {
      setError(
        "Available copies cannot be greater than total copies."
      );
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        author: values.author.trim(),
        isbn: values.isbn.trim(),
        category: values.category.trim(),
        description: values.description?.trim() ?? "",
        imageUrl: values.imageUrl?.trim() ?? "",
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white">
        <h2 className="text-xl font-bold">Book information</h2>
        <p className="mt-1 text-sm text-indigo-100">
          Add or update the details of this library book.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Book title *
            <input
              className={inputClass}
              value={values.title}
              placeholder="Example: Atomic Habits"
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Author *
            <input
              className={inputClass}
              value={values.author}
              placeholder="Example: James Clear"
              onChange={(event) =>
                updateField("author", event.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            ISBN *
            <input
              className={inputClass}
              value={values.isbn}
              placeholder="Example: 9780735211292"
              onChange={(event) =>
                updateField("isbn", event.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Category *
            <input
              className={inputClass}
              value={values.category}
              placeholder="Example: Self-help"
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Total copies *
            <input
              type="number"
              min="1"
              className={inputClass}
              value={values.totalCopies}
              onChange={(event) =>
                updateField(
                  "totalCopies",
                  Number(event.target.value) || 0
                )
              }
              required
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Available copies *
            <input
              type="number"
              min="0"
              max={values.totalCopies}
              className={inputClass}
              value={values.availableCopies}
              onChange={(event) =>
                updateField(
                  "availableCopies",
                  Number(event.target.value) || 0
                )
              }
              required
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            rows={5}
            className={`${inputClass} resize-y`}
            value={values.description ?? ""}
            placeholder="Write a short description of the book..."
            onChange={(event) =>
              updateField("description", event.target.value)
            }
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Cover image URL
          <input
            type="url"
            className={inputClass}
            value={values.imageUrl ?? ""}
            placeholder="https://example.com/book-cover.jpg"
            onChange={(event) =>
              updateField("imageUrl", event.target.value)
            }
          />
          <span className="mt-2 block text-xs font-normal text-slate-500">
            Paste a public image link or choose an image from your computer.
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-3 block w-full text-sm font-normal text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:font-semibold file:text-sky-700 hover:file:bg-sky-100"
            onChange={(event) => {
              const imageFile = event.target.files?.[0];
              if (imageFile) {
                updateField("imageFile", imageFile);
                updateField("imageUrl", URL.createObjectURL(imageFile));
              }
            }}
          />
          {values.imageUrl && (
            <img
              src={values.imageUrl}
              alt="Book cover preview"
              className="mt-3 h-40 w-28 rounded-xl object-cover shadow-sm"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}