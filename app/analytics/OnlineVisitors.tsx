type Props = { count: number | Record<string, unknown> };

export function OnlineVisitors({ count }: Props) {
  if (typeof count !== 'number') {
    return <p>Erro na requisição: {JSON.stringify(count)}</p>;
  }

  return (
    <p>
      {count} visitante{count > 1 ? 's' : ''} online
    </p>
  );
}
