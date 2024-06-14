export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Clientes',
    path: '/customers',
    icon: 'user'
  },
  {
    text: 'Produtos',
    path: '/products',
    icon: 'product'
  },
  {
    text: 'Financeiro',
    icon: 'money',
    items: [
      {
        text: 'Especies de Pagamento',
        path: '/payment-method',
      },
      {
        text: 'Condições de Pagamento',
        path: '/payment-condition'
      },
    ]
  },
  {
    text: 'Vendas',
    path: '/sales',
    icon: 'cart'
  },
];
