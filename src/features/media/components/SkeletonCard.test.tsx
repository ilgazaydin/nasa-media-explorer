// SkeletonCard.test.tsx
import { render, screen } from "@testing-library/react";
import SkeletonCard from "./SkeletonCard";

describe("SkeletonCard", () => {
  it("renders 5 skeleton lines", () => {
    render(<SkeletonCard />);
    const skeletons = screen.getAllByTestId("skeleton-line");
    expect(skeletons).toHaveLength(5);
  });

  it("renders within a Paper container", () => {
    const { container } = render(<SkeletonCard />);
    const paper = container.querySelector(".MuiPaper-root");
    expect(paper).toBeInTheDocument();
  });
});