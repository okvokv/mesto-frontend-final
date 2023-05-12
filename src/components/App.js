import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import avatar from '../images/avatar.png';
import auth from '../utils/auth.js';
import api from '../utils/api.js';
import Header from './Header.js';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';
import Main from './Main.js';
import Footer from './Footer.js';
import AvatarEditPopup from './EditAvatarPopup.js'
import ProfileEditPopup from './EditProfilePopup.js'
import CardAddPopup from './AddPlacePopup.js';
import PopupWithConfirmation from './ConfirmationPopup.js';
import ImagePopup from './ImagePopup.js';
import InfoTooltip from './InfoTooltip.js';

//гибридный элемент всего проекта
function App() {
  //---------------------------------------------------------------------------------
  //обьявление значения почты и пароля пользователя в глобальной области
  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');
  //объявление данных пользователя в глобальной области
  const [currentUserData, setCurrentUserData] = useState({ name: 'Жак-Ив Кусто', about: 'Исследователь океана', avatar: avatar });
  //объявление состояния индикатора входа в глобальной области
  const [loggedIn, setLoggedIn] = useState(false);
  //задание переменной навигации и извлечения теущего адреса
  const navigate = useNavigate();
  const location = useLocation();
  //объявление данных массива карточек в глобальной области
  const [cardsData, setCardsData] = useState([]);

  // сверка жетона при открытии страницы
  useEffect(() => {
    api.getUserData()
      .then(userData => {
        setUserEmail(userData.email);
        setCurrentUserData(userData);
        setLoggedIn(true);
        navigate('/');
        //получение массива карточек, однократно
        api.getAllCardsData()
          .then(cardsData => setCardsData(cardsData))
          .catch(err => console.log('Внутренняя ошибка: ', err))
      })
      .catch(err => {
        setLoggedIn(false);
        console.log('Внутренняя ошибка: ', err);
      })
  }, [0, navigate]);

  //----------------------------------------------------------------------------------
  //объявление переменных очистки форм
  const [avatarFormReset, setAvatarFormReset] = useState(false);
  const [cardFormReset, setCardFormReset] = useState(false);

  //функция закрытия попапов
  function closeAllPopups() {
    setAvatarEditPopupOpened(false);
    setProfileEditPopupOpened(false);
    setCardAddPopupOpened(false);
    setPopupWithConfirmationOpened(false);
    setImagePopupOpened(false);
    setClickedImage({});
    setInfoTooltipOpened(false);
  };

  //-------------------------------------------------------------------------------
  //задание текста кнопки header'а в глобальной области
  const [headerBtnText, setHeaderBtnText] = useState('Регистрация')
  //задание текста кнопки сохранения в глобальной области
  const [submitBtnText, setSubmitBtnText] = useState('Войти');

  //функция для изменения текста кнопки при отправке данных
  function changeSubmitBtnText(text) {
    setSubmitBtnText(text);
  };

  //----------------------------------------------------------------------------

  //функция отправки данных для авторизации и обработки ответа
  function handleLogIn(email, password) {
    auth.logIn(email, password)
      .then(data => {
        // сохранить полученный жетон
        localStorage.setItem('jwt', data.token); // или он сам сохраняется в куках
        setUserEmail(email);
        setLoggedIn(true);
        navigate('/');
      })
      .catch(err => {
        setLoggedIn(false);
        setSubmitBtnText('Ошибка. Попробуйте снова');
        console.log('Внутренняя ошибка: ', err);
      })
  };

  //объявление состояния попапа информации о регистрации в глобальной области
  const [infoTooltipOpened, setInfoTooltipOpened] = useState(false);
  //объявление состояния регистрации в глобальной области
  const [regSuccess, setRegSuccess] = useState(false);

  //функция отправки данных на регистрацию и обработки ответа
  function handleRegistration(email, password) {
    auth.registrate(email, password)
      .then(() => {
        setRegSuccess(true);
        setUserEmail(email);
        setUserPwd(password);
        setInfoTooltipOpened(true);
        navigate('/sign-in');
      })
      .catch(err => {
        setRegSuccess(false);
        console.log('Внутренняя ошибка: ', err);
        setInfoTooltipOpened(true);
      })
  };

  //функция переключения страницы
  function handleTogglePage() {
    if (location.pathname === '/sign-in') {
      setHeaderBtnText('Вход');
      navigate('/sign-up');
      return;
    }
    setHeaderBtnText('Регистрация');
    navigate('/sign-in');
  };

  //функция обработки выхода с сайта
  function handleLogOut() {
    localStorage.removeItem('jwt');
    setSubmitBtnText('Войти');
    setUserEmail('');
    setUserPwd('');
    setLoggedIn(false);
  };

  //----------------------------------------------------------------------------------
  //объявление состояния попапа с аватаром в глобальной области
  const [avatarEditPopupOpened, setAvatarEditPopupOpened] = useState(false);
  //функция обработки нажатия на аватар
  function handleAvatarBtnClick() {
    setSubmitBtnText('Сохранить');
    setAvatarEditPopupOpened(true);
  };

  //объявление состояния попапа с профилем в глобальной области
  const [profileEditPopupOpened, setProfileEditPopupOpened] = useState(false);
  //функция обработки нажатия на кнопку редактировать профиль
  function handleProfileBtnClick() {
    setSubmitBtnText('Сохранить');
    setProfileEditPopupOpened(true);
  };

  //объявление состояния попапа добавления контента в глобальной области
  const [cardAddPopupOpened, setCardAddPopupOpened] = useState(false);
  //функция обработки нажатия на кнопку добавления контента
  function handleCardBtnClick() {
    setSubmitBtnText('Создать');
    setCardAddPopupOpened(true);
  };

  //объявление состояния попапа с большой картинкой в глобальной области
  const [imagePopupOpened, setImagePopupOpened] = useState(false);
  //объявление данных нажатой картики в глобальной области
  const [clickedImage, setClickedImage] = useState({});
  //функция обработки нажатия на картинку
  function handleImageClick(cardData) {
    setClickedImage(cardData);
    setImagePopupOpened(true);
  };

  //объявление состояния попапа подтверждения удаления в глобальной области
  const [popupWithConfirmationOpened, setPopupWithConfirmationOpened] = useState(false);
  //функция обработки нажатия на корзину 
  function handleDeleteCardClick(cardId) {
    setClickedImage(cardId);
    setSubmitBtnText('Да');
    setPopupWithConfirmationOpened(true);
  };

  //---------------------------------------------------------------------------------  
  //функция отправки данных для смены аватара
  function handleUpdateAvatar(link) {
    api.setAvatar(link)
      .then(data => {
        setCurrentUserData(data);
        closeAllPopups();
        setAvatarFormReset(!avatarFormReset);
      })
      .catch(err => {
        setSubmitBtnText('Ошибка. Попробуйте снова');
        console.log('Внутренняя ошибка: ', err);
      })
  };

  //функция отправки данных для обновления данных пользователя
  function handleUpdateUser(name, description) {
    api.setUserInfo(name, description)
      .then(data => {
        setCurrentUserData(data);
        closeAllPopups();
        //очистить сообщ. об ошибке
      })
      .catch(err => {
        setSubmitBtnText('Ошибка. Попробуйте снова');
        console.log('Внутренняя ошибка: ', err);
      })
  };

  //функция отправки данных для добавления новой карточки  
  function handleCardAdd(cardName, cardLink) {
    api.addNewCard(cardName, cardLink)
      .then(newCardData => {
        setCardsData([newCardData, ...cardsData]);
        closeAllPopups();
        setCardFormReset(!cardFormReset);
      })
      .catch(err => {
        setSubmitBtnText('Ошибка. Попробуйте снова');
        console.log('Внутренняя ошибка: ', err);
      })
  };

  //функция отправки данных для удаления карточки  
  function handleDeleteCard(cardId) {
    //запрос в api и удаление из массива всех карточек с cardId 
    api.deleteCard(cardId)
      .then(() => {
        setCardsData(cardsData => cardsData.filter(cardData => cardData._id !== cardId));
        closeAllPopups();
      })
      .catch(err => {
        setSubmitBtnText('Ошибка. Попробуйте снова');
        console.log('Внутренняя ошибка: ', err);
      })
  };

  //-----------------------------------------------------------------------
  //функция обработки нажатия на кнопку <Like>
  function handleLikeClick(cardId, liked) {
    //запрос в api, получение обновлённых данных карточки и замена их в массиве
    (liked ? api.deleteLike(cardId) : api.setLike(cardId))
      .then(newCardData => setCardsData(cardsData.map(cardData => (cardData._id === cardId) ? newCardData : cardData)))
      .catch(err => console.log('Внутренняя ошибка: ', err))
  };

  //-----------------------------------------------------------------------
  return (
    <CurrentUserContext.Provider value={currentUserData}>
      <div className="page">

        {/*Секция заголовок ======================================= */}
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          btnText={headerBtnText}
          onTogglePage={handleTogglePage}
          onLogOut={handleLogOut}
        />
        <Routes>
          <Route path='/' element={
            <ProtectedRoute
              //Основная секция ======================================//
              element={Main}
              cardsData={cardsData}
              onAvatarBtnClick={handleAvatarBtnClick}
              onProfileBtnClick={handleProfileBtnClick}
              onCardBtnClick={handleCardBtnClick}
              onImageClick={handleImageClick}
              onCardDelete={handleDeleteCardClick}
              onLikeClick={handleLikeClick}
              loggedIn={loggedIn}
            />}
          />
          <Route path='/sign-up' element={
            <Register
              btnText='Зарегистрироваться'
              onTogglePage={handleTogglePage}
              onRegistration={handleRegistration}
            />}
          />
          <Route path='/sign-in' element={
            <Login
              btnText={submitBtnText}
              changeBtnText={changeSubmitBtnText}
              email={userEmail}
              password={userPwd}
              onLogIn={handleLogIn}
            />}
          />
          <Route path="*" element={
            <Navigate to='/' replace />}
          />
        </Routes>

        {/*Подножие сайта =========================================*/}
        <Footer />

        {/*Всплывающие окна c формой смены аватара ================*/}
        <AvatarEditPopup
          btnText={submitBtnText}
          changeBtnText={changeSubmitBtnText}
          opened={avatarEditPopupOpened}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          reset={avatarFormReset}
        />

        {/*Всплывающие окна c формой редактирования профиля ========*/}
        <ProfileEditPopup
          btnText={submitBtnText}
          changeBtnText={changeSubmitBtnText}
          opened={profileEditPopupOpened}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        {/*Всплывающие окна c формой добавления контента ===========*/}
        <CardAddPopup
          btnText={submitBtnText}
          changeBtnText={changeSubmitBtnText}
          opened={cardAddPopupOpened}
          onClose={closeAllPopups}
          onCardAdd={handleCardAdd}
          reset={cardFormReset}
        />

        {/*Всплывающее окно с формой подтверждения удаления ========*/}
        <PopupWithConfirmation
          btnText={submitBtnText}
          changeBtnText={changeSubmitBtnText}
          clickedImage={clickedImage}
          opened={popupWithConfirmationOpened}
          onClose={closeAllPopups}
          onCardDelete={handleDeleteCard}
        />

        {/*Всплывающее окно с картинкой ============================= */}
        <ImagePopup
          selectedCard={clickedImage}
          opened={imagePopupOpened}
          onClose={closeAllPopups}
        />

        {/*всплывающее окно с сообщением о регистрации =============== */}
        <InfoTooltip
          success={regSuccess}
          opened={infoTooltipOpened}
          onClose={closeAllPopups}
        />

      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;