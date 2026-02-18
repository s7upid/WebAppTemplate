import React from "react";

type BaseListItem = { id?: number };

interface ListProps<T extends BaseListItem> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  listClassName?: string;
  testId?: string;
  keyExtractor?: (item: T, index: number) => React.Key;
}

function List<T extends BaseListItem>({
  items,
  renderItem,
  listClassName = "",
  testId,
  keyExtractor,
}: ListProps<T>) {
  return (
    <div className={`${listClassName}`} data-testid={testId}>
      {items.map((item, index) => (
        <div
          key={
            keyExtractor
              ? keyExtractor(item, index)
              : (item as any)?.id ??
                (item as any)?.key ??
                (item as any)?.text ??
                index
          }
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default List;
