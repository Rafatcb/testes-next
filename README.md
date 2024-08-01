Repositório para testes com o uso do Next.js e hospedagem na Vercel e outros ambientes.

## Analytics

### Vercel Analytics

Para usar o [Analytics da Vercel](https://vercel.com/docs/analytics) em React, basta habilitá-lo no seu projeto da Vercel, instalar o pacote `@vercel/analytics` e importar o componente e usá-lo, por exemplo:

```jsx
import { Analytics } from '@vercel/analytics/react';

function Componente {
  return (
    <div>
      <Analytics />
      <p>Meu componente.</p>
    </div>
  );
}
```

Esse componente fará uma requisição `GET /_vercel/insights/script.js` que contém o script para realizar as requisições de analytics, como `POST /_vercel/insights/view` ou `POST /_vercel/insights/event`.

A visualização dos dados na Vercel é desta forma:

![Gráfico para quantidade de visitantes únicos por dia e para visualizações de páginas por dia. Tabelas para as páginas visitadas, referrers, países, sistemas operacionais, navegadores, eventos e flags.](./public/vercel-analytics.png)
