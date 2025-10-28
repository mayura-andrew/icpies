export interface ProceedingsData {
  year: number;
  title: string;
  date: string;
  pages: string;
  pdfUrl: string;
  description?: string;
  highlights?: string[];
}

export const proceedingsData: ProceedingsData[] = [
  {
    year: 2025,
    title: "ICPIES 2025 Proceedings",
    date: "September 2025",
    pages: "100+",
    pdfUrl: "/proceedings-2025.pdf",
    description: "Second International Conference on Plastics, Innovations and Environmental Sustainability",
    highlights: [
      "50+ research papers",
      "International collaborations",
      "Sustainable solutions focus"
    ]
  },
  {
    year: 2024,
    title: "ICPIES 2024 Proceedings",
    date: "September 2024",
    pages: "150+",
    pdfUrl: "/proceedings-2024.pdf",
    description: "First International Conference on Plastics, Innovations and Environmental Sustainability",
    highlights: [
      "Inaugural conference",
      "40+ research papers",
      "Global participation"
    ]
  }
];

export function getProceedingsByYear(year: number): ProceedingsData | undefined {
  return proceedingsData.find(p => p.year === year);
}

export function getAllYears(): number[] {
  return proceedingsData.map(p => p.year).sort((a, b) => b - a);
}
