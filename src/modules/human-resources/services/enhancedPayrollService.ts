import { 
  AutomatedPayrollCalculation, 
  KSALaborLawRule, 
  GOSICalculation, 
  EOSAccrual, 
  OvertimeCalculation,
  ComplianceCheck,
  PayrollValidationResult,
  CalculationStep
} from '../types/hrTypes';

export class EnhancedPayrollService {
  // Saudi Labor Law Constants
  private static readonly GOSI_EMPLOYEE_RATE = 0.09; // 9%
  private static readonly GOSI_EMPLOYER_RATE = 0.11; // 11%
  private static readonly GOSI_CEILING = 45000; // SAR monthly ceiling
  private static readonly OVERTIME_RATE = 1.5;
  private static readonly HOLIDAY_OVERTIME_RATE = 2.0;
  private static readonly MAX_DAILY_HOURS = 8;
  private static readonly MAX_WEEKLY_HOURS = 48;
  private static readonly RAMADAN_DAILY_HOURS = 6;

  /**
   * Calculate automated payroll with Saudi labor law compliance
   */
  static calculatePayroll(
    employeeId: string,
    basicSalary: number,
    allowances: any,
    attendanceData: any,
    contractInfo: any
  ): AutomatedPayrollCalculation {
    const calculationDate = new Date().toISOString();
    const payPeriod = this.getCurrentPayPeriod();
    
    const auditTrail: CalculationStep[] = [];
    
    // Step 1: Basic Salary Validation
    auditTrail.push({
      stepNumber: 1,
      stepName: 'Basic Salary Validation',
      operation: 'validate_basic_salary',
      inputValues: { basicSalary, contractSalary: contractInfo.salary },
      outputValue: basicSalary,
      timestamp: new Date().toISOString(),
      notes: 'Validated basic salary against contract'
    });

    // Step 2: GOSI Calculation
    const gosiCalculation = this.calculateGOSI(basicSalary, contractInfo.gosiExempt);
    auditTrail.push({
      stepNumber: 2,
      stepName: 'GOSI Calculation',
      operation: 'calculate_gosi',
      inputValues: { basicSalary, isExempt: contractInfo.gosiExempt },
      outputValue: gosiCalculation,
      formula: `Employee: ${basicSalary} * ${this.GOSI_EMPLOYEE_RATE}, Employer: ${basicSalary} * ${this.GOSI_EMPLOYER_RATE}`,
      timestamp: new Date().toISOString()
    });

    // Step 3: EOS Accrual Calculation
    const eosAccrual = this.calculateEOSAccrual(basicSalary, contractInfo.startDate);
    auditTrail.push({
      stepNumber: 3,
      stepName: 'EOS Accrual',
      operation: 'calculate_eos_accrual',
      inputValues: { basicSalary, startDate: contractInfo.startDate },
      outputValue: eosAccrual,
      timestamp: new Date().toISOString()
    });

    // Step 4: Overtime Calculation
    const overtimeCalculation = this.calculateOvertime(basicSalary, attendanceData);
    auditTrail.push({
      stepNumber: 4,
      stepName: 'Overtime Calculation',
      operation: 'calculate_overtime',
      inputValues: { basicSalary, attendanceData },
      outputValue: overtimeCalculation,
      timestamp: new Date().toISOString()
    });

    // Step 5: Compliance Checks
    const complianceChecks = this.performComplianceChecks(
      basicSalary, 
      attendanceData, 
      overtimeCalculation
    );

    // Step 6: Final Calculations
    const grossPay = basicSalary + allowances.totalAllowances + overtimeCalculation.totalOvertimeAmount;
    const totalDeductions = gosiCalculation.employeeContribution + (allowances.totalDeductions || 0);
    const netPay = grossPay - totalDeductions;

    auditTrail.push({
      stepNumber: 5,
      stepName: 'Final Calculation',
      operation: 'calculate_net_pay',
      inputValues: { grossPay, totalDeductions },
      outputValue: netPay,
      formula: `${grossPay} - ${totalDeductions} = ${netPay}`,
      timestamp: new Date().toISOString()
    });

    // Validation
    const validationResults = this.validatePayrollCalculation({
      basicSalary,
      grossPay,
      netPay,
      gosiCalculation,
      overtimeCalculation,
      complianceChecks
    });

    return {
      id: `PAY-${employeeId}-${Date.now()}`,
      employeeId,
      payPeriod,
      calculationDate,
      basicSalary,
      allowances,
      deductions: {
        gosiEmployee: gosiCalculation.employeeContribution,
        insurance: 0,
        loans: 0,
        advances: 0,
        penalties: 0,
        other: 0,
        totalDeductions: totalDeductions
      },
      gosiCalculation,
      eosAccrual,
      overtimeCalculation,
      complianceChecks,
      grossPay,
      netPay,
      validationResults,
      calculationAuditTrail: auditTrail,
      status: 'calculated',
      processedBy: 'SYSTEM',
      processedAt: calculationDate,
      wpsEligible: this.isWPSEligible(contractInfo),
      payslipGenerated: false
    };
  }

  /**
   * Calculate GOSI contributions according to Saudi regulations
   */
  private static calculateGOSI(basicSalary: number, isExempt: boolean = false): GOSICalculation {
    if (isExempt) {
      return {
        basicSalaryForGOSI: basicSalary,
        employeeRate: 0,
        employerRate: 0,
        employeeContribution: 0,
        employerContribution: 0,
        totalContribution: 0,
        isExempt: true,
        exemptionReason: 'Employee exempt from GOSI',
        ceilingApplied: false,
        ceilingAmount: 0
      };
    }

    // Apply GOSI ceiling
    const salaryForGOSI = Math.min(basicSalary, this.GOSI_CEILING);
    const ceilingApplied = basicSalary > this.GOSI_CEILING;
    
    const employeeContribution = Math.round(salaryForGOSI * this.GOSI_EMPLOYEE_RATE * 100) / 100;
    const employerContribution = Math.round(salaryForGOSI * this.GOSI_EMPLOYER_RATE * 100) / 100;

    return {
      basicSalaryForGOSI: salaryForGOSI,
      employeeRate: this.GOSI_EMPLOYEE_RATE,
      employerRate: this.GOSI_EMPLOYER_RATE,
      employeeContribution,
      employerContribution,
      totalContribution: employeeContribution + employerContribution,
      isExempt: false,
      ceilingApplied,
      ceilingAmount: ceilingApplied ? this.GOSI_CEILING : undefined
    };
  }

  /**
   * Calculate End-of-Service benefit accrual
   */
  private static calculateEOSAccrual(basicSalary: number, startDate: string): EOSAccrual {
    const today = new Date();
    const contractStart = new Date(startDate);
    const serviceMonths = this.getMonthsDifference(contractStart, today);
    const serviceYears = Math.floor(serviceMonths / 12);
    
    // Saudi Labor Law: First 5 years = 0.5 month per year, after 5 years = 1 month per year
    const dailyRate = basicSalary / 30;
    let monthlyAccrual = 0;
    
    if (serviceYears < 5) {
      monthlyAccrual = (dailyRate * 15) / 12; // 0.5 month per year / 12 months
    } else {
      monthlyAccrual = dailyRate; // 1 month per year / 12 months
    }

    const yearToDateAccrual = monthlyAccrual * (new Date().getMonth() + 1);
    const totalAccrued = this.calculateTotalEOSAccrued(basicSalary, serviceYears, serviceMonths);

    return {
      currentServiceYears: serviceYears,
      currentServiceMonths: serviceMonths,
      dailyRate,
      monthlyAccrual,
      yearToDateAccrual,
      totalAccrued,
      calculationMethod: 'progressive',
      lastCalculationDate: new Date().toISOString()
    };
  }

  /**
   * Calculate overtime according to Saudi labor law
   */
  private static calculateOvertime(basicSalary: number, attendanceData: any): OvertimeCalculation {
    const regularHourlyRate = basicSalary / (30 * 8); // Monthly salary / (30 days * 8 hours)
    const overtimeRate = regularHourlyRate * this.OVERTIME_RATE;
    const holidayOvertimeRate = regularHourlyRate * this.HOLIDAY_OVERTIME_RATE;

    const regularOvertimeHours = attendanceData.overtimeHours || 0;
    const holidayOvertimeHours = attendanceData.holidayOvertimeHours || 0;

    const overtimeAmount = regularOvertimeHours * overtimeRate;
    const holidayOvertimeAmount = holidayOvertimeHours * holidayOvertimeRate;
    const totalOvertimeAmount = overtimeAmount + holidayOvertimeAmount;

    return {
      regularHours: attendanceData.regularHours || 0,
      overtimeHours: regularOvertimeHours,
      overtimeRate,
      overtimeAmount,
      holidayOvertimeHours,
      holidayOvertimeRate,
      holidayOvertimeAmount,
      totalOvertimeAmount,
      approvalRequired: totalOvertimeAmount > (basicSalary * 0.1), // Approval required if >10% of salary
      approvedBy: totalOvertimeAmount > (basicSalary * 0.1) ? attendanceData.approvedBy : undefined
    };
  }

  /**
   * Perform Saudi labor law compliance checks
   */
  private static performComplianceChecks(
    basicSalary: number,
    attendanceData: any,
    overtimeCalculation: OvertimeCalculation
  ): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Check 1: Minimum wage compliance
    checks.push({
      checkType: 'minimum_wage',
      checkName: 'Minimum Wage Compliance',
      passed: basicSalary >= 3000, // SAR 3,000 minimum wage
      value: basicSalary,
      threshold: 3000,
      message: basicSalary >= 3000 ? 'Salary meets minimum wage requirement' : 'Salary below minimum wage',
      severity: basicSalary >= 3000 ? 'info' : 'error',
      autoResolved: false
    });

    // Check 2: Maximum daily hours
    const dailyHours = attendanceData.averageDailyHours || 0;
    checks.push({
      checkType: 'max_daily_hours',
      checkName: 'Maximum Daily Hours',
      passed: dailyHours <= this.MAX_DAILY_HOURS,
      value: dailyHours,
      threshold: this.MAX_DAILY_HOURS,
      message: dailyHours <= this.MAX_DAILY_HOURS ? 'Daily hours within legal limit' : 'Daily hours exceed legal limit',
      severity: dailyHours <= this.MAX_DAILY_HOURS ? 'info' : 'warning',
      autoResolved: false
    });

    // Check 3: Maximum weekly hours
    const weeklyHours = attendanceData.averageWeeklyHours || 0;
    checks.push({
      checkType: 'max_weekly_hours',
      checkName: 'Maximum Weekly Hours',
      passed: weeklyHours <= this.MAX_WEEKLY_HOURS,
      value: weeklyHours,
      threshold: this.MAX_WEEKLY_HOURS,
      message: weeklyHours <= this.MAX_WEEKLY_HOURS ? 'Weekly hours within legal limit' : 'Weekly hours exceed legal limit',
      severity: weeklyHours <= this.MAX_WEEKLY_HOURS ? 'info' : 'warning',
      autoResolved: false
    });

    // Check 4: Overtime approval
    if (overtimeCalculation.approvalRequired) {
      checks.push({
        checkType: 'overtime_approval',
        checkName: 'Overtime Approval Required',
        passed: !!overtimeCalculation.approvedBy,
        value: overtimeCalculation.approvedBy || 'Not Approved',
        threshold: 'Required',
        message: overtimeCalculation.approvedBy ? 'Overtime approved by supervisor' : 'Overtime requires approval',
        severity: overtimeCalculation.approvedBy ? 'info' : 'error',
        autoResolved: false
      });
    }

    return checks;
  }

  /**
   * Validate payroll calculation results
   */
  private static validatePayrollCalculation(calculation: any): PayrollValidationResult[] {
    const results: PayrollValidationResult[] = [];

    // Validation 1: Net pay cannot be negative
    results.push({
      ruleId: 'NET_PAY_POSITIVE',
      ruleName: 'Net Pay Positive',
      passed: calculation.netPay >= 0,
      message: calculation.netPay >= 0 ? 'Net pay is positive' : 'Net pay cannot be negative',
      severity: calculation.netPay >= 0 ? 'info' : 'critical',
      affectedAmount: calculation.netPay < 0 ? Math.abs(calculation.netPay) : 0,
      suggestedFix: calculation.netPay < 0 ? 'Review deductions and allowances' : undefined,
      autoFixApplied: false
    });

    // Validation 2: GOSI contribution limits
    const gosiValid = calculation.gosiCalculation.employeeContribution <= (this.GOSI_CEILING * this.GOSI_EMPLOYEE_RATE);
    results.push({
      ruleId: 'GOSI_LIMIT',
      ruleName: 'GOSI Contribution Limit',
      passed: gosiValid,
      message: gosiValid ? 'GOSI contribution within limits' : 'GOSI contribution exceeds maximum',
      severity: gosiValid ? 'info' : 'error',
      autoFixApplied: !gosiValid // Auto-fix by applying ceiling
    });

    // Validation 3: Overtime rate compliance
    const overtimeValid = calculation.overtimeCalculation.overtimeRate >= 
      (calculation.basicSalary / (30 * 8) * this.OVERTIME_RATE);
    results.push({
      ruleId: 'OVERTIME_RATE',
      ruleName: 'Overtime Rate Compliance',
      passed: overtimeValid,
      message: overtimeValid ? 'Overtime rate complies with labor law' : 'Overtime rate below minimum requirement',
      severity: overtimeValid ? 'info' : 'error',
      autoFixApplied: false
    });

    return results;
  }

  /**
   * Generate comprehensive payroll report
   */
  static generatePayrollReport(payrollRecords: AutomatedPayrollCalculation[]): any {
    const totalEmployees = payrollRecords.length;
    const totalGrossPay = payrollRecords.reduce((sum, record) => sum + record.grossPay, 0);
    const totalNetPay = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
    const totalGOSIEmployee = payrollRecords.reduce((sum, record) => sum + record.gosiCalculation.employeeContribution, 0);
    const totalGOSIEmployer = payrollRecords.reduce((sum, record) => sum + record.gosiCalculation.employerContribution, 0);
    const totalOvertime = payrollRecords.reduce((sum, record) => sum + record.overtimeCalculation.totalOvertimeAmount, 0);

    const complianceIssues = payrollRecords.filter(record => 
      record.complianceChecks.some(check => !check.passed && check.severity === 'error')
    );

    return {
      summaryMetrics: {
        totalEmployees,
        totalGrossPay,
        totalNetPay,
        totalGOSIEmployee,
        totalGOSIEmployer,
        totalOvertime,
        complianceRate: ((totalEmployees - complianceIssues.length) / totalEmployees * 100).toFixed(2)
      },
      complianceStatus: {
        compliantEmployees: totalEmployees - complianceIssues.length,
        nonCompliantEmployees: complianceIssues.length,
        criticalIssues: complianceIssues.filter(record => 
          record.validationResults.some(result => result.severity === 'critical')
        ).length
      },
      wpsStatus: {
        eligibleEmployees: payrollRecords.filter(record => record.wpsEligible).length,
        totalWPSAmount: payrollRecords
          .filter(record => record.wpsEligible)
          .reduce((sum, record) => sum + record.netPay, 0)
      },
      generatedAt: new Date().toISOString(),
      reportPeriod: this.getCurrentPayPeriod()
    };
  }

  // Helper methods
  private static getCurrentPayPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private static getMonthsDifference(startDate: Date, endDate: Date): number {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
           (endDate.getMonth() - startDate.getMonth());
  }

  private static calculateTotalEOSAccrued(basicSalary: number, serviceYears: number, serviceMonths: number): number {
    const dailyRate = basicSalary / 30;
    let totalDays = 0;

    // First 5 years: 15 days per year
    const firstFiveYears = Math.min(serviceYears, 5);
    totalDays += firstFiveYears * 15;

    // After 5 years: 30 days per year
    if (serviceYears > 5) {
      totalDays += (serviceYears - 5) * 30;
    }

    // Pro-rata for current year
    if (serviceMonths % 12 > 0) {
      const currentYearMonths = serviceMonths % 12;
      const dailyRateForCurrentYear = serviceYears < 5 ? 15 / 12 : 30 / 12;
      totalDays += currentYearMonths * dailyRateForCurrentYear;
    }

    return totalDays * dailyRate;
  }

  private static isWPSEligible(contractInfo: any): boolean {
    return contractInfo.nationality !== 'Saudi' && contractInfo.salary >= 3000;
  }
} 