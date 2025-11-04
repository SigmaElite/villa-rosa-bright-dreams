const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Вилла Роза</h3>
            <p className="text-primary-foreground/80">
              Мини-отель в самом сердце Гомеля, где классический стиль встречается с современным комфортом.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#rooms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Номера
                </a>
              </li>
              <li>
                <a href="#booking" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Бронирование
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Контакты</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>ул. Ильича, 150</li>
              <li>Гомель, Беларусь</li>
              <li>
                <a href="tel:+375333559767" className="hover:text-primary-foreground transition-colors">
                  +375 33 355-97-67
                </a>
              </li>
              <li>Круглосуточно</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Вилла Роза. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
