import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginatedGrid from "./PaginatedGrid";

const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

describe("PaginatedGrid", () => {
  const keyExtractor = (item: { id: string }) => item.id;
  const renderCard = (item: { id: string; name: string }) => (
    <div data-testid={`card-${item.id}`}>{item.name}</div>
  );

  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  it("shows loading spinner when loading and items empty", () => {
    render(
      <PaginatedGrid
        items={[]}
        loading={true}
        renderCard={renderCard}
        keyExtractor={keyExtractor}
        pageNumber={1}
        totalPages={1}
        totalCount={0}
        pageSize={10}
      />
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("grid-page")).not.toBeInTheDocument();
  });

  it("renders grid with empty state when not loading and items empty", () => {
    render(
      <PaginatedGrid
        items={[]}
        loading={false}
        renderCard={renderCard}
        keyExtractor={keyExtractor}
        emptyTitle="No roles"
        emptyDescription="Add one"
        pageNumber={1}
        totalPages={1}
        totalCount={0}
        pageSize={10}
      />
    );
    expect(screen.getByTestId("grid-page")).toBeInTheDocument();
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.getByText("No roles")).toBeInTheDocument();
    expect(screen.getByText("Add one")).toBeInTheDocument();
  });

  it("renders items and does not show pagination when totalPages is 1", () => {
    const items = [{ id: "1", name: "Role A" }];
    render(
      <PaginatedGrid
        items={items}
        loading={false}
        renderCard={renderCard}
        keyExtractor={keyExtractor}
        pageNumber={1}
        totalPages={1}
        totalCount={1}
        pageSize={10}
      />
    );
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByText("Role A")).toBeInTheDocument();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("shows pagination and calls changePage when totalPages > 1 and handlers provided", () => {
    const changePage = jest.fn();
    const changePageSize = jest.fn();
    const items = [{ id: "1", name: "Item" }];
    render(
      <PaginatedGrid
        items={items}
        loading={false}
        renderCard={renderCard}
        keyExtractor={keyExtractor}
        pageNumber={1}
        totalPages={3}
        totalCount={25}
        pageSize={10}
        paginationHandlers={{ changePage, changePageSize }}
      />
    );
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("3");

    fireEvent.click(screen.getByTestId("next-page"));
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(changePage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByTestId("change-size"));
    expect(changePageSize).toHaveBeenCalledWith(20);
  });

  it("applies testId to wrapper when provided", () => {
    render(
      <PaginatedGrid
        items={[]}
        loading={false}
        renderCard={renderCard}
        keyExtractor={keyExtractor}
        pageNumber={1}
        totalPages={1}
        totalCount={0}
        pageSize={10}
        testId="my-grid"
      />
    );
    expect(screen.getByTestId("my-grid-page")).toBeInTheDocument();
  });
});
