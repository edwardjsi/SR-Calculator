import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { calculateRetirement } from '@/lib/calculator'

// POST /api/calculations - Save a new calculation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedAnnualReturnRate,
      currentMonthlyExpense,
      annualInflationRate,
      postRetirementNominalReturn
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Perform calculation
    const result = calculateRetirement({
      currentAge: parseInt(currentAge),
      retirementAge: parseInt(retirementAge),
      currentSavings: parseFloat(currentSavings),
      monthlyContribution: parseFloat(monthlyContribution),
      expectedAnnualReturnRate: parseFloat(expectedAnnualReturnRate),
      currentMonthlyExpense: parseFloat(currentMonthlyExpense),
      annualInflationRate: parseFloat(annualInflationRate),
      postRetirementNominalReturnRate: parseFloat(postRetirementNominalReturn)
    })

    // Save calculation to database
    const calculation = await prisma.calculation.create({
      data: {
        userId,
        currentAge: parseInt(currentAge),
        retirementAge: parseInt(retirementAge),
        currentSavings: parseFloat(currentSavings),
        monthlyContribution: parseFloat(monthlyContribution),
        expectedAnnualReturnRate: parseFloat(expectedAnnualReturnRate),
        currentMonthlyExpense: parseFloat(currentMonthlyExpense),
        annualInflationRate: parseFloat(annualInflationRate),
        postRetirementNominalReturn: parseFloat(postRetirementNominalReturn),
        retirementCorpus: result.retirementCorpus,
        futureMonthlyExpense: result.futureMonthlyExpense,
        retirementDurationYears: result.retirementDurationYears,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Calculation saved successfully',
      calculation: {
        id: calculation.id,
        ...result
      }
    })

  } catch (error) {
    console.error('Save calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/calculations?userId=xxx - Get user's calculations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const calculations = await prisma.calculation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      calculations
    })

  } catch (error) {
    console.error('Get calculations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
