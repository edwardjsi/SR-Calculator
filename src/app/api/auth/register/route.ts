import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, phone, age, monthlySavings, initialCorpus } = body

    // Validate required fields
    if (!name || !email || !age) {
      return NextResponse.json(
        { error: 'Name, email, and age are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        age: parseInt(age),
      }
    })

    // If initial savings data provided, create initial calculation
    if (monthlySavings || initialCorpus) {
      await prisma.calculation.create({
        data: {
          userId: user.id,
          currentAge: parseInt(age),
          retirementAge: 60, // Default
          currentSavings: parseFloat(initialCorpus) || 0,
          monthlyContribution: parseFloat(monthlySavings) || 0,
          expectedAnnualReturnRate: 0.12, // Default 12%
          currentMonthlyExpense: 30000, // Default
          annualInflationRate: 0.06, // Default 6%
          postRetirementNominalReturn: 0.08, // Default 8%
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
