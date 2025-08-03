import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeCalculator from './TimeCalculator';

test("updates Arrival Time field when datetime is entered", () => {
  render(<TimeCalculator />);

  const datetimeField = screen.getByLabelText("Arrive by");
  fireEvent.mouseDown(datetimeField);
  fireEvent.change(datetimeField, {target: {value: "2022-10-13T18:21:00+08:00"}});

  expect(datetimeField.innerText == "13/10/2022 06:21 pm");
});

test("updates Departure Time field when datetime is entered", () => {
  render(<TimeCalculator />);
  
  const button = screen.getByRole("button", {name: /switchInputType/i});
  fireEvent.click(button);

  const datetimeField = screen.getByLabelText("Depart by");
  fireEvent.mouseDown(datetimeField);
  fireEvent.change(datetimeField, {target: {value: "2022-10-13T18:21:00+08:00"}});

  expect(datetimeField.innerText == "13/10/2022 06:21 pm");
});

test("shows Departure Time field and hides Travel Duration field when 'Enter departure time instead' is tapped", () => {
  render(<TimeCalculator />);

  const button = screen.getByRole("button", {name: /switchInputType/i});
  fireEvent.click(button);

  let depTimeField = screen.queryByLabelText("Depart by");
  let travelDurField = screen.queryByLabelText("Travel duration [HH:mm]");

  expect(depTimeField).toBeInTheDocument();
  expect(travelDurField).not.toBeInTheDocument();

  fireEvent.click(button);

  depTimeField = screen.queryByLabelText("Depart by");
  travelDurField = screen.queryByLabelText("Travel duration [HH:mm]");

  expect(depTimeField).not.toBeInTheDocument();
  expect(travelDurField).toBeInTheDocument();
});

test("accepts Travel Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText("Travel duration [HH:mm]");
  userEvent.type(textField, "00:10");

  expect(textField.innerText == "00:10");
});

test("rejects Travel Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText<HTMLInputElement>("Travel duration [HH:mm]");
  
  userEvent.type(textField, "0010");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "10");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "abc");
  expect(textField.validity.patternMismatch).toBeTruthy();
});

test("accepts Prep Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText("Preparation duration [HH:mm]");
  userEvent.type(textField, "00:10");

  expect(textField.innerText == "00:10");
});

test("rejects Prep Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText<HTMLInputElement>("Preparation duration [HH:mm]");
  
  userEvent.type(textField, "0010");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "10");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "abc");
  expect(textField.validity.patternMismatch).toBeTruthy();
});

test("accepts Sleep Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText("Sleep duration [HH:mm]");
  userEvent.type(textField, "00:10");

  expect(textField.innerText == "00:10");
});

test("rejects Sleep Duration if it is in the format HH:mm", () => {
  render(<TimeCalculator />);

  const textField = screen.getByLabelText<HTMLInputElement>("Sleep duration [HH:mm]");
  
  userEvent.type(textField, "0010");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "10");
  expect(textField.validity.patternMismatch).toBeTruthy();

  userEvent.type(textField, "abc");
  expect(textField.validity.patternMismatch).toBeTruthy();
});

// TODO: Add cases to test calculate button & display of results