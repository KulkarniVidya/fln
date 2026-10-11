import { describe, expect, it } from 'vitest';
import { csvCell, buildCsv } from './csv';

describe('Safe CSV helpers (issue #747)', () => {
  describe('csvCell', () => {
    it('handles null and undefined as empty string', () => {
      expect(csvCell(null)).toBe('""');
      expect(csvCell(undefined)).toBe('""');
    });

    it('quotes normal strings and numbers', () => {
      expect(csvCell('Aarav')).toBe('"Aarav"');
      expect(csvCell(42)).toBe('"42"');
      expect(csvCell(0)).toBe('"0"');
    });

    it('escapes existing double quotes by doubling them', () => {
      expect(csvCell('Hello "World"')).toBe('"Hello ""World"""');
    });

    it('correctly wraps values with commas and newlines', () => {
      expect(csvCell('Delhi, India')).toBe('"Delhi, India"');
      expect(csvCell('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });

    it('defuses spreadsheet formula injection prefixes (=, +, -, @, tab, CR)', () => {
      expect(csvCell('=1+1')).toBe('"\'=1+1"');
      expect(csvCell('=HYPERLINK("http://evil.com","click")')).toBe('"\'=HYPERLINK(""http://evil.com"",""click"")"');
      expect(csvCell('+cmd|/c calc')).toBe('"\'+cmd|/c calc"');
      expect(csvCell('-5+2')).toBe('"\' -5+2"'.replace(' ', ''));
      expect(csvCell('@SUM(A1:A10)')).toBe('"\'@SUM(A1:A10)"');
      expect(csvCell('\tleadingTab')).toBe('"\'\tleadingTab"');
      expect(csvCell('\rleadingCR')).toBe('"\'\rleadingCR"');
    });

    it('preserves Unicode and Hindi characters without corruption', () => {
      expect(csvCell('आरव शर्मा')).toBe('"आरव शर्मा"');
      expect(csvCell('कक्षा ३')).toBe('"कक्षा ३"');
    });
  });

  describe('buildCsv', () => {
    it('builds a CRLF-delimited CSV with quoted header and row cells', () => {
      const headers = ['ID', 'Name', 'Score'];
      const rows = [
        ['std-1', 'Aarav', 95],
        ['std-2', 'Priya, K.', 88],
      ];

      const csv = buildCsv(headers, rows);
      expect(csv).toBe(
        '"ID","Name","Score"\r\n' +
        '"std-1","Aarav","95"\r\n' +
        '"std-2","Priya, K.","88"'
      );
    });

    it('neutralizes hostile values across multiple columns in rows', () => {
      const headers = ['Name', 'Note'];
      const rows = [
        ['=cmd|\' /C calc\'!A0', '+12345'],
      ];

      const csv = buildCsv(headers, rows);
      expect(csv).toBe('"Name","Note"\r\n"\'=cmd|\' /C calc\'!A0","\'+12345"');
    });
  });
});
