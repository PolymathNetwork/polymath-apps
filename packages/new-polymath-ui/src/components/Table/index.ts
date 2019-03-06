import { Row as CsvParserRow, Cell as CsvParserCell } from './useCsvParser';
import { Row as SelectRowRow } from './useSelectRow';

export * from './Table';

export interface Row extends CsvParserRow, SelectRowRow {}
export interface Cell extends CsvParserCell {}
