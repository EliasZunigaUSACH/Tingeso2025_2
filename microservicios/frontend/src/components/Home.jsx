const Home = () => {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>ToolRent</h1>
      <p>
        ToolRent es un negocio de alquiler de herramientas. Esta aplicación ha sido desarrollada usando tecnologías como{" "}
        <a href="https://spring.io/projects/spring-boot">Spring Boot</a> (para
        el backend), <a href="https://reactjs.org/">React</a> (para el Frontend),
        <a href="https://www.keycloak.org/">Keycloak</a> (para la gestión de autenticación)
        y <a href="https://www.postgresql.org/download/">PostgreSQL</a> (para la
        base de datos).
      </p>
    </div>
  );
};

export default Home;