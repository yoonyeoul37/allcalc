"use client";

import { useState, useEffect } from "react";
import { 
  FaCalculator, 
  FaIndustry, 
  FaDollarSign, 
  FaRuler,
  FaInfoCircle,
  FaTools,
  FaHardHat,
  FaTruck,
  FaUsers,
  FaPrint
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface ScaffoldingEstimate {
  totalArea: number;
  pipeUnitPrice: number;
  clampUnitPrice: number;
  footboardUnitPrice: number;
  installationWorkers: number;
  installationLaborCost: number;
  transportationCost: number;
  disassemblyWorkers: number;
  disassemblyLaborCost: number;
  miscellaneousCost: number;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supplierBusinessNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  estimateDate: string;
  estimateNumber: string;
}

export default function ScaffoldingEstimateCalculator() {
  const [estimate, setEstimate] = useState<ScaffoldingEstimate>({
    totalArea: 0,
    pipeUnitPrice: 0,
    clampUnitPrice: 0,
    footboardUnitPrice: 0,
    installationWorkers: 0,
    installationLaborCost: 0,
    transportationCost: 0,
    disassemblyWorkers: 0,
    disassemblyLaborCost: 0,
    miscellaneousCost: 0,
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
    supplierBusinessNumber: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    estimateDate: "",
    estimateNumber: ""
  });

  // 클라이언트 사이드에서 견적번호와 날짜 생성
  useEffect(() => {
    const today = new Date();
    const estimateDate = today.toISOString().split('T')[0];
    const estimateNumber = `EST-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    setEstimate(prev => ({
      ...prev,
      estimateDate,
      estimateNumber
    }));
  }, []);

  // 콤마 포맷팅 함수
  const formatNumber = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  // 입력 처리 함수
  const handleInputChange = (field: keyof ScaffoldingEstimate, value: string) => {
    if (field === 'totalArea' || field === 'pipeUnitPrice' || field === 'clampUnitPrice' || 
        field === 'footboardUnitPrice' || field === 'installationWorkers' || field === 'installationLaborCost' ||
        field === 'transportationCost' || field === 'disassemblyWorkers' || field === 'disassemblyLaborCost' ||
        field === 'miscellaneousCost') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
      setEstimate(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setEstimate(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 프린트 기능
  const handlePrint = () => {
    // 새로운 창에서 프린트용 견적서 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>비계 견적서</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.3;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-section h3 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .info-section p {
              margin: 2px 0;
              font-size: 11px;
            }
            .estimate-info {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
              font-size: 11px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .text-right {
              text-align: right;
            }
            .bg-gray {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .bg-dark {
              background-color: #e0e0e0;
              font-weight: bold;
            }
            .notes {
              margin-bottom: 20px;
              font-size: 11px;
            }
            .notes h3 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .notes p {
              margin: 2px 0;
            }
            .signature {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .signature-section {
              text-align: center;
            }
            .signature-line {
              border-top: 2px solid #000;
              margin-top: 30px;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>비계 견적서</h1>
            <p>SCAFFOLDING ESTIMATE</p>
          </div>

          <div class="info-grid">
            <div class="info-section">
              <h3>공급자 정보</h3>
              <p><strong>상호:</strong> ${estimate.supplierName || "________________"}</p>
              <p><strong>사업자등록번호:</strong> ${estimate.supplierBusinessNumber || "________________"}</p>
              <p><strong>주소:</strong> ${estimate.supplierAddress || "________________"}</p>
              <p><strong>연락처:</strong> ${estimate.supplierPhone || "________________"}</p>
            </div>
            <div class="info-section">
              <h3>공급받는자 정보</h3>
              <p><strong>상호:</strong> ${estimate.customerName || "________________"}</p>
              <p><strong>주소:</strong> ${estimate.customerAddress || "________________"}</p>
              <p><strong>연락처:</strong> ${estimate.customerPhone || "________________"}</p>
            </div>
          </div>

          <div class="estimate-info">
            <div><strong>견적번호:</strong> ${estimate.estimateNumber}</div>
            <div><strong>견적일자:</strong> ${estimate.estimateDate}</div>
            <div><strong>공사면적:</strong> ${estimate.totalArea}평</div>
          </div>

          <h3>견적 내역</h3>
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th class="text-right">수량</th>
                <th class="text-right">단가</th>
                <th class="text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>파이프</td>
                <td class="text-right">${totalEstimate.materialCost.totalPipes.toFixed(0)}개</td>
                <td class="text-right">${formatNumber(estimate.pipeUnitPrice)}원</td>
                <td class="text-right">${formatNumber(totalEstimate.materialCost.pipeCost)}원</td>
              </tr>
              <tr>
                <td>클램프</td>
                <td class="text-right">${totalEstimate.materialCost.totalClamps.toFixed(0)}개</td>
                <td class="text-right">${formatNumber(estimate.clampUnitPrice)}원</td>
                <td class="text-right">${formatNumber(totalEstimate.materialCost.clampCost)}원</td>
              </tr>
              <tr>
                <td>발판</td>
                <td class="text-right">${totalEstimate.materialCost.totalFootboards.toFixed(0)}개</td>
                <td class="text-right">${formatNumber(estimate.footboardUnitPrice)}원</td>
                <td class="text-right">${formatNumber(totalEstimate.materialCost.footboardCost)}원</td>
              </tr>
              <tr class="bg-gray">
                <td colspan="3"><strong>자재비 합계</strong></td>
                <td class="text-right"><strong>${formatNumber(totalEstimate.materialCost.totalMaterialCost)}원</strong></td>
              </tr>
              <tr>
                <td>시공 인건비</td>
                <td class="text-right">${estimate.installationWorkers}명</td>
                <td class="text-right">${formatNumber(estimate.installationLaborCost)}원</td>
                <td class="text-right">${formatNumber(totalEstimate.laborCost.installationCost)}원</td>
              </tr>
              <tr>
                <td>해체 인건비</td>
                <td class="text-right">${estimate.disassemblyWorkers}명</td>
                <td class="text-right">${formatNumber(estimate.disassemblyLaborCost)}원</td>
                <td class="text-right">${formatNumber(totalEstimate.laborCost.disassemblyCost)}원</td>
              </tr>
              <tr class="bg-gray">
                <td colspan="3"><strong>인건비 합계</strong></td>
                <td class="text-right"><strong>${formatNumber(totalEstimate.laborCost.totalLaborCost)}원</strong></td>
              </tr>
              <tr>
                <td>운반비</td>
                <td class="text-right">-</td>
                <td class="text-right">-</td>
                <td class="text-right">${formatNumber(totalEstimate.transportationCost)}원</td>
              </tr>
              <tr>
                <td>기타비</td>
                <td class="text-right">-</td>
                <td class="text-right">-</td>
                <td class="text-right">${formatNumber(totalEstimate.miscellaneousCost)}원</td>
              </tr>
              <tr class="bg-gray">
                <td colspan="3"><strong>공급가액</strong></td>
                <td class="text-right"><strong>${formatNumber(totalEstimate.subtotal)}원</strong></td>
              </tr>
              <tr class="bg-gray">
                <td colspan="3"><strong>부가세 (10%)</strong></td>
                <td class="text-right"><strong>${formatNumber(totalEstimate.vat)}원</strong></td>
              </tr>
              <tr class="bg-dark">
                <td colspan="3"><strong>총 견적 금액 (부가세 포함)</strong></td>
                <td class="text-right"><strong>${formatNumber(totalEstimate.totalCost)}원</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="notes">
            <h3>비고</h3>
            <p>• 본 견적서는 유효기간 30일입니다.</p>
            <p>• 견적 금액은 부가가치세 포함입니다.</p>
            <p>• 공사 기간 및 조건은 별도 협의합니다.</p>
            <p>• 현장 사정에 따라 견적이 변동될 수 있습니다.</p>
          </div>

          <div class="signature">
            <div class="signature-section">
              <p>공급자</p>
              <div class="signature-line">
                <p><strong>${estimate.supplierName || "________________"}</strong></p>
                <p>(인)</p>
              </div>
            </div>
            <div class="signature-section">
              <p>공급받는자</p>
              <div class="signature-line">
                <p><strong>${estimate.customerName || "________________"}</strong></p>
                <p>(인)</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // 계산 함수들
  const calculateMaterialCost = () => {
    // 평당 필요한 자재량 (예시 값)
    const pipesPerPyeong = 2.5; // 평당 파이프 개수
    const clampsPerPyeong = 4.0; // 평당 클램프 개수
    const footboardsPerPyeong = 1.5; // 평당 발판 개수

    const totalPipes = estimate.totalArea * pipesPerPyeong;
    const totalClamps = estimate.totalArea * clampsPerPyeong;
    const totalFootboards = estimate.totalArea * footboardsPerPyeong;

    const pipeCost = totalPipes * estimate.pipeUnitPrice;
    const clampCost = totalClamps * estimate.clampUnitPrice;
    const footboardCost = totalFootboards * estimate.footboardUnitPrice;

    return {
      totalPipes,
      totalClamps,
      totalFootboards,
      pipeCost,
      clampCost,
      footboardCost,
      totalMaterialCost: pipeCost + clampCost + footboardCost
    };
  };

  const calculateLaborCost = () => {
    const installationCost = estimate.installationWorkers * estimate.installationLaborCost;
    const disassemblyCost = estimate.disassemblyWorkers * estimate.disassemblyLaborCost;
    
    return {
      installationCost,
      disassemblyCost,
      totalLaborCost: installationCost + disassemblyCost
    };
  };

  const calculateTotalCost = () => {
    const materialCost = calculateMaterialCost();
    const laborCost = calculateLaborCost();
    
    const subtotal = materialCost.totalMaterialCost + 
                     laborCost.totalLaborCost + 
                     estimate.transportationCost + 
                     estimate.miscellaneousCost;
    
    const vat = subtotal * 0.1; // 부가세 10%
    const totalCost = subtotal + vat;

    return {
      materialCost,
      laborCost,
      transportationCost: estimate.transportationCost,
      miscellaneousCost: estimate.miscellaneousCost,
      subtotal,
      vat,
      totalCost
    };
  };

  const totalEstimate = calculateTotalCost();

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaIndustry className="text-4xl text-gray-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">비계 견적서 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">건설, 공사, 인테리어 비계 견적 및 비용 계산</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 입력 섹션 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 input-section">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaCalculator className="mr-2" />
                견적 정보 입력
              </h2>
              
                            <div className="space-y-6">
                {/* 견적서 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      견적번호
                    </label>
                    <input
                      type="text"
                      value={estimate.estimateNumber}
                      onChange={(e) => handleInputChange('estimateNumber', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                      placeholder="견적번호"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      견적일자
                    </label>
                    <input
                      type="date"
                      value={estimate.estimateDate}
                      onChange={(e) => handleInputChange('estimateDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 공급자 정보 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">공급자 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        공급자명
                      </label>
                      <input
                        type="text"
                        value={estimate.supplierName}
                        onChange={(e) => handleInputChange('supplierName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="공급자명"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        사업자등록번호
                      </label>
                      <input
                        type="text"
                        value={estimate.supplierBusinessNumber}
                        onChange={(e) => handleInputChange('supplierBusinessNumber', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="000-00-00000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        주소
                      </label>
                      <input
                        type="text"
                        value={estimate.supplierAddress}
                        onChange={(e) => handleInputChange('supplierAddress', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="공급자 주소"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={estimate.supplierPhone}
                        onChange={(e) => handleInputChange('supplierPhone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="000-0000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* 공급받는자 정보 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">공급받는자 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        공급받는자명
                      </label>
                      <input
                        type="text"
                        value={estimate.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="공급받는자명"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={estimate.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="000-0000-0000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        주소
                      </label>
                      <input
                        type="text"
                        value={estimate.customerAddress}
                        onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="공급받는자 주소"
                      />
                    </div>
                  </div>
                </div>

                {/* 전체 평수 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRuler className="inline mr-2" />
                    전체 평수
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={formatNumber(estimate.totalArea)}
                      onChange={(e) => handleInputChange('totalArea', e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                      placeholder="100"
                    />
                    <span className="ml-2 text-gray-600">평</span>
                  </div>
                </div>

                {/* 자재 단가 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTools className="inline mr-2" />
                      파이프 단가
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formatNumber(estimate.pipeUnitPrice)}
                        onChange={(e) => handleInputChange('pipeUnitPrice', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="5000"
                      />
                      <span className="ml-2 text-gray-600">원</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTools className="inline mr-2" />
                      클램프 단가
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formatNumber(estimate.clampUnitPrice)}
                        onChange={(e) => handleInputChange('clampUnitPrice', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="3000"
                      />
                      <span className="ml-2 text-gray-600">원</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTools className="inline mr-2" />
                      발판 단가
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formatNumber(estimate.footboardUnitPrice)}
                        onChange={(e) => handleInputChange('footboardUnitPrice', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="8000"
                      />
                      <span className="ml-2 text-gray-600">원</span>
                    </div>
                  </div>
                </div>

                {/* 시공 인건비 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUsers className="inline mr-2" />
                      시공 인원수
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={estimate.installationWorkers}
                        onChange={(e) => handleInputChange('installationWorkers', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="4"
                      />
                      <span className="ml-2 text-gray-600">명</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2" />
                      시공 인건비(1인당)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formatNumber(estimate.installationLaborCost)}
                        onChange={(e) => handleInputChange('installationLaborCost', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="150000"
                      />
                      <span className="ml-2 text-gray-600">원</span>
                    </div>
                  </div>
                </div>

                {/* 운반비 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTruck className="inline mr-2" />
                    운반비
                  </label>
                  <div className="flex items-center">
                                         <input
                       type="text"
                       value={formatNumber(estimate.transportationCost)}
                       onChange={(e) => handleInputChange('transportationCost', e.target.value)}
                                               className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="200000"
                     />
                    <span className="ml-2 text-gray-600">원</span>
                  </div>
                </div>

                {/* 해체 인건비 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUsers className="inline mr-2" />
                      해체 인원수
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={estimate.disassemblyWorkers}
                        onChange={(e) => handleInputChange('disassemblyWorkers', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="3"
                      />
                      <span className="ml-2 text-gray-600">명</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2" />
                      해체 인건비(1인당)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formatNumber(estimate.disassemblyLaborCost)}
                        onChange={(e) => handleInputChange('disassemblyLaborCost', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="120000"
                      />
                      <span className="ml-2 text-gray-600">원</span>
                    </div>
                  </div>
                </div>

                {/* 기타비 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaInfoCircle className="inline mr-2" />
                    기타비
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={formatNumber(estimate.miscellaneousCost)}
                      onChange={(e) => handleInputChange('miscellaneousCost', e.target.value)}
                                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                        placeholder="100000"
                    />
                    <span className="ml-2 text-gray-600">원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 result-section">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaDollarSign className="mr-2" />
                  견적 결과
                </h2>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPrint className="mr-2" />
                  프린트하기
                </button>
              </div>

              <div className="space-y-6">
                {/* 자재비 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">자재비</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>파이프 ({totalEstimate.materialCost.totalPipes.toFixed(0)}개)</span>
                      <span className="font-medium">{formatNumber(totalEstimate.materialCost.pipeCost)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>클램프 ({totalEstimate.materialCost.totalClamps.toFixed(0)}개)</span>
                      <span className="font-medium">{formatNumber(totalEstimate.materialCost.clampCost)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>발판 ({totalEstimate.materialCost.totalFootboards.toFixed(0)}개)</span>
                      <span className="font-medium">{formatNumber(totalEstimate.materialCost.footboardCost)}원</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                      <span>자재비 합계</span>
                      <span>{formatNumber(totalEstimate.materialCost.totalMaterialCost)}원</span>
                    </div>
                  </div>
                </div>

                {/* 인건비 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">인건비</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>시공 인건비 ({estimate.installationWorkers}명)</span>
                      <span className="font-medium">{formatNumber(totalEstimate.laborCost.installationCost)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>해체 인건비 ({estimate.disassemblyWorkers}명)</span>
                      <span className="font-medium">{formatNumber(totalEstimate.laborCost.disassemblyCost)}원</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                      <span>인건비 합계</span>
                      <span>{formatNumber(totalEstimate.laborCost.totalLaborCost)}원</span>
                    </div>
                  </div>
                </div>

                {/* 기타 비용 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">기타 비용</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>운반비</span>
                      <span className="font-medium">{formatNumber(totalEstimate.transportationCost)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>기타비</span>
                      <span className="font-medium">{formatNumber(totalEstimate.miscellaneousCost)}원</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                      <span>기타비 합계</span>
                      <span>{formatNumber(totalEstimate.transportationCost + totalEstimate.miscellaneousCost)}원</span>
                    </div>
                  </div>
                </div>

                {/* 공급가액 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">공급가액</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatNumber(totalEstimate.subtotal)}원
                    </div>
                  </div>
                </div>

                {/* 부가세 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">부가세 (10%)</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatNumber(totalEstimate.vat)}원
                    </div>
                  </div>
                </div>

                {/* 총 견적 */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">총 견적 금액 (부가세 포함)</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {formatNumber(totalEstimate.totalCost)}원
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      평당 단가: {estimate.totalArea > 0 ? formatNumber(Math.round(totalEstimate.totalCost / estimate.totalArea)) : '0'}원/평
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 정보 */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-6 info-section">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              견적 안내
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>• 평당 필요한 자재량은 공사 규모와 복잡도에 따라 달라질 수 있습니다.</p>
              <p>• 인건비는 지역과 시기, 숙련도에 따라 변동될 수 있습니다.</p>
              <p>• 운반비는 거리와 자재량에 따라 추가 비용이 발생할 수 있습니다.</p>
              <p>• 기타비에는 안전장비, 보험료, 관리비 등이 포함됩니다.</p>
              <p>• 정확한 견적은 현장 답사 후 산출하는 것을 권장합니다.</p>
            </div>
          </div>

          
        </div>
      </div>

      <Footer />
    </div>
  );
} 