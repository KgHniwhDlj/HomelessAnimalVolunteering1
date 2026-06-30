import AuthorizationForm from '../features/auth/AuthorizationForm';

export default function AuthPage() {
  return (
    <section
      className="infoInput"
      style={{ justifyContent: 'center', flexDirection: 'column' }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>Авторизация в системе ZooManager</h1>
      </header>
      <AuthorizationForm />
    </section>
  );
}