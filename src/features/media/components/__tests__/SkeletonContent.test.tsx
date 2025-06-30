import { render, screen } from "@testing-library/react";
import SkeletonContent from "../SkeletonContent";

describe("SkeletonContent", () => {
  it("renders 6 skeleton elements representing media detail loading layout", () => {
    render(<SkeletonContent />);
    const skeletons = screen.getAllByTestId("skeleton-line");
    expect(skeletons).toHaveLength(6);
  });

  it("is wrapped in a MUI Paper container", () => {
    const { container } = render(<SkeletonContent />);
    const paper = container.querySelector(".MuiPaper-root");
    expect(paper).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<SkeletonContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
