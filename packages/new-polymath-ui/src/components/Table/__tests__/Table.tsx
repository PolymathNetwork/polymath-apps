import React from 'react';
import { Table } from '../Table';
import { columns, dataTests } from '../docs/data';
import { render, fireEvent } from '~/testUtils/helpers';

describe('Table', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <Table
        {...{
          data: dataTests,
          columns,
        }}
      >
        <Table.BatchActionsToolbar />
        <Table.Rows small />
        <Table.Pagination />
      </Table>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('clicking select all button selects every rows', () => {
    const rendered = render(
      <Table
        {...{
          data: dataTests,
          columns,
        }}
        selectable
      >
        <Table.BatchActionsToolbar />
        <Table.Rows />
      </Table>
    );

    const { getByText, getAllByTestId, getByTestId } = rendered;

    fireEvent.click(getByTestId('select-all-rows'));

    const selectCount = getByText(/items selected/i);
    const rowsCheckbox = getAllByTestId('select-row');

    expect(
      rowsCheckbox
        .map(checkbox => (checkbox as HTMLInputElement).checked)
        .find(isChecked => !isChecked)
    ).toBeFalsy();

    expect(selectCount).toHaveTextContent(`${dataTests.length} items selected`);
  });

  test('clicking batch actions cancel button hides it', () => {
    const rendered = render(
      <Table
        {...{
          data: dataTests,
          columns,
        }}
        selectable
      >
        <Table.BatchActionsToolbar />
        <Table.Rows />
      </Table>
    );

    const { getByText, getByTestId } = rendered;

    const cancelBatchActionsBtn = getByText(/Cancel/i);

    fireEvent.click(getByTestId('select-all-rows'));

    expect(cancelBatchActionsBtn).toBeVisible();

    fireEvent.click(cancelBatchActionsBtn);

    expect(cancelBatchActionsBtn).not.toBeVisible();
  });
});
