import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <p>Aplicação em Next.js para experimentos 🚀</p>

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
