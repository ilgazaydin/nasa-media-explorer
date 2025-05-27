import { render, screen } from "@testing-library/react";
import SkeletonContent from "./SkeletonContent";

describe("SkeletonContent", () => {
  it("renders 6 skeleton elements", () => {
    render(<SkeletonContent />);
    const skeletons = screen.getAllByTestId("skeleton-line");
    expect(skeletons).toHaveLength(6);
  });
});
