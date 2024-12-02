import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomerPage from "@/Pages/CustomerPage";
import { generateCustomerEntries } from "@/Components/TableComponent/sampleData";

jest.mock("@/Components/TableComponent/sampleData", () => ({
  generateCustomerEntries: jest.fn(),
}));

jest.mock("@/Components/SideMenuComponent/SideMenu", () => ({
  SideMenu: () => <div data-testid="side-menu">SideMenu</div>,
}));

jest.mock("@/Components/TableComponent/Table", () => ({
  Table: ({ tableTitle }: { tableTitle: string }) => (
    <div data-testid="table">{tableTitle}</div>
  ),
}));

jest.mock("@/Components/InputComponent/Input", () => ({
  Input: ({ label, name, onChange }: any) => (
    <input
      aria-label={label}
      name={name}
      onChange={(e) => onChange(e)}
      data-testid={`input-${name}`}
    />
  ),
}));

jest.mock("@/Components/ProceedButtonComponent/ProceedButtonComponent", () => ({
  ProceedButton: ({
    type,
    loading,
  }: {
    type: "submit" | "reset" | "button";
    loading: boolean;
  }) => (
    <button type={type} data-testid="proceed-button">
      {loading ? "Loading..." : "Submit"}
    </button>
  ),
}));

jest.mock("@/Components/LogoComponent/ModalComponent/Modal", () => ({
  Modal: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

describe("CustomerPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateCustomerEntries as jest.Mock).mockReturnValue([
      { no: 1, name: "John Doe", email: "john@example.com", location: "USA" },
    ]);
  });

  it("renders the page layout correctly", async () => {
    render(<CustomerPage />);
    expect(screen.getByTestId("side-menu")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toHaveTextContent("ALL CUSTOMERS");
  });

  it("fetches and displays table data", async () => {
    render(<CustomerPage />);
    await waitFor(() =>
      expect(generateCustomerEntries).toHaveBeenCalledWith(50)
    );
  });

  it("opens and closes the modal for new customer", async () => {
    render(<CustomerPage />);
    const newCustomerButton = screen.getByText(/New Customer/i);
    fireEvent.click(newCustomerButton);
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    const closeModalButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeModalButton);
    await waitFor(() =>
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
    );
  });

  it("fills the form and submits correctly", async () => {
    render(<CustomerPage />);
    const newCustomerButton = screen.getByText(/New Customer/i);
    fireEvent.click(newCustomerButton);

    const firstNameInput = screen.getByTestId("input-firstname");
    const lastNameInput = screen.getByTestId("input-lastname");
    const emailInput = screen.getByTestId("input-email");
    const phoneInput = screen.getByTestId("input-phone");
    const addressInput = screen.getByTestId("input-Address");
    const addressTypeInput = screen.getByTestId("input-Address Type");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    fireEvent.change(addressTypeInput, { target: { value: "Home" } });

    const proceedButton = screen.getByTestId("proceed-button");
    fireEvent.click(proceedButton);

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("filters table data based on search query", async () => {
    render(<CustomerPage />);
    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: "john" } });

    const tableRows = screen.getAllByTestId("table-row");
    expect(tableRows).toHaveLength(1);
  });
});
