import Spinner from "./Spinner";
import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

test("Spinner renders without errors.", () => {
  render(<Spinner on={false} />);
});

test("Spinner has no text when on is set to false", () => {
  render(<Spinner on={false} />);
  const spinnerText = screen.queryByText(/Please wait.../i);
  expect(spinnerText).not.toBeInTheDocument();
});

test("Spinner has text when on is set to true", () => {
  render(<Spinner on={true} />);
  const spinnerText = screen.queryByText(/Please wait.../i);
  expect(spinnerText).toBeInTheDocument();
});
