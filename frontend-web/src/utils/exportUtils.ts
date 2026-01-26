import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface Transaction {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  descricao: string;
  status?: string;
}

export const exportToPDF = (transactions: Transaction[], userName: string) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text('IBank - Extrato de Transações', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Cliente: ${userName}`, 14, 30);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 36);
  
  // Tabela
  autoTable(doc, {
    head: [['Data', 'Tipo', 'Descrição', 'Valor', 'Status']],
    body: transactions.map(t => [
      new Date(t.data).toLocaleDateString('pt-BR'),
      t.tipo,
      t.descricao,
      `R$ ${t.valor.toFixed(2)}`,
      t.status || '-'
    ]),
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 9 }
  });
  
  // Rodapé
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`extrato-ibank-${new Date().getTime()}.pdf`);
};

export const exportToExcel = (transactions: Transaction[], userName: string) => {
  // Preparar dados
  const data = [
    ['IBank - Extrato de Transações'],
    [`Cliente: ${userName}`],
    [`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`],
    [],
    ['Data', 'Tipo', 'Descrição', 'Valor', 'Status'],
    ...transactions.map(t => [
      new Date(t.data).toLocaleDateString('pt-BR'),
      t.tipo,
      t.descricao,
      t.valor,
      t.status || '-'
    ])
  ];
  
  // Criar workbook
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Extrato');
  
  // Ajustar largura das colunas
  ws['!cols'] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 }
  ];
  
  // Salvar arquivo
  XLSX.writeFile(wb, `extrato-ibank-${new Date().getTime()}.xlsx`);
};

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Data', 'Tipo', 'Descrição', 'Valor', 'Status'];
  const rows = transactions.map(t => [
    new Date(t.data).toLocaleDateString('pt-BR'),
    t.tipo,
    t.descricao,
    t.valor.toFixed(2),
    t.status || '-'
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `extrato-ibank-${new Date().getTime()}.csv`;
  link.click();
};
