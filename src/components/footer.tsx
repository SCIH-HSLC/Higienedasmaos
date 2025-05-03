import React from 'react';

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-4 text-center mt-12 rounded-lg shadow-md">
      <div className="container mx-auto px-4">
        <p className="text-sm text-accent-foreground/80">
          &copy; {new Date().getFullYear()} - Registro de Higiene das Mãos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
