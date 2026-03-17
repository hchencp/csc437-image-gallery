import { useState } from "react";

// 1. Accept authToken as a prop
export function ImageNameEditor({
  imageId,
  initialValue,
  onNameUpdated,
  authToken,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialValue || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleEditPressed() {
    setIsEditingName(true);
    setNameInput(initialValue || "");
    setError("");
  }

  async function handleSubmitPressed() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // 2. Add the Authorization header here
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ newName: nameInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to rename");
      }

      onNameUpdated(nameInput);
      setIsEditingName(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isEditingName) {
    return (
      <div style={{ margin: "1em 0" }} aria-live="polite">
        <label>
          New Name
          <input
            required
            disabled={isLoading}
            style={{ marginLeft: "0.5em" }}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </label>
        <button
          disabled={nameInput.length === 0 || isLoading}
          onClick={handleSubmitPressed}
        >
          {isLoading ? "Renaming..." : "Submit"}
        </button>
        <button onClick={() => setIsEditingName(false)} disabled={isLoading}>
          Cancel
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ margin: "1em 0" }}>
      <button onClick={handleEditPressed}>Edit name</button>
    </div>
  );
}
