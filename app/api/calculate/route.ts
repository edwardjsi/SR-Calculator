import { NextRequest, NextResponse } from 'next/server'
import { calculateRetirement, validateInputs, type CalculatorInput } from '@/lib/calculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse and validate input
    const input: CalculatorInput = {
      currentAge: Number(body.currentAge) || 0,
      retirementAge: Number(body.retirementAge) || 0,
      currentSavings: Number(body.currentSavings) || 0,
      monthlyContribution: Number(body.monthlyContribution) || 0,
      expectedAnnualReturnRate: Number(body.expectedAnnualReturnRate) || 0,
      currentMonthlyExpense: Number(body.currentMonthlyExpense) || 0,
      annualInflationRate: Number(body.annualInflationRate) || 0,
      postRetirementNominalReturnRate: Number(body.postRetirementNominalReturnRate) || 0,
    }

    // Validate inputs
    const validation = validateInputs(input)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors,
          warnings: validation.warnings 
        },
        { status: 400 }
      )
    }

    // Perform calculation
    const result = calculateRetirement(input)

    // Return structured response
    return NextResponse.json({
      success: true,
      data: {
        input: {
          currentAge: input.currentAge,
          retirementAge: input.retirementAge,
          currentSavings: input.currentSavings,
          monthlyContribution: input.monthlyContribution,
          expectedAnnualReturnRate: input.expectedAnnualReturnRate,
          currentMonthlyExpense: input.currentMonthlyExpense,
          annualInflationRate: input.annualInflationRate,
          postRetirementNominalReturnRate: input.postRetirementNominalReturnRate,
        },
        output: {
          yearsToRetirement: result.yearsToRetirement,
          totalMonths: result.totalMonths,
          retirementCorpus: result.retirementCorpus,
          fvSip: result.fvSip,
          fvCurrent: result.fvCurrent,
          futureMonthlyExpense: result.futureMonthlyExpense,
          retirementDurationYears: result.retirementDurationYears,
          retirementDurationMonths: result.retirementDurationMonths,
          realPostRetReturn: result.realPostRetReturn,
        },
        warnings: result.warnings,
      }
    })

  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to process calculation' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SR Calculator API',
    endpoint: '/api/calculate',
    method: 'POST',
    requiredFields: [
      'currentAge',
      'retirementAge', 
      'currentSavings',
      'monthlyContribution',
      'expectedAnnualReturnRate',
      'currentMonthlyExpense',
      'annualInflationRate',
      'postRetirementNominalReturnRate'
    ]
  })
}
