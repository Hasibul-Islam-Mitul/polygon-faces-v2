/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { Employee } from '../types';
import backupData from './employees-backup.json';

/**
 * Shuffles an array in place.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Mapped offline fallback employees parsed from local JSON.
 */
const FALLBACK_EMPLOYEES: Employee[] = (backupData as any[]).map((row, index) => {
  const name = row.Name || 'Anonymous';
  const dept = row.Department || 'Operations';
  const role = row.Role || 'Fintech Specialist';
  const quote = row.Quote || '';
  const photoLinkRaw = row.PhotoLink || '';
  const photoLink = photoLinkRaw.trim().toLowerCase();

  return {
    id: row.id || `emp-${index}`,
    name,
    department: dept,
    role,
    quote,
    photoLink,
    image: photoLinkRaw.startsWith('http') ? photoLinkRaw : `/faces/${photoLink}`,
    linkedin: row.linkedin || row.Linkedin || '',
    twitter: row.twitter || row.Twitter || '',
  };
});

/**
 * Fetches and parses employee data from a Google Sheets CSV export link.
 */
export async function fetchEmployeeData(): Promise<Employee[]> {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYZD1Za-fzMOoF5mCJjI3wWaPSHj1IP0tU4EsV9mBr0LS-rkQM0hhJP3gxou9BjOKdFndMXLny-ksT/pub?output=csv';
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvContent = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const employees = results.data.map((row: any, index: number) => {
            const name = row.Name || 'Anonymous';
            const dept = row.Department || 'Operations';
            const role = row.Role || 'Fintech Specialist';
            const quote = row.Quote || '';
            const photoLinkRaw = row.PhotoLink || '';
            const photoLink = photoLinkRaw.trim().toLowerCase();

            return {
              id: row.id || `emp-${index}`,
              name,
              department: dept,
              role,
              quote,
              photoLink,
              // User requested: src={'/faces/' + employee.PhotoLink}
              // Filenames in CSV are like rakib-marketing.jpg
              image: photoLinkRaw.startsWith('http') ? photoLinkRaw : `/faces/${photoLink}`,
              linkedin: row.linkedin || row.Linkedin || '',
              twitter: row.twitter || row.Twitter || '',
            };
          });
          resolve(employees);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching CSV data via network. Loading local cache...:', error);
    return FALLBACK_EMPLOYEES;
  }
}

const MOCK_DATA: Employee[] = FALLBACK_EMPLOYEES;

