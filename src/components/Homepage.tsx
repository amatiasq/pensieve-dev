export function Homepage() {
  return (
    <div
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        height: '100vh',
        'font-size': '2rem',
      }}
    >
      <div>
        No repository selected Wanna try one?
        <ul
          style={{
            display: 'flex',
            'flex-direction': 'column',
            gap: '1rem',
          }}
        >
          <li>
            <a href="amatiasq/pensieve-dev/">The source of this app</a>
          </li>
          <li>
            <a href="amatiasq/amatiasq.com/">amatiasq.com</a>
          </li>
          <li>
            <a href="solidjs/solid/">solidjs</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
