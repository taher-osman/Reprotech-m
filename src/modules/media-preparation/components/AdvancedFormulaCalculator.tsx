import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Beaker, 
  Plus, 
  Minus, 
  Save, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Scales,
  Droplet,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Badge } from '../../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';

interface Ingredient {
  id: string;
  name: string;
  stockConcentration: number;
  stockUnit: string;
  targetConcentration: number;
  targetUnit: string;
  molecularWeight?: number;
  purity: number;
  density?: number;
  stockVolume?: number;
  calculatedVolume: number;
  calculatedMass: number;
  cost: number;
  supplier: string;
  lotNumber: string;
  expiryDate: string;
  storageTemp: string;
  hazardClass: 'Safe' | 'Irritant' | 'Corrosive' | 'Toxic' | 'Flammable';
}

interface CalculationResult {
  totalVolume: number;
  finalVolume: number;
  osmolarity: number;
  estimatedpH: number;
  totalCost: number;
  preparationTime: number;
  stabilityPeriod: number;
  warnings: string[];
}

const AdvancedFormulaCalculator: React.FC = () => {
  const [targetVolume, setTargetVolume] = useState(1000);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [scalingFactor, setScalingFactor] = useState(1.0);
  const [bufferSystem, setBufferSystem] = useState('HEPES');

  // Sample ingredients database
  const ingredientDatabase = [
    {
      name: 'Sodium Chloride (NaCl)',
      molecularWeight: 58.44,
      defaultConcentration: 0.9,
      unit: '%',
      cost: 0.05,
      hazardClass: 'Safe' as const
    },
    {
      name: 'HEPES',
      molecularWeight: 238.31,
      defaultConcentration: 25,
      unit: 'mM',
      cost: 2.50,
      hazardClass: 'Irritant' as const
    },
    {
      name: 'Glucose',
      molecularWeight: 180.16,
      defaultConcentration: 5.5,
      unit: 'mM',
      cost: 0.15,
      hazardClass: 'Safe' as const
    },
    {
      name: 'Sodium Pyruvate',
      molecularWeight: 110.04,
      defaultConcentration: 1,
      unit: 'mM',
      cost: 1.25,
      hazardClass: 'Safe' as const
    },
    {
      name: 'BSA (Bovine Serum Albumin)',
      molecularWeight: 66500,
      defaultConcentration: 3,
      unit: 'mg/mL',
      cost: 15.00,
      hazardClass: 'Safe' as const
    }
  ];

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: `ing-${Date.now()}`,
      name: '',
      stockConcentration: 0,
      stockUnit: 'mg/mL',
      targetConcentration: 0,
      targetUnit: 'mg/mL',
      molecularWeight: 0,
      purity: 100,
      density: 1.0,
      stockVolume: 0,
      calculatedVolume: 0,
      calculatedMass: 0,
      cost: 0,
      supplier: '',
      lotNumber: '',
      expiryDate: '',
      storageTemp: '4°C',
      hazardClass: 'Safe'
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(prev => 
      prev.map(ing => 
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const calculateConcentrations = () => {
    const warnings: string[] = [];
    let totalCost = 0;
    let osmolarity = 0;
    let estimatedpH = 7.4;

    const updatedIngredients = ingredients.map(ing => {
      let calculatedVolume = 0;
      let calculatedMass = 0;

      // Convert target concentration to mg/mL for consistency
      let targetConc = ing.targetConcentration;
      if (ing.targetUnit === 'mM' && ing.molecularWeight) {
        targetConc = (ing.targetConcentration * ing.molecularWeight) / 1000;
      } else if (ing.targetUnit === 'μM' && ing.molecularWeight) {
        targetConc = (ing.targetConcentration * ing.molecularWeight) / 1000000;
      } else if (ing.targetUnit === '%') {
        targetConc = ing.targetConcentration * 10; // % w/v to mg/mL
      }

      // Calculate required mass for target volume
      const requiredMass = (targetConc * targetVolume * scalingFactor) / 1000; // in grams

      // Calculate volume needed from stock solution
      if (ing.stockConcentration > 0) {
        let stockConc = ing.stockConcentration;
        if (ing.stockUnit === 'mM' && ing.molecularWeight) {
          stockConc = (ing.stockConcentration * ing.molecularWeight) / 1000;
        } else if (ing.stockUnit === 'μM' && ing.molecularWeight) {
          stockConc = (ing.stockConcentration * ing.molecularWeight) / 1000000;
        } else if (ing.stockUnit === '%') {
          stockConc = ing.stockConcentration * 10;
        }

        calculatedVolume = (targetConc * targetVolume * scalingFactor) / stockConc;
        
        // Account for purity
        if (ing.purity < 100) {
          calculatedVolume = calculatedVolume / (ing.purity / 100);
          calculatedMass = calculatedMass / (ing.purity / 100);
        }
      } else {
        // Direct weighing
        calculatedMass = requiredMass;
        if (ing.purity < 100) {
          calculatedMass = calculatedMass / (ing.purity / 100);
        }
      }

      // Cost calculation
      const ingredientCost = calculatedMass * ing.cost;
      totalCost += ingredientCost;

      // Osmolarity contribution (simplified)
      if (ing.targetUnit === 'mM') {
        osmolarity += ing.targetConcentration;
      }

      // Warnings
      if (calculatedVolume > targetVolume * 0.1) {
        warnings.push(`${ing.name}: Large volume (${calculatedVolume.toFixed(1)} mL) may affect final volume`);
      }
      if (ing.hazardClass !== 'Safe') {
        warnings.push(`${ing.name}: ${ing.hazardClass} - Use appropriate safety measures`);
      }

      return {
        ...ing,
        calculatedVolume,
        calculatedMass
      };
    });

    setIngredients(updatedIngredients);

    // pH estimation based on buffer system
    if (bufferSystem === 'HEPES') {
      estimatedpH = 7.4;
    } else if (bufferSystem === 'MOPS') {
      estimatedpH = 7.2;
    } else if (bufferSystem === 'Phosphate') {
      estimatedpH = 7.4;
    }

    const result: CalculationResult = {
      totalVolume: targetVolume * scalingFactor,
      finalVolume: targetVolume * scalingFactor,
      osmolarity: osmolarity,
      estimatedpH: estimatedpH,
      totalCost: totalCost,
      preparationTime: Math.max(30, ingredients.length * 5),
      stabilityPeriod: 21,
      warnings
    };

    setCalculation(result);
  };

  const scaleFormula = (factor: number) => {
    setScalingFactor(factor);
    setTargetVolume(prev => Math.round(prev * factor));
  };

  const exportFormula = () => {
    const formulaData = {
      targetVolume,
      scalingFactor,
      bufferSystem,
      ingredients,
      calculation,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(formulaData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-formula-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (ingredients.length > 0) {
      calculateConcentrations();
    }
  }, [targetVolume, scalingFactor, ingredients.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <span>Advanced Formula Calculator</span>
          </h2>
          <p className="text-gray-600">Precise ingredient calculations with scaling and cost analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportFormula}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Formula Configuration</CardTitle>
            <CardDescription>Set target volume and buffer system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="targetVolume">Target Volume (mL)</Label>
                <Input
                  id="targetVolume"
                  type="number"
                  value={targetVolume}
                  onChange={(e) => setTargetVolume(parseFloat(e.target.value))}
                  className="text-lg font-bold"
                />
              </div>
              <div>
                <Label htmlFor="scalingFactor">Scaling Factor</Label>
                <Input
                  id="scalingFactor"
                  type="number"
                  step="0.1"
                  value={scalingFactor}
                  onChange={(e) => setScalingFactor(parseFloat(e.target.value))}
                  className="text-lg font-bold"
                />
              </div>
              <div>
                <Label htmlFor="bufferSystem">Buffer System</Label>
                <Select value={bufferSystem} onValueChange={setBufferSystem}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEPES">HEPES (pH 7.4)</SelectItem>
                    <SelectItem value="MOPS">MOPS (pH 7.2)</SelectItem>
                    <SelectItem value="Phosphate">Phosphate (pH 7.4)</SelectItem>
                    <SelectItem value="Bicarbonate">Bicarbonate (pH 7.4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => scaleFormula(0.5)}>
                ×0.5
              </Button>
              <Button variant="outline" size="sm" onClick={() => scaleFormula(2)}>
                ×2
              </Button>
              <Button variant="outline" size="sm" onClick={() => scaleFormula(5)}>
                ×5
              </Button>
              <Button variant="outline" size="sm" onClick={() => scaleFormula(10)}>
                ×10
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Add Ingredients</CardTitle>
            <CardDescription>Common lab chemicals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ingredientDatabase.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const newIngredient: Ingredient = {
                      id: `ing-${Date.now()}-${index}`,
                      name: item.name,
                      stockConcentration: item.defaultConcentration * 10,
                      stockUnit: item.unit,
                      targetConcentration: item.defaultConcentration,
                      targetUnit: item.unit,
                      molecularWeight: item.molecularWeight,
                      purity: 100,
                      density: 1.0,
                      calculatedVolume: 0,
                      calculatedMass: 0,
                      cost: item.cost,
                      supplier: 'Sigma-Aldrich',
                      lotNumber: `LOT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      storageTemp: '4°C',
                      hazardClass: item.hazardClass
                    };
                    setIngredients([...ingredients, newIngredient]);
                  }}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {item.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ingredient Calculations</CardTitle>
              <CardDescription>Precise measurements and costs</CardDescription>
            </div>
            <Button onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Target Conc.</TableHead>
                  <TableHead>Stock Conc.</TableHead>
                  <TableHead>MW</TableHead>
                  <TableHead>Purity %</TableHead>
                  <TableHead>Volume Needed</TableHead>
                  <TableHead>Mass Needed</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>
                      <Input
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Input
                          type="number"
                          step="0.001"
                          value={ingredient.targetConcentration}
                          onChange={(e) => updateIngredient(ingredient.id, 'targetConcentration', parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <Select
                          value={ingredient.targetUnit}
                          onValueChange={(value) => updateIngredient(ingredient.id, 'targetUnit', value)}
                        >
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mg/mL">mg/mL</SelectItem>
                            <SelectItem value="mM">mM</SelectItem>
                            <SelectItem value="μM">μM</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="g/L">g/L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Input
                          type="number"
                          step="0.001"
                          value={ingredient.stockConcentration}
                          onChange={(e) => updateIngredient(ingredient.id, 'stockConcentration', parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <Select
                          value={ingredient.stockUnit}
                          onValueChange={(value) => updateIngredient(ingredient.id, 'stockUnit', value)}
                        >
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mg/mL">mg/mL</SelectItem>
                            <SelectItem value="mM">mM</SelectItem>
                            <SelectItem value="μM">μM</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="g/L">g/L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={ingredient.molecularWeight || ''}
                        onChange={(e) => updateIngredient(ingredient.id, 'molecularWeight', parseFloat(e.target.value))}
                        placeholder="MW"
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        value={ingredient.purity}
                        onChange={(e) => updateIngredient(ingredient.id, 'purity', parseFloat(e.target.value))}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">
                          {ingredient.calculatedVolume.toFixed(3)} mL
                        </div>
                        <div className="text-xs text-gray-500">
                          {(ingredient.calculatedVolume * 1000).toFixed(0)} μL
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-bold text-green-600">
                          {ingredient.calculatedMass.toFixed(4)} g
                        </div>
                        <div className="text-xs text-gray-500">
                          {(ingredient.calculatedMass * 1000).toFixed(1)} mg
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">
                          ${(ingredient.calculatedMass * ingredient.cost).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={ingredient.hazardClass === 'Safe' ? 'default' : 'secondary'}
                        className={
                          ingredient.hazardClass === 'Safe' ? 'bg-green-100 text-green-800' :
                          ingredient.hazardClass === 'Irritant' ? 'bg-yellow-100 text-yellow-800' :
                          ingredient.hazardClass === 'Toxic' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }
                      >
                        {ingredient.hazardClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Calculation Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {calculation.finalVolume.toFixed(0)} mL
                  </div>
                  <div className="text-sm text-gray-600">Final Volume</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${calculation.totalCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {calculation.osmolarity.toFixed(0)} mOsm/L
                  </div>
                  <div className="text-sm text-gray-600">Osmolarity</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {calculation.estimatedpH.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Estimated pH</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Warnings & Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {calculation.warnings.length > 0 ? (
                  calculation.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm">{warning}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">No warnings detected</span>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Preparation Time:</span>
                    <span className="font-medium">{calculation.preparationTime} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stability Period:</span>
                    <span className="font-medium">{calculation.stabilityPeriod} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button size="lg" onClick={calculateConcentrations}>
          <Calculator className="h-5 w-5 mr-2" />
          Calculate Formula
        </Button>
        <Button variant="outline" size="lg">
          <Save className="h-5 w-5 mr-2" />
          Save Formula
        </Button>
        <Button variant="outline" size="lg">
          <Beaker className="h-5 w-5 mr-2" />
          Create Batch
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFormulaCalculator; 