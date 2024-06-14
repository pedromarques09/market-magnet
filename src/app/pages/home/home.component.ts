import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  updates: Update[] = [
    {
      title: 'Atualização de Segurança',
      description: 'Correção de vulnerabilidades críticas.',
      date: new Date('2024-05-01'),
    },
    {
      title: 'Nova Funcionalidade',
      description: 'Adição da funcionalidade de relatórios avançados.',
      date: new Date('2024-05-15'),
    },
    {
      title: 'Melhorias de Performance',
      description: 'Otimizações para carregamento mais rápido.',
      date: new Date('2024-06-01'),
    },
  ];
}

interface Update {
  title: string;
  description: string;
  date: Date;
}
