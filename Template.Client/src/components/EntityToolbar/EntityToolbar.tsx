import { useRef, useState } from "react";
import { SearchInput, Dropdown, Button } from "solstice-ui";
import styles from "./EntityToolbar.module.css";
import { ToolbarFilterConfig, ToolbarSortField } from "@/models";

interface EntityToolbarProps {
  searchPlaceholder?: string;
  initialSearch?: string;
  filters?: ToolbarFilterConfig[];
  sortFields?: ToolbarSortField[];
  loading?: boolean;
  onApply: (args: {
    searchTerm: string;
    filters: Record<string, string>;
    sortColumn?: string;
    ascending?: boolean;
  }) => void | Promise<unknown>;
  onClear?: () => void | Promise<unknown>;
}

function EntityToolbar({
  searchPlaceholder = "Search...",
  initialSearch = "",
  filters = [],
  sortFields = [],
  loading = false,
  onApply,
  onClear,
}: EntityToolbarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(() =>
    filters.reduce<Record<string, string>>((acc, f) => {
      acc[f.key] = "";
      return acc;
    }, {})
  );
  const [selectedSortField, setSelectedSortField] = useState<
    string | undefined
  >(sortFields[0]?.key);
  const [ascending, setAscending] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyChanges = async () => {
    try {
      setSubmitting(true);
      await onApply({
        searchTerm,
        filters: localFilters,
        sortColumn: selectedSortField,
        ascending,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clearChanges = () => {
    setSearchTerm("");
    setLocalFilters((prev) => {
      const next: Record<string, string> = {};
      Object.keys(prev).forEach((k) => (next[k] = ""));
      return next;
    });
    setSelectedSortField(sortFields[0]?.key);
    setAscending(false);

    if (onClear) onClear();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <div className={styles.search}>
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={setSearchTerm}
            className={styles.fullWidth}
          />
        </div>

        <div className={styles.filters}>
          {filters.map((f) => (
            <Dropdown
              key={f.key}
              label={f.label}
              value={localFilters[f.key] ?? ""}
              options={f.options}
              placeholderOption="All"
              onValueChange={(v: string) => handleFilterChange(f.key, v)}
              className={styles.filter}
            />
          ))}
        </div>
      </div>

      {sortFields.length > 0 && (
        <div className={styles.chips} ref={sortRef}>
          {sortFields.map((f) => (
            <button
              key={f.key}
              type="button"
              className={
                styles.chip +
                (selectedSortField === f.key ? " " + styles.active : "")
              }
              onClick={() => setSelectedSortField(f.key)}
              aria-pressed={selectedSortField === f.key}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            className={styles.chip + (ascending ? " " + styles.active : "")}
            onClick={() => setAscending((v) => !v)}
            aria-pressed={ascending}
            title="Toggle ascending"
          >
            {ascending ? "Ascending" : "Descending"}
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChanges}
          className={styles.clearBtn}
          disabled={loading || submitting}
        >
          Clear
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={applyChanges}
          className={styles.applyBtn}
          loading={loading || submitting}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

export default EntityToolbar;
