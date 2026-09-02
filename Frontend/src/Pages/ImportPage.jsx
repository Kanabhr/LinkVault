import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chromePreview, chromeConfirm } from "../api/importApi";
import { useLinks } from "../context/Linkcontext";

export default function ImportPage() {
  const [importedfile, setImportedfile] = useState(null);
  const [editableLinks, setEditableLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchlinks } = useLinks();
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportedfile(e.target.files[0]);
    }
  };
  const handlepreview = async () => {
    if (importedfile == null) {
      setError("Error");
      return;
    }
    setLoading(true);
    try {
      const res = chromePreview(importedfile);
      setEditableLinks(res.data.data.preview);
    } catch (err) {
      setError(err.response?.data.message || "failed to analyze file");
    } finally {
      setLoading(false);
    }
  };

  //   const handlecategorychange = (index,newValue) => {
  //   if(newValue){

  // }
}
const handleconfirm = async () => {
  if (editableLinks.length === 0) {
  }
  return (
    <>
      <div>
        <input type="file" accept=".html" name="chromeimport" id="" onChange={handleFileChange} />
        {importedfile && <p>Selected file: {importedfile.name}</p>}
        <br />
      </div>
      <div className="preview">
        {importedfile && (
          <button onClick={handlepreview} disabled={loading}>
            {loading ? "Analyzing..." : "Preview Bookmarks"}
          </button>
        )}
      </div>
      <div className="previewtable">
        {editableLinks.length > 0 && !importResult && (
          <div>
            <h3>Found {editableLinks.length} bookmarks</h3>
            <p>Review and edit categories before importing</p>

            {editableLinks.map((link, index) => (
              <div key={index}>
                <p>{link.title || link.url}</p>
                <p>{link.url}</p>
                <select value={link.category} onChange={(e) => handlecategorychange(index, e.target.value)}>
                  <option value="Personal">Personal</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Knowledge">Knowledge</option>
                  <option value="Instagram">Instagram</option>
                </select>
                <span>{link.confidence}</span>
              </div>
            ))}

            <button onClick={handleconfirm} disabled={loading}>
              {loading ? "Importing..." : `Import All ${editableLinks.length} Bookmarks`}
            </button>
          </div>
        )}
      </div>
      {/* Success screen */}
      {importResult && (
        <div>
          <h3>Import Complete</h3>
          <p>Imported: {importResult.inserted}</p>
          <p>Skipped (duplicates): {importResult.skipped}</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      )}

      {/* Error display */}
      {error && <p>{error}</p>}
    </>
  );
};
