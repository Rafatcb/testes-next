import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <h1>Testando analytics 🚀</h1>
      <p className={styles.paragraph}>Estou testando o Tinybird como alternativa ao Analytics da Vercel. Sua visita já está colaborando com a análise. Obrigado!</p>

      <p>
        <Link href='/pagina/2'>Ir para a próxima página</Link>
      </p>
      <p>
        <Link href='https://tabnews.com.br'>Ir para o TabNews</Link>
      </p>

      <Image className={styles.logo} src='/logo.svg' alt='TabNews Logo' width={180} height={180} />
    </main>
  );
}
