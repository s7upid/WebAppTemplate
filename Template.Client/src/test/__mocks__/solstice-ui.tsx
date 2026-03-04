import React from "react";

export type TabItem = {
  id: string;
  label: string;
  testId?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isVisible?: boolean;
};

export const DataPage = ({
  items,
  renderCard,
  keyExtractor,
  emptyTitle,
  emptyDescription,
  loading,
  contentBetweenHeaderAndContent,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  items: unknown[];
  renderCard?: (item: unknown) => React.ReactNode;
  keyExtractor?: (item: unknown) => React.Key;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  contentBetweenHeaderAndContent?: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  layout?: "grid" | "list";
  columns?: number;
}) => {
  const showPagination =
    totalPages != null &&
    totalPages > 1 &&
    onPageChange &&
    onPageSizeChange;
  return (
    <div data-testid="data-page">
      {contentBetweenHeaderAndContent}
      {loading && <span>Grid loading</span>}
      {!loading && items.length === 0 && (
        <div data-testid="empty">
          <span>{emptyTitle}</span>
          {emptyDescription && <span>{emptyDescription}</span>}
        </div>
      )}
      {!loading && renderCard && items.map((item, i) => (
        <div key={keyExtractor ? keyExtractor(item) : i}>{renderCard(item)}</div>
      ))}
      {showPagination && (
        <div className="mt-4" data-testid="pagination">
          <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 1}
            pageSize={pageSize}
            onPageChange={onPageChange!}
            onPageSizeChange={onPageSizeChange!}
          />
        </div>
      )}
    </div>
  );
};

export const LoadingSpinner = ({ text }: { text?: string; size?: string }) => (
  <div role="status" data-testid="loading-spinner">{text ?? "Loading..."}</div>
);

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) => (
  <div data-testid="pagination-component">
    <span data-testid="current-page">{currentPage}</span>
    <span data-testid="total-pages">{totalPages}</span>
    <button
      type="button"
      onClick={() => onPageChange(currentPage + 1)}
      data-testid="next-page"
    >
      Next
    </button>
    <button
      type="button"
      onClick={() => onPageSizeChange(20)}
      data-testid="change-size"
    >
      Size 20
    </button>
  </div>
);

export const Card = ({
  title,
  children,
  icon: Icon,
  details,
  "data-testid": cardTestId,
}: {
  title?: string;
  children?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  iconSize?: string;
  layout?: string;
  detailsPerRow?: number;
  details?: Array<{ label: string; value: string; icon?: React.ComponentType }>;
  "data-testid"?: string;
}) => (
  <div data-testid={cardTestId ?? "quick-actions-card"}>
    {title != null && title !== "" && (
      <>
        <h3 data-testid="card-title">{title}</h3>
        <span data-testid="role-name">{title}</span>
      </>
    )}
    {Icon && <Icon className="icon" />}
    {details?.map((d, i) => (
      <div key={i} data-testid={`card-detail-${d.label}`}>
        <span>{d.label}</span>
        <span>{d.value}</span>
      </div>
    ))}
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  "data-testid": testId,
  variant,
  type,
  form,
  disabled,
  loading,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  "data-testid"?: string;
  variant?: string;
  type?: "button" | "submit";
  form?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  const resolvedTestId =
    testId ??
    (variant === "primary"
      ? "button-primary"
      : variant === "secondary"
        ? "button-secondary"
        : variant === "success"
          ? "button-success"
          : variant === "danger"
            ? "button-danger"
            : "action-btn");
  return (
    <button
      type={type ?? "button"}
      form={form}
      onClick={onClick}
      disabled={Boolean(disabled) || Boolean(loading)}
      data-testid={resolvedTestId}
      data-loading={loading ? "true" : undefined}
      className={className}
    >
      {loading && type === "submit" ? "Sending..." : children}
    </button>
  );
};

export const Alert = ({
  variant,
  children,
  "data-testid": testId,
  ...rest
}: {
  variant?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
  [k: string]: unknown;
}) => (
  <div data-testid={testId} data-variant={variant} role="alert" {...rest}>
    {children}
  </div>
);
export const Badge = () => null;

export const Input = ({
  label,
  error,
  id,
  placeholder,
  icon,
  "data-testid": testId,
  ...rest
}: {
  label?: string;
  error?: string;
  id?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  "data-testid"?: string;
  [k: string]: unknown;
}) => {
  const inputTestId =
    testId ??
    (placeholder
      ? `input-${String(placeholder).toLowerCase().replace(/\s+/g, "-")}`
      : undefined);
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>
        {label}
        <input
          id={id}
          aria-label={label}
          placeholder={placeholder}
          data-testid={inputTestId}
          {...rest}
        />
      </label>
      {icon != null && <span data-testid="icon-size" aria-hidden="true" />}
      {error && <span>{error}</span>}
    </div>
  );
};

export const DangerZone = ({
  title,
  description,
  buttonLabel,
  onConfirm,
  testId,
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onConfirm?: () => void;
  testId?: string;
}) => (
  <div>
    {title && <span>{title}</span>}
    {description && <span>{description}</span>}
    <button type="button" data-testid={testId ?? "confirm-delete-button"} onClick={onConfirm}>
      {buttonLabel ?? "Confirm"}
    </button>
  </div>
);
export const Dialog = ({
  children,
  isOpen = true,
  title,
  footerActions,
}: {
  children?: React.ReactNode;
  isOpen?: boolean;
  title?: string;
  onClose?: () => void;
  size?: string;
  footerActions?: Array<{ label: string; onClick: () => void; variant?: string; loading?: boolean }>;
}) =>
  isOpen ? (
    <div data-testid="modal" role="dialog">
      {title != null && (
        <h2 data-testid="export-modal-title">{title}</h2>
      )}
      {children}
      {footerActions?.map((action, i) => (
        <button key={i} type="button" onClick={action.onClick} disabled={action.loading}>
          {action.label}
        </button>
      ))}
    </div>
  ) : null;
export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Form = ({
  onSubmit,
  children,
  ...rest
}: {
  onSubmit?: (e: React.FormEvent) => void;
  children?: React.ReactNode;
  [k: string]: unknown;
}) => (
  <form onSubmit={onSubmit} {...rest}>
    {children}
  </form>
);

export const List = () => null;
export const ModalPortal = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="mock-modal-portal">{children}</div>
);
export const PageHeader = ({
  title,
  description,
  subtitle,
}: {
  title?: string;
  description?: string;
  subtitle?: string;
  icon?: React.ComponentType;
  actions?: React.ReactNode;
}) => (
  <div data-testid="page-header">
    {title && <h1>{title}</h1>}
    {description && <p>{description}</p>}
    {subtitle && <p>{subtitle}</p>}
  </div>
);
export const Progress = () => null;

export const SearchInput = ({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) => (
  <input
    placeholder={placeholder}
    value={value ?? ""}
    onChange={(e) => onChange?.(e.target.value)}
    className={className}
    aria-label={placeholder}
  />
);

export const EmptyState = ({
  title,
  description,
  primaryAction,
  "data-testid": testId,
  ...rest
}: {
  title?: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  "data-testid"?: string;
  [k: string]: unknown;
}) => (
  <div data-testid={testId} className="empty-state" {...rest}>
    {title && <span className="empty-state-title">{title}</span>}
    {description && <span className="empty-state-description">{description}</span>}
    {primaryAction && (
      <button type="button" onClick={primaryAction.onClick}>
        {primaryAction.label}
      </button>
    )}
  </div>
);

export const Dropdown = ({
  label,
  value,
  options = [],
  onValueChange,
  placeholderOption,
  className,
}: {
  label?: string;
  value?: string;
  options?: Array<{ value: string; label: string }>;
  onValueChange?: (v: string) => void;
  placeholderOption?: string;
  className?: string;
}) => (
  <div className={className}>
    {label && <span className="sr-only">{label}</span>}
    <select
      role="combobox"
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      aria-label={label}
    >
      {placeholderOption && (
        <option value="">{placeholderOption}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
export const TabNavigation = ({
  tabs,
  onTabChange,
  testId,
}: {
  tabs?: Array<{ id: string; label: string; testId?: string; icon?: React.ComponentType }>;
  activeTab?: string;
  onTabChange?: (id: string) => void;
  testId?: string;
}) => (
  <div data-testid={testId ?? "tab-navigation"}>
    {tabs?.map((t) => (
      <button
        key={t.id}
        type="button"
        data-testid={t.testId}
        onClick={() => onTabChange?.(t.id)}
      >
        <svg aria-hidden="true" data-testid="tab-icon" />
        {t.label}
      </button>
    ))}
  </div>
);
export const ThemeToggle = () => null;
export const Toast = () => null;
