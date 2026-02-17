'use client'

import { useState } from 'react'
import { calculateRetirement, formatCurrency, formatPercent, getSustainabilityRating, type CalculatorInput, type CalculatorOutput } from '@/lib/calculator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, TrendingUp, PiggyBank, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const defaultInputs: CalculatorInput = {
  currentAge: 30,
  retirementAge: 60,
  currentSavings: 500000,
  monthlyContribution: 10000,
  expectedAnnualReturnRate: 0.12,
  currentMonthlyExpense: 30000,
  annualInflationRate: 0.06,
  postRetirementNominalReturnRate: 0.08
}

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInput>(defaultInputs)
  const [results, setResults] = useState<CalculatorOutput | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (field: keyof CalculatorInput, value: string) => {
    const numValue = parseFloat(value) || 0
    setInputs(prev => ({ ...prev, [field]: numValue }))
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const output = calculateRetirement(inputs)
    setResults(output)
    setIsCalculating(false)
  }

  const sustainability = results ? getSustainabilityRating(results.retirementDurationYears) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">SR Calculator</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Retirement Projection Engine</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              v1.0.0
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Investment Details
                </CardTitle>
                <CardDescription>
                  Enter your retirement planning parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={inputs.currentAge}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={inputs.retirementAge}
                      onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                      placeholder="60"
                    />
                  </div>
                </div>

                <Separator />

                {/* Savings Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    Savings & Contributions
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      value={inputs.currentSavings}
                      onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                      placeholder="500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">Monthly SIP Contribution (₹)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={inputs.monthlyContribution}
                      onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                </div>

                <Separator />

                {/* Returns Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Expected Returns
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={(inputs.expectedAnnualReturnRate * 100).toFixed(1)}
                      onChange={(e) => handleInputChange('expectedAnnualReturnRate', (parseFloat(e.target.value) / 100).toString())}
                      placeholder="12"
                    />
                    <p className="text-xs text-slate-500">Pre-retirement portfolio return rate</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postRetReturn">Post-Retirement Return (%)</Label>
                    <Input
                      id="postRetReturn"
                      type="number"
                      step="0.1"
                      value={(inputs.postRetirementNominalReturnRate * 100).toFixed(1)}
                      onChange={(e) => handleInputChange('postRetirementNominalReturnRate', (parseFloat(e.target.value) / 100).toString())}
                      placeholder="8"
                    />
                    <p className="text-xs text-slate-500">Conservative post-retirement return</p>
                  </div>
                </div>

                <Separator />

                {/* Expense Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Expenses & Inflation
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyExpense">Current Monthly Expense (₹)</Label>
                    <Input
                      id="monthlyExpense"
                      type="number"
                      value={inputs.currentMonthlyExpense}
                      onChange={(e) => handleInputChange('currentMonthlyExpense', e.target.value)}
                      placeholder="30000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inflation">Annual Inflation Rate (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      step="0.1"
                      value={(inputs.annualInflationRate * 100).toFixed(1)}
                      onChange={(e) => handleInputChange('annualInflationRate', (parseFloat(e.target.value) / 100).toString())}
                      placeholder="6"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full" 
                  size="lg"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Retirement Projection
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Two-Phase Calculation Model</p>
                    <p className="text-blue-600 dark:text-blue-400">
                      Uses nominal returns during accumulation (no inflation adjustment) and real returns during withdrawal (inflation-adjusted). 
                      This mirrors real-world investor behavior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Main Result */}
                <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader>
                    <CardTitle className="text-emerald-800 dark:text-emerald-200">
                      Retirement Corpus
                    </CardTitle>
                    <CardDescription className="text-emerald-600 dark:text-emerald-400">
                      Projected at age {inputs.retirementAge}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                      {formatCurrency(results.retirementCorpus)}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(results.fvSip)} from SIP + {formatCurrency(results.fvCurrent)} from current savings
                    </p>
                  </CardContent>
                </Card>

                {/* Duration Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Corpus Sustainability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Duration</span>
                      <span className={`text-2xl font-bold ${sustainability?.color}`}>
                        {results.retirementDurationYears.toFixed(1)} years
                      </span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        {results.retirementDurationYears >= 20 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className={`font-medium ${sustainability?.color}`}>
                          {sustainability?.message}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Future Monthly Expense</span>
                        <span className="font-medium">{formatCurrency(results.futureMonthlyExpense)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Real Post-Retirement Return</span>
                        <span className="font-medium">{formatPercent(results.realPostRetReturn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Years to Retirement</span>
                        <span className="font-medium">{results.yearsToRetirement} years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Calculation Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Calculation Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Total Investment Months</span>
                        <span className="font-mono">{results.totalMonths}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Monthly Return Rate</span>
                        <span className="font-mono">{formatPercent(results.monthlyReturnRate)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">FV of SIP Contributions</span>
                        <span className="font-mono">{formatCurrency(results.fvSip)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">FV of Current Savings</span>
                        <span className="font-mono">{formatCurrency(results.fvCurrent)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {results.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {results.warnings.map((warning, index) => (
                          <li key={index} className="text-sm">{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Calculator className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                    No Results Yet
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Enter your details and click Calculate to see your retirement projection
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>SR Calculator - Retirement Projection Engine</p>
          <p className="text-xs mt-1">Built with Next.js, TypeScript & AWS</p>
        </div>
      </footer>
    </div>
  )
}
