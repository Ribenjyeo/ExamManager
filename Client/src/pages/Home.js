import Nav from "../components/Nav";

const Home = () => {

  const handleClick = (e) => {
    e.preventDefault()
    window.location.assign('/auth')
  }


  return (
    <div className="overlay">
      <Nav />
      <div className="reminder">
        Незабывайте при первом входе в аккаунт
        <br />
        изменить данные пользователя.
      </div>
      <div className="home">
        <ol className="list-preview">
          <li>
            <article>
              <div className="entry-header">
                <p>Задание №1: Определить объекты домена</p>
              </div>
              <div className="markdown">
                <p>
                  Описание: С помощью встроенной справки операционной системы
                  или других источников информации определите, какие ещё
                  объекты, кроме пользователей и компьютеров, могут быть в
                  домене. Какие из них может создать администратор домена, а
                  какие появляются автоматически.
                </p>
              </div>
              <div className="link-container">
                <p class="link">https://example.com/share</p>
                <button class="copy-btn">Скопировать</button>
              </div>
            </article>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
