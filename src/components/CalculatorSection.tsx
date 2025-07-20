import BasicCalculator from './ui/BasicCalculator';
import ScientificCalculator from './ui/ScientificCalculator';

/**
 * 계산기 섹션 컴포넌트
 * 기본 계산기와 과학 계산기를 나란히 표시
 */
export default function CalculatorSection() {
  return (
    <div className="flex gap-10 justify-center items-start">
      <BasicCalculator />
      <ScientificCalculator />
    </div>
  );
} 