import React from 'react';

export function Header() {
  return (
    <header className="bg-accent text-accent-foreground py-6 text-center shadow-md rounded-lg mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Registro de Higiene das Mãos
        </h1>
        <p className="text-lg text-accent-foreground/90">
          Monitore a adesão às práticas de higiene de forma eficiente
        </p>
      </div>
    </header>
  );
}
