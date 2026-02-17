/**
 * SR Calculator - Retirement Projection Engine
 * 
 * Implements two-phase retirement calculation model:
 * - Phase 1: Accumulation (nominal returns, no inflation)
 * - Phase 2: Withdrawal (real returns, inflation-adjusted expenses)
 */

export interface CalculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturnRate: number; // e.g., 0.12 for 12%
  currentMonthlyExpense: number;
  annualInflationRate: number; // e.g., 0.06 for 6%
  postRetirementNominalReturnRate: number;
}

export interface CalculatorOutput {
  // Derived values
  yearsToRetirement: number;
  totalMonths: number;
  monthlyReturnRate: number;

  // Phase 1: Accumulation Results
  fvSip: number; // Future value of monthly SIP contributions
  fvCurrent: number; // Future value of current savings
  retirementCorpus: number; // Total corpus at retirement

  // Phase 2: Withdrawal Results
  futureMonthlyExpense: number; // Inflation-adjusted monthly expense at retirement
  realPostRetReturn: number; // Real return after inflation
  retirementDurationMonths: number;
  retirementDurationYears: number;

  // Validation
  isValid: boolean;
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates calculator inputs against guardrails
 */
export function validateInputs(input: CalculatorInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required validations
  if (input.currentAge <= 0) {
    errors.push("Current age must be positive");
  }
  
  if (input.retirementAge <= input.currentAge) {
    errors.push("Retirement age must be greater than current age");
  }

  const yearsToRetirement = input.retirementAge - input.currentAge;
  const totalMonths = yearsToRetirement * 12;

  if (totalMonths < 12) {
    errors.push("Investment horizon must be at least 12 months");
  }

  // Guardrail: monthly return rate should be reasonable
  const monthlyRate = input.expectedAnnualReturnRate / 12;
  if (monthlyRate >= 0.02) {
    warnings.push("Monthly return rate exceeds 2% guardrail - verify annual rate is correct (e.g., 0.12 for 12%)");
  }

  if (input.expectedAnnualReturnRate < 0 || input.expectedAnnualReturnRate > 0.30) {
    warnings.push("Expected annual return rate should be between 0% and 30%");
  }

  if (input.annualInflationRate < 0 || input.annualInflationRate > 0.15) {
    warnings.push("Annual inflation rate should be between 0% and 15%");
  }

  if (input.monthlyContribution < 0) {
    errors.push("Monthly contribution cannot be negative");
  }

  if (input.currentSavings < 0) {
    errors.push("Current savings cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculates future value of monthly SIP contributions (ordinary annuity)
 * Formula: FV = PMT × [((1 + r)^n - 1) / r]
 */
function calculateFVSip(
  monthlyContribution: number,
  monthlyRate: number,
  totalMonths: number
): number {
  if (monthlyRate === 0) {
    return monthlyContribution * totalMonths;
  }
  
  const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
  return monthlyContribution * ((growthFactor - 1) / monthlyRate);
}

/**
 * Calculates future value of current savings with monthly compounding
 * Formula: FV = PV × (1 + r)^n
 */
function calculateFVCurrent(
  currentSavings: number,
  monthlyRate: number,
  totalMonths: number
): number {
  return currentSavings * Math.pow(1 + monthlyRate, totalMonths);
}

/**
 * Calculates inflation-adjusted future monthly expense
 * Formula: Future = Present × (1 + inflation)^years
 */
function calculateFutureExpense(
  currentMonthlyExpense: number,
  inflationRate: number,
  years: number
): number {
  return currentMonthlyExpense * Math.pow(1 + inflationRate, years);
}

/**
 * Calculates real return rate (Fisher equation approximation)
 * Formula: Real = ((1 + nominal) / (1 + inflation)) - 1
 */
function calculateRealReturn(
  nominalRate: number,
  inflationRate: number
): number {
  return ((1 + nominalRate) / (1 + inflationRate)) - 1;
}

/**
 * Simulates corpus depletion during retirement
 * Uses iterative monthly simulation
 */
function simulateCorpusDepletion(
  initialCorpus: number,
  monthlyWithdrawal: number,
  monthlyRealReturn: number
): number {
  let corpus = initialCorpus;
  let months = 0;
  const maxMonths = 1200; // 100 years cap to prevent infinite loop

  while (corpus > 0 && months < maxMonths) {
    // Apply return first
    corpus = corpus * (1 + monthlyRealReturn);
    // Then withdraw
    corpus = corpus - monthlyWithdrawal;
    months++;
  }

  return months;
}

/**
 * Performs sanity check on calculation results
 * Uses heuristic: expected corpus ≈ contribution × months × (1 + rate × years / 2)
 */
function performSanityCheck(
  output: CalculatorOutput,
  input: CalculatorInput
): string[] {
  const warnings: string[] = [];

  // Calculate expected corpus using simple heuristic
  const simpleGrowth = 1 + (input.expectedAnnualReturnRate * output.yearsToRetirement / 2);
  const expectedCorpus = input.monthlyContribution * output.totalMonths * simpleGrowth;

  if (output.retirementCorpus > 2 * expectedCorpus) {
    warnings.push("Calculated corpus seems unusually high - please verify inputs");
  }

  // Check if corpus will last reasonable time
  if (output.retirementDurationYears < 10) {
    warnings.push("Corpus depletion risk is high - consider increasing contributions or reducing expected expenses");
  }

  return warnings;
}

/**
 * Main calculation function
 * Performs complete retirement projection
 */
export function calculateRetirement(input: CalculatorInput): CalculatorOutput {
  // Validate inputs
  const validation = validateInputs(input);
  
  if (!validation.isValid) {
    return {
      yearsToRetirement: 0,
      totalMonths: 0,
      monthlyReturnRate: 0,
      fvSip: 0,
      fvCurrent: 0,
      retirementCorpus: 0,
      futureMonthlyExpense: 0,
      realPostRetReturn: 0,
      retirementDurationMonths: 0,
      retirementDurationYears: 0,
      isValid: false,
      warnings: [...validation.errors, ...validation.warnings]
    };
  }

  // Phase 1: Accumulation calculations
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const totalMonths = yearsToRetirement * 12;
  const monthlyReturnRate = input.expectedAnnualReturnRate / 12;

  const fvSip = calculateFVSip(
    input.monthlyContribution,
    monthlyReturnRate,
    totalMonths
  );

  const fvCurrent = calculateFVCurrent(
    input.currentSavings,
    monthlyReturnRate,
    totalMonths
  );

  const retirementCorpus = fvSip + fvCurrent;

  // Phase 2: Withdrawal calculations
  const futureMonthlyExpense = calculateFutureExpense(
    input.currentMonthlyExpense,
    input.annualInflationRate,
    yearsToRetirement
  );

  const realPostRetReturn = calculateRealReturn(
    input.postRetirementNominalReturnRate,
    input.annualInflationRate
  );

  const monthlyRealReturn = realPostRetReturn / 12;

  const retirementDurationMonths = simulateCorpusDepletion(
    retirementCorpus,
    futureMonthlyExpense,
    monthlyRealReturn
  );

  const retirementDurationYears = retirementDurationMonths / 12;

  // Build output
  const output: CalculatorOutput = {
    yearsToRetirement,
    totalMonths,
    monthlyReturnRate,
    fvSip,
    fvCurrent,
    retirementCorpus,
    futureMonthlyExpense,
    realPostRetReturn,
    retirementDurationMonths,
    retirementDurationYears,
    isValid: true,
    warnings: validation.warnings
  };

  // Add sanity check warnings
  output.warnings.push(...performSanityCheck(output, input));

  return output;
}

/**
 * Format number as Indian currency (lakhs/crores)
 */
export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 10000000) {
    // Crores
    return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  } else if (absAmount >= 100000) {
    // Lakhs
    return '₹' + (amount / 100000).toFixed(2) + ' L';
  } else {
    // Regular formatting
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }
}

/**
 * Format number as US currency
 */
export function formatUSCurrency(amount: number): string {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(2) + 'M';
  } else if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(2) + 'K';
  }
  return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Format currency with auto-detection
 */
export function formatCurrency(amount: number): string {
  return formatIndianCurrency(amount);
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + '%';
}

/**
 * Format years with decimal
 */
export function formatYears(years: number): string {
  return years.toFixed(1) + ' years';
}

/**
 * Get sustainability rating
 */
export function getSustainabilityRating(years: number): {
  level: 'excellent' | 'good' | 'moderate' | 'poor';
  color: string;
  message: string;
} {
  if (years >= 30) {
    return { level: 'excellent', color: 'text-green-600', message: 'Excellent - Corpus should last 30+ years' };
  } else if (years >= 20) {
    return { level: 'good', color: 'text-emerald-600', message: 'Good - Corpus should last 20-30 years' };
  } else if (years >= 15) {
    return { level: 'moderate', color: 'text-yellow-600', message: 'Moderate - Consider increasing contributions' };
  } else if (years >= 10) {
    return { level: 'poor', color: 'text-orange-600', message: 'Warning - Corpus may not last through retirement' };
  } else {
    return { level: 'poor', color: 'text-red-600', message: 'Risk - Corpus depletion likely within 10 years' };
  }
}
