// src/utils/normalizeAndFormatCpf.util.ts
export function normalizeAndFormatCpf(cpf: string): string {
    const normalizedCpf = cpf.replace(/[\.\-]/g, ""); // Remove pontos e traços
    return normalizedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); 
  }
