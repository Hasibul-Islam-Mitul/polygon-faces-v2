/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { Employee } from '../types';

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
 * Fetches and parses employee data from a Google Sheets CSV export link.
 */
export async function fetchEmployeeData(): Promise<Employee[]> {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYZD1Za-fzMOoF5mCJjI3wWaPSHj1IP0tU4EsV9mBr0LS-rkQM0hhJP3gxou9BjOKdFndMXLny-ksT/pub?output=csv';
  try {
    const response = await fetch(CSV_URL);
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
    console.error('Error fetching CSV data:', error);
    return MOCK_DATA;
  }
}

const MOCK_DATA: Employee[] = [
  {
    id: '1',
    name: 'Rakib Marketing',
    role: 'Marketing Lead',
    department: 'Marketing',
    image: '/faces/rakib-marketing.jpg',
    quote: 'Driving Fintech adoption and brand identity for Polygon Technology.',
    linkedin: 'https://www.linkedin.com/company/polygontechnology/',
    twitter: '#'
  },
  {
    id: 'developer-hasibul',
    name: 'MD. Hasibul Islam Mitul',
    role: 'Technical Graphics Intern',
    department: 'Marketing',
    image: '/pfp square.jpg',
    quote: 'Specializing in visual identity and automated data systems.',
    linkedin: 'https://www.linkedin.com/company/polygontechnology/',
    twitter: '#'
  },
  {
    id: '3',
    name: 'Sayed Ahmed',
    role: 'Merchant Onboarding Lead',
    department: 'Fintech',
    image: 'https://images.unsplash.com/photo-1519085184588-445694c9f116?auto=format&fit=crop&q=80&w=400',
    quote: 'Bridging digital payments with real-world merchant ecosystems.',
    linkedin: '#',
    twitter: '#'
  }
];
