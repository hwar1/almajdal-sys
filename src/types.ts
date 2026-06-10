/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum FoodCategory {
  BASE_ESSENTIAL = "BASE_ESSENTIAL",         // 🔵🔵 (أساسيات الاستشفاء)
  DAILY = "DAILY",                           // 🔵 (مسموح يومي)
  WEEKLY_OCCASIONAL = "WEEKLY_OCCASIONAL",   // 🟡 (مسموح أسبوعي)
  MONTHLY_OCCASIONAL = "MONTHLY_OCCASIONAL", // 🟣 (مسموح شهري/موسمي)
  PROHIBITED = "PROHIBITED"                  // 🔴 (ممنوع قطعي للراحة الهضمية)
}

export interface FoodItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: FoodCategory;
  reasonAr: string;
  reasonEn: string;
  alternativesAr: string[];
  alternativesEn: string[];
  icon: string;
}

export interface MealAnalysisResult {
  isFullyCompliant: boolean;
  analyzedItems: {
    itemNameUrgent: string;
    matchedItem?: FoodItem;
    category: FoodCategory;
    isCompliant: boolean;
    reasonAr: string;
    alternativesAr: string[];
  }[];
  aiExplanation: string;
}

export interface FastDay {
  dayNumber: number;
  didFast: boolean; // Yes (Gold) / No (Neutral)
  date?: string;
}

export interface TrackerState {
  days: FastDay[];
  weeklyTargetCount: number; // For compliance calculation (e.g. out of 8 fasts in 30 days or standard compliance score)
}
