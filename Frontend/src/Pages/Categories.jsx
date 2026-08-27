import { useEffect } from "react"
import { useLinks } from "../context/Linkcontext"

const PRESET_CATEGORIES = ["Personal", "Entertainment", "Knowledge", "Instagram"]

export default function Categories() {
  const { links, customtags, loading, error, fetchlinks } = useLinks()

  // fetch on mount if not already loaded
  useEffect(() => {
    if (links.length === 0) fetchlinks()
  }, [links.length, fetchlinks])

  // group links by preset category
  const groupedByCategory = PRESET_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = links.filter(link => link.CategoriesbyDef === cat)
    return acc
  }, {})

  // group links by custom tag
  const groupedByTag = customtags.reduce((acc, tag) => {
    acc[tag.Customcat] = links.filter(link => link.customTagId?._id === tag._id)
    return acc
  }, {})

  return (
    <div>

      <h1>Categories</h1>

      {/* loading and error states */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* preset categories section */}
      <section>
        <h2>Preset Categories</h2>
        {PRESET_CATEGORIES.map(cat => (
          <div key={cat}>

            {/* category heading with count */}
            <h3>{cat} ({groupedByCategory[cat]?.length || 0})</h3>

            {/* empty state */}
            {groupedByCategory[cat]?.length === 0 && (
              <p>No links in {cat}</p>
            )}

            {/* links in this category */}
            {groupedByCategory[cat]?.map(link => (
              <div key={link._id}>
                <p>{link.Linkdata}</p>
                <a href={link.Linkdata} target="_blank" rel="noreferrer">Open</a>
              </div>
            ))}

          </div>
        ))}
      </section>

      {/* custom tags section */}
      <section>
        <h2>Custom Tags</h2>

        {/* empty state */}
        {customtags.length === 0 && !loading && (
          <p>No custom tags yet</p>
        )}

        {customtags.map(tag => (
          <div key={tag._id}>

            {/* tag heading with count */}
            <h3>{tag.Customcat} ({groupedByTag[tag.Customcat]?.length || 0})</h3>

            {/* links in this tag */}
            {groupedByTag[tag.Customcat]?.map(link => (
              <div key={link._id}>
                <p>{link.Linkdata}</p>
                <a href={link.Linkdata} target="_blank" rel="noreferrer">Open</a>
              </div>
            ))}

          </div>
        ))}
      </section>

    </div>
  )
}
