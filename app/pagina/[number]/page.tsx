import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { number: string } }) {
  const number = +params.number;

  if (isNaN(number)) {
    redirect('/');
  }

  const nextPage = number + 1;
  const previousPage = number - 1;

  return (
    <main>
      <p>Você está na página {number}</p>

      <p>
        <Link href={previousPage >= 2 ? `/pagina/${previousPage}` : '/'}>Página anterior</Link> |{' '}
        <Link href={`/pagina/${nextPage}`}>Próxima página</Link>
      </p>
      <p>
        <Link href='/'>Voltar para a página inicial</Link>
      </p>

      <p>{'🚀'.repeat(number)}</p>
    </main>
  );
}
