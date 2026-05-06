/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  photoLink?: string;
  quote: string;
  linkedin?: string;
  twitter?: string;
}

export type Department = string;
